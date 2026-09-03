"""
Compose the 1200x630 social share card (public/social-card.jpg).

Why this exists: og:image was pointing at the 819x1024 portrait. Facebook,
LinkedIn and X all crop a share image to roughly 1.91:1, so a portrait was being
cropped to a band across the middle of the face. This draws a proper landscape
card instead.

It is a JPEG rather than WebP on purpose — several social scrapers still refuse
WebP, and a share card that silently fails to render defeats the point.

Fonts are the site's own Caveat and Kalam, read from FONT_DIR at build time. They
are not committed; download them from the google/fonts repo before running:
  ofl/caveat/Caveat[wght].ttf, ofl/kalam/Kalam-Regular.ttf, ofl/kalam/Kalam-Bold.ttf
"""

import math
import os
from PIL import Image, ImageDraw, ImageFont

FONT_DIR = os.environ.get('FONT_DIR', '/tmp/fonts')

W, H = 1200, 630
SS = 2  # supersample factor; everything below is in final-image units

PAPER = (250, 248, 245)
INK = (26, 26, 26)
INK_LIGHT = (74, 74, 74)
MARKER_RED = (211, 47, 47)
GRID = (0, 0, 0, 15)  # ~0.06 alpha, matching --grid-line
GRID_STEP = 24


def font(name, size, weight=None):
    f = ImageFont.truetype(os.path.join(FONT_DIR, name), size * SS)
    if weight is not None:
        f.set_variation_by_axes([weight])
    return f


def wobble_rect(x, y, w, h, radius=28, amp=2.4, waves=3.0):
    """A rounded rectangle whose edges drift, so it reads as drawn by hand.

    Deterministic: the drift is a sine of position, not random, so re-running
    this script produces a byte-identical card.
    """
    pts = []
    # Straight runs first, each nudged perpendicular to its own direction.
    edges = [
        ((x + radius, y), (x + w - radius, y), (0, -1)),
        ((x + w, y + radius), (x + w, y + h - radius), (1, 0)),
        ((x + w - radius, y + h), (x + radius, y + h), (0, 1)),
        ((x, y + h - radius), (x, y + radius), (-1, 0)),
    ]
    corners = [
        (x + w - radius, y + radius, -90),
        (x + w - radius, y + h - radius, 0),
        (x + radius, y + h - radius, 90),
        (x + radius, y + radius, 180),
    ]

    for i, ((x0, y0), (x1, y1), (nx, ny)) in enumerate(edges):
        span = math.hypot(x1 - x0, y1 - y0)
        steps = max(int(span / 3), 8)
        for s in range(steps + 1):
            t = s / steps
            k = amp * math.sin(t * waves * math.pi + i * 1.7)
            pts.append((x0 + (x1 - x0) * t + nx * k, y0 + (y1 - y0) * t + ny * k))
        cx, cy, start = corners[i]
        for s in range(13):
            a = math.radians(start + s * 90 / 12)
            pts.append((cx + radius * math.cos(a), cy + radius * math.sin(a)))
    return pts


def stamp(draw, pts, width, colour):
    """Stroke a point list with round caps and joins, as SVG would."""
    r = width * SS / 2
    for px, py in pts:
        x, y = px * SS, py * SS
        draw.ellipse((x - r, y - r, x + r, y + r), fill=colour)


def marker_underline(draw, x, y, w, thickness=7):
    """The site's red marker squiggle: a shallow double bow, not a straight rule."""
    pts = []
    steps = max(int(w / 2), 24)
    for s in range(steps + 1):
        t = s / steps
        pts.append((x + w * t, y + 4.5 * math.sin(t * 2.1 * math.pi) - 1.5))
    stamp(draw, pts, thickness, MARKER_RED)


card = Image.new('RGB', (W * SS, H * SS), PAPER)
draw = ImageDraw.Draw(card, 'RGBA')

# Ruled grid, same as the site's paper texture.
for gx in range(0, W, GRID_STEP):
    draw.line([(gx * SS, 0), (gx * SS, H * SS)], fill=GRID, width=SS)
for gy in range(0, H, GRID_STEP):
    draw.line([(0, gy * SS), (W * SS, gy * SS)], fill=GRID, width=SS)

# --- Portrait, right hand side, in a hand-drawn frame ---------------------
PW, PH = 300, 375          # 819x1024 keeps its aspect ratio at this size
PX, PY = 810, 140
TILT = -2.5                # degrees; the site tilts framed images slightly

with Image.open('public/sketch-avatar.webp') as src:
    portrait = src.convert('RGB').resize((PW * SS, PH * SS), Image.LANCZOS)

frame = Image.new('RGBA', (PW * SS + 80, PH * SS + 80), (0, 0, 0, 0))
frame.paste(portrait, (40, 40))
fdraw = ImageDraw.Draw(frame)
stamp(
    fdraw,
    [(x + 40 / SS, y + 40 / SS) for x, y in wobble_rect(0, 0, PW, PH)],
    3.5,
    INK,
)
frame = frame.rotate(TILT, Image.BICUBIC, expand=True)
card.paste(frame, (PX * SS - 40, PY * SS - 40), frame)

# --- Text block, left hand side -------------------------------------------
LEFT = 84

greeting = font('Kalam-Regular.ttf', 30)
name = font('Caveat[wght].ttf', 104, weight=700)
role = font('Kalam-Bold.ttf', 37)
url = font('Kalam-Regular.ttf', 27)

draw.text((LEFT * SS, 166 * SS), 'Hi, I am', font=greeting, fill=INK_LIGHT)

NAME_Y = 202
draw.text((LEFT * SS, NAME_Y * SS), 'Shreyash Mishra', font=name, fill=INK)
name_w = draw.textlength('Shreyash Mishra', font=name) / SS
marker_underline(draw, LEFT - 4, NAME_Y + 132, name_w + 8)

draw.text((LEFT * SS, 354 * SS), 'Full Stack Developer', font=role, fill=INK)
draw.text((LEFT * SS, 400 * SS), '& AI Engineer', font=role, fill=INK)

# Red dot leader before the URL, echoing the site's list bullets.
draw.text((LEFT * SS, 492 * SS), 'shreyashmishra.in', font=url, fill=INK_LIGHT)
url_w = draw.textlength('shreyashmishra.in', font=url) / SS
stamp(draw, [(LEFT + url_w + 16, 503)], 8, MARKER_RED)

# Torn-page edge along the bottom, the site's section divider motif.
edge = [(x, 592 + 3.5 * math.sin(x / 46) + 1.5 * math.sin(x / 13)) for x in range(0, W + 1, 3)]
stamp(draw, edge, 3, INK)

card = card.resize((W, H), Image.LANCZOS)
card.save('public/social-card.jpg', quality=88, optimize=True, progressive=True)
print(f'wrote public/social-card.jpg  {os.path.getsize("public/social-card.jpg")} bytes  {W}x{H}')
