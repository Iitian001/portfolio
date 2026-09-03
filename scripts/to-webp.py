"""
Convert the remaining PNG/JPEG assets to WebP.

Quality is chosen per role, not globally: the certificates are opened full-size
in the lightbox and are mostly small text, so they get a high quality and are
checked against a PSNR floor. The avatar is a portrait at a fixed display size,
where a lower quality is invisible and it is the home page's LCP image.

Alpha is dropped when a PNG's alpha channel turns out to be fully opaque, which
is the case for screenshots exported as RGBA. That is a real saving and changes
nothing on screen.
"""

import os
import sys
from PIL import Image, ImageChops

PAPER = (250, 248, 245)  # --paper, the colour every image sits on

TARGETS = [
    # (path, quality, psnr_floor)
    ('public/sketch-avatar.jpg', 82, 34),
    ('public/certificates/cert1.png', 90, 38),
    ('public/certificates/cert2.png', 90, 38),
    ('public/certificates/cert3.png', 90, 38),
    ('public/certificates/cert4.png', 90, 38),
    ('public/certificates/cert5.png', 90, 38),
    ('public/projects/artbloom.png', 88, 36),
    ('public/projects/autogpt-contrib.png', 88, 36),
    ('public/projects/shreyash-code.png', 88, 36),
]


def psnr(a, b):
    """Peak signal-to-noise ratio in dB between two same-size RGB images."""
    diff = ImageChops.difference(a, b)
    hist = diff.convert('L').histogram()
    total = sum(hist)
    mse = sum(i * i * n for i, n in enumerate(hist)) / total
    if mse == 0:
        return float('inf')
    import math
    return 10 * math.log10(255 * 255 / mse)


def flatten(img):
    """Drop alpha, compositing over paper. Returns (image, alpha_was_used)."""
    if img.mode not in ('RGBA', 'LA', 'P'):
        return img.convert('RGB'), False

    img = img.convert('RGBA')
    alpha = img.getchannel('A')
    used = alpha.getextrema()[0] < 255
    if used:
        base = Image.new('RGB', img.size, PAPER)
        base.paste(img, mask=alpha)
        return base, True
    return img.convert('RGB'), False


failures = []
saved = 0

for path, quality, floor in TARGETS:
    if not os.path.exists(path):
        print(f'  SKIP  {path} (missing)')
        continue

    before = os.path.getsize(path)
    out = os.path.splitext(path)[0] + '.webp'

    with Image.open(path) as src:
        flat, had_alpha = flatten(src)

    # method=6 is the slowest, smallest setting; these run once at build time.
    flat.save(out, 'WEBP', quality=quality, method=6)

    with Image.open(out) as check:
        score = psnr(flat, check.convert('RGB'))

    after = os.path.getsize(out)
    saved += before - after
    verdict = 'ok' if score >= floor else 'LOW'
    if score < floor:
        failures.append((out, score, floor))

    print(
        f'  {verdict:>3}  {path:<40} {before:>7} -> {after:>7} '
        f'({100 - after * 100 // before:>2}% smaller)  psnr {score:5.1f}dB'
        f'{"  alpha flattened" if had_alpha else ""}'
    )

print(f'\nsaved {saved} bytes ({saved / 1024:.0f} KB)')

if failures:
    print('\nBelow the quality floor, not acceptable:')
    for out, score, floor in failures:
        print(f'  {out}  {score:.1f}dB < {floor}dB')
    sys.exit(1)
