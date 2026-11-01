"""Where the years fall in the exported timelines, for the animation on the site.

Reads the SVG files written by build.sh, finds in each the axis line (and, for
the confluence, the band of the stock at the foot), and writes for each file
its size and its regions: a band of the drawing (y0 to y1, in the SVG's own
units) and the stops that turn a year into an x there (linear between stops).

  python3 -I figures-src/calibrate.py      (after build.sh)
Writes src/data/frises.json
"""
import json, re
from pathlib import Path

HERE = Path(__file__).resolve().parent
FIG = HERE.parent / 'public/figures'

def lines(svg: str):
    """The straight two-point black paths of the file, in the file's units."""
    out = []
    for m in re.finditer(r'<path ([^>]*)/>', svg):
        a = m.group(1)
        d = re.search(r' d="M ([-\d.]+) ([-\d.]+) L ([-\d.]+) ([-\d.]+) "', a)
        if not d or 'rgb(0%, 0%, 0%)' not in a:
            continue
        x1, y1, x2, y2 = map(float, d.groups())
        t = re.search(r'matrix\(([^)]*)\)', a)
        A, B, C, D, E, F = map(float, t.group(1).split(',')) if t else (1, 0, 0, 1, 0, 0)
        p = (A * x1 + C * y1 + E, B * x1 + D * y1 + F)
        q = (A * x2 + C * y2 + E, B * x2 + D * y2 + F)
        w = float(re.search(r'stroke-width="([\d.]+)"', a).group(1)) * abs(A)
        out.append((min(p[0], q[0]), max(p[0], q[0]), p[1], q[1], w))
    return out

def size(svg: str):
    w, h = re.search(r'viewBox="0 0 ([\d.]+) ([\d.]+)"', svg).groups()
    return float(w), float(h)

def horizontal(ls, length_min):
    return sorted([l for l in ls if abs(l[2] - l[3]) < 0.01 and l[1] - l[0] > length_min], key=lambda l: l[1] - l[0], reverse=True)

data = {}
for lang, suffix in [('fr', ''), ('en', '.en')]:
    # Transmit: one axis, 1835 to 1932 (x in cm = (year - 1835) * 0.21).
    svg = (FIG / f'2026-10-11-transmit{suffix}.svg').read_text()
    W, H = size(svg)
    axis = [l for l in horizontal(lines(svg), 200) if l[4] < 0.6][0]
    x0, x1, y = axis[0], axis[1], axis[2]
    data.setdefault('transmit', {})[lang] = {
        'w': W, 'h': H,
        'regions': [{'y0': 0, 'y1': round(y + 3, 2), 'stops': [[1835, round(x0, 2)], [1932, round(x1, 2)]]}],
    }
    # Confluence: the main axis from 1790 (0 cm) to 28.925 cm, 0.075 cm a year
    # to 1935 (10.875 cm) and 0.19 after; the band of the stock, 1969 at 2 cm
    # to 2025 at 30 cm, on the same scale of centimetres.
    svg = (FIG / f'2026-10-11-confluence{suffix}.svg').read_text()
    W, H = size(svg)
    hs = lines(svg)
    axis = [l for l in horizontal(hs, 300) if l[4] < 0.6][0]
    trunk = [l for l in horizontal(hs, 300) if l[4] > 2.5][0]
    cm = (axis[1] - axis[0]) / 28.925
    X = lambda c: round(axis[0] + c * cm, 2)
    data.setdefault('confluence', {})[lang] = {
        'w': W, 'h': H,
        'regions': [
            {'y0': 0, 'y1': round(axis[2] + 3, 2), 'stops': [[1790, X(0)], [1935, X(10.875)], [2030, X(28.925)]]},
            {'y0': round(trunk[2] - 6, 2), 'y1': round(trunk[2] + 6, 2), 'stops': [[1969, X(2.0)], [2025, X(30.0)]]},
        ],
    }
(HERE.parent / 'src/data/frises.json').write_text(json.dumps(data, indent=1))
print(json.dumps(data))
