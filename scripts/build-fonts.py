#!/usr/bin/env python3
"""Download the site's webfonts from Google and emit a local @font-face sheet.

Why self-host at all? A <link> to fonts.googleapis.com is render-blocking *and*
costs a DNS lookup plus a TLS handshake to two extra origins (googleapis for the
CSS, gstatic for the font files), and the CSS has to arrive before the browser
even learns the font URLs. Serving the woff2 files from our own origin removes
one whole round trip from the critical path, and the headline is set in Caveat,
so that round trip was gating the largest text on the page.

Run this only when the font list changes:

    python scripts/build-fonts.py

Writes public/fonts/*.woff2 and src/styles/fonts.css, both of which ARE
committed -- the build must not depend on network access.

Only the latin and latin-ext subsets are kept. Google also serves cyrillic and
devanagari for these families; the site is English, and every @font-face carries
its unicode-range, so a browser downloads a subset only if the page actually
uses a codepoint from it.

Caveat is a variable font: its 400 and 700 entries point at the same file, so it
is declared once with a `font-weight: 400 700` range instead of twice. Kalam is
static and needs a separate file per weight.
"""

import re
import shutil
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
FONT_DIR = ROOT / 'public' / 'fonts'
CSS_OUT = ROOT / 'src' / 'styles' / 'fonts.css'

API = (
    'https://fonts.googleapis.com/css2'
    '?family=Caveat:wght@400;700'
    '&family=Kalam:wght@400;700'
    '&display=swap'
)

# Without a browser UA the API serves legacy truetype instead of woff2.
UA = (
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 '
    '(KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
)

KEEP_SUBSETS = ('latin', 'latin-ext')

# Weights the stylesheet and the UA defaults actually ask for. Kalam 300 was
# requested for a while and never used by any rule, so it was 32 kB of files
# nobody downloaded a glyph from. Headings inherit Kalam and are bold by UA
# default, which is why 700 is needed even though no rule names it.
#
# Families whose weights all resolve to one variable file. The value is the
# `font-weight` range to declare instead of a single value.
VARIABLE = {'Caveat': '400 700'}

# Faces needed for the first paint, so index.html can preload them. Anything
# else is fetched on demand by unicode-range.
PRELOAD = ('caveat-latin.woff2', 'kalam-400-latin.woff2')


def fetch(url):
    request = urllib.request.Request(url, headers={'User-Agent': UA})
    with urllib.request.urlopen(request, timeout=30) as response:
        return response.read()


def parse(css):
    """Yield one dict per @font-face block, tagged with its subset comment.

    The subset is only present as a comment immediately above each block, so the
    blocks cannot be parsed independently of the surrounding text.
    """
    faces = []
    subset = None
    for chunk in re.split(r'(/\* [a-z-]+ \*/)', css):
        comment = re.fullmatch(r'/\* ([a-z-]+) \*/', chunk.strip())
        if comment:
            subset = comment.group(1)
            continue
        for block in re.findall(r'@font-face\s*\{(.*?)\}', chunk, re.S):
            field = lambda name: re.search(rf'{name}:\s*([^;]+);', block)
            url = re.search(r'url\((\S+?)\)', block)
            family = field('font-family')
            weight = field('font-weight')
            unicode_range = field('unicode-range')
            if not (url and family and weight and unicode_range):
                continue
            faces.append({
                'subset': subset,
                'family': family.group(1).strip().strip('\'"'),
                'weight': weight.group(1).strip(),
                'url': url.group(1),
                'range': unicode_range.group(1).strip(),
            })
    return faces


def local_name(face):
    """Stable filename. Variable families omit the weight, since one file
    serves every weight and a name like `caveat-400-latin` would be a lie."""
    stem = face['family'].lower()
    if face['family'] in VARIABLE:
        return f"{stem}-{face['subset']}.woff2"
    return f"{stem}-{face['weight']}-{face['subset']}.woff2"


def main():
    faces = [f for f in parse(fetch(API).decode('utf-8')) if f['subset'] in KEEP_SUBSETS]
    if not faces:
        raise SystemExit('No usable @font-face blocks came back from the API.')

    # Collapse the duplicate weight entries a variable family produces. Keyed on
    # the output filename, so the two Caveat rows for one subset become one.
    unique = {}
    for face in faces:
        unique.setdefault(local_name(face), face)

    if FONT_DIR.exists():
        shutil.rmtree(FONT_DIR)
    FONT_DIR.mkdir(parents=True)

    rules = []
    for name, face in sorted(unique.items()):
        data = fetch(face['url'])
        (FONT_DIR / name).write_bytes(data)
        weight = VARIABLE.get(face['family'], face['weight'])
        print(f"{name:32} {len(data):>7,} bytes  weight {weight}")
        rules.append(
            f"/* {face['family']} {weight} — {face['subset']} */\n"
            '@font-face {\n'
            f"  font-family: '{face['family']}';\n"
            "  font-style: normal;\n"
            f"  font-weight: {weight};\n"
            # swap: show the fallback immediately and repaint when the webfont
            # lands, rather than holding the text invisible.
            '  font-display: swap;\n'
            f"  src: url('/fonts/{name}') format('woff2');\n"
            f"  unicode-range: {face['range']};\n"
            '}'
        )

    header = (
        '/* GENERATED by scripts/build-fonts.py — do not edit by hand.\n'
        '   Re-run that script to change weights or subsets.\n\n'
        '   Committed deliberately: the production build must not need network\n'
        '   access, and these bytes are what removes the render-blocking\n'
        '   request to fonts.googleapis.com from the critical path. */\n\n'
    )
    CSS_OUT.parent.mkdir(parents=True, exist_ok=True)
    CSS_OUT.write_text(header + '\n\n'.join(rules) + '\n', encoding='utf-8')

    total = sum((FONT_DIR / n).stat().st_size for n in unique)
    print(f"\n{len(unique)} files, {total:,} bytes total -> {FONT_DIR}")
    print(f"stylesheet -> {CSS_OUT}")

    missing = [n for n in PRELOAD if n not in unique]
    if missing:
        raise SystemExit(f'PRELOAD names no longer produced by this run: {missing}')
    print('\nindex.html should preload:')
    for name in PRELOAD:
        print(f'  <link rel="preload" href="/fonts/{name}" as="font" '
              'type="font/woff2" crossorigin />')


if __name__ == '__main__':
    main()
