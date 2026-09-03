"""
Rasterise the favicon geometry into the PNG/ICO sizes browsers actually ask for.

There is no SVG rasteriser available on this machine (no cairosvg, rsvg-convert
or inkscape), so the paths from public/favicon.svg are duplicated here and drawn
with Pillow. Keep the three path definitions below in sync with that file.

Strokes are drawn by stamping a filled circle at every sampled point along the
curve. That reproduces SVG's round linecap and linejoin exactly, which matters
because the S is one continuous open stroke with sharp reversals. Everything is
rendered at SUPERSAMPLE and downsampled with LANCZOS, so the stamped circles
never show as facets.
"""

from PIL import Image, ImageDraw

VIEWBOX = 64
SUPERSAMPLE = 2048
SCALE = SUPERSAMPLE / VIEWBOX

PAPER = (250, 248, 245, 255)   # --paper  #faf8f5
INK = (26, 26, 26, 255)        # --ink    #1a1a1a
MARKER_RED = (211, 47, 47, 255)  # --marker-red #d32f2f

# Wobbly rounded square. Each tuple is one cubic segment's (c1, c2, end); the
# path starts at TILE_START and closes back onto it.
TILE_START = (16, 2.5)
TILE = [
    ((30, 1.5), (44, 2), (55, 3.5)),
    ((60, 4), (62, 8), (61.5, 16)),
    ((62.5, 30), (62, 44), (61, 55)),
    ((60.5, 60), (56, 62), (48, 61.5)),
    ((34, 62.5), (20, 62), (9, 61)),
    ((4, 60.5), (2, 56), (2.5, 48)),
    ((1.5, 34), (2, 20), (3, 9)),
    ((3.5, 4), (8, 2), (16, 2.5)),
]

S_START = (44, 21)
S_PATH = [
    ((42, 14.5), (29, 12.5), (22.5, 17)),
    ((16, 21.5), (18.5, 28), (26, 31.2)),
    ((33.5, 34.4), (44, 35), (44, 42)),
    ((44, 48.5), (32, 51.5), (22, 46.5)),
]
S_WIDTH = 7.5

RED_START = (19, 54)
RED_PATH = [((26.5, 52.5), (36, 55), (45.5, 53))]
RED_WIDTH = 4.5


def cubic(p0, c1, c2, p3, steps):
    """Sample one cubic bezier segment, excluding its start point."""
    out = []
    for i in range(1, steps + 1):
        t = i / steps
        u = 1 - t
        a, b, c, d = u * u * u, 3 * u * u * t, 3 * u * t * t, t * t * t
        out.append(
            (
                a * p0[0] + b * c1[0] + c * c2[0] + d * p3[0],
                a * p0[1] + b * c1[1] + c * c2[1] + d * p3[1],
            )
        )
    return out


def flatten(start, segments, steps=600):
    """Turn a start point plus cubic segments into a dense point list."""
    points = [start]
    cursor = start
    for c1, c2, end in segments:
        points.extend(cubic(cursor, c1, c2, end, steps))
        cursor = end
    return points


def to_device(points):
    return [(x * SCALE, y * SCALE) for x, y in points]


def stamp_stroke(draw, points, width, colour):
    """Draw a round-capped, round-joined stroke by stamping circles."""
    r = width * SCALE / 2
    for x, y in to_device(points):
        draw.ellipse((x - r, y - r, x + r, y + r), fill=colour)


def render(opaque_background):
    """Render the icon at SUPERSAMPLE. Opaque fills the whole canvas with ink.

    iOS and Android apply their own rounded mask to a touch icon and composite
    it on an unknown background, so those variants must be full-bleed and fully
    opaque; the wobbly tile edge is only for the transparent favicon.
    """
    base = INK if opaque_background else (0, 0, 0, 0)
    img = Image.new('RGBA', (SUPERSAMPLE, SUPERSAMPLE), base)
    draw = ImageDraw.Draw(img)

    if not opaque_background:
        draw.polygon(to_device(flatten(TILE_START, TILE)), fill=INK)

    stamp_stroke(draw, flatten(S_START, S_PATH), S_WIDTH, PAPER)
    stamp_stroke(draw, flatten(RED_START, RED_PATH), RED_WIDTH, MARKER_RED)
    return img


def save(img, path, size):
    img.resize((size, size), Image.LANCZOS).save(path, optimize=True)
    return path


transparent = render(opaque_background=False)
opaque = render(opaque_background=True)

# Browser tabs: transparent corners look right against any tab colour.
ico_sizes = [16, 32, 48]
ico_frames = [transparent.resize((s, s), Image.LANCZOS) for s in ico_sizes]
ico_frames[-1].save(
    'public/favicon.ico',
    format='ICO',
    sizes=[(s, s) for s in ico_sizes],
    append_images=ico_frames[:-1],
)

# Home screens and install prompts: full-bleed, no transparency.
save(opaque, 'public/apple-touch-icon.png', 180)
save(opaque, 'public/icon-192.png', 192)
save(opaque, 'public/icon-512.png', 512)

print('wrote:')
for p in ['public/favicon.ico', 'public/apple-touch-icon.png',
          'public/icon-192.png', 'public/icon-512.png']:
    import os
    print(f'  {p:34} {os.path.getsize(p):>7} bytes')
