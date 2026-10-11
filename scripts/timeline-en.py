"""Makes the English version of the timeline of information techniques.

The French drawing comes from the thesis repository with its lettering turned
into outlines. This script reads that file, recognises each outlined letter,
and replaces the French labels by English ones set in TeX Gyre Pagella (the
same design as the original Palatino), again as outlines.

  python3 scripts/timeline-en.py

Reads  public/figures/2026-10-11-three-functions.svg
Writes public/figures/2026-10-11-three-functions.en.svg
When the French drawing changes, the line numbers below may shift: run with
--list to print the French lines and their numbers.
"""
import re, sys
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / 'public/figures/2026-10-11-three-functions.svg'
OUT = ROOT / 'public/figures/2026-10-11-three-functions.en.svg'
FONTS = '/usr/share/texmf/fonts/opentype/public/tex-gyre/texgyrepagella-'

# The letters of the ten fonts of the French file, in the order of their outlines.
GLYPHS = {
    0: list('1805927436'), 1: list('TRANSMECLUOKÉIQ'),
    2: list('†sémaphorefnçitlgCbv;c:KDA,WEFMPyNIRT/u()Bdè') + list('Sq’-ùà'),
    3: list('monpled’Étacubiq,sr;évfàkBg-(Mh)OGASCy') + ['fi'] + list('è+x'),
    4: list('480'), 5: list('1895'), 6: list('182907465'),
    7: list('PearlSt:’écigvndu,mpoIsxh;wyjENACGbâçq') + ['fi'] + list('àf(B)'),
    8: list('189520467'), 9: list('télphoneradicumWbg'),
}
BIG, SMALL = 6.96, 4.97
# style: (font file, size, small capitals, letter-spacing in em)
STYLES = {'R': ('regular', BIG, False, 0), 'I': ('italic', BIG, False, 0), 'r': ('regular', SMALL, False, 0),
          'i': ('italic', SMALL, False, 0), 'C': ('bold', BIG, True, 0.09)}
# How far apart two pieces of one line may be, per font of the French file.
REACH = {0: 7.7, 1: 9.3, 2: 8.1, 3: 10.0, 4: 7.8, 5: 5.2, 6: 5.6, 7: 5.8, 8: 5.5, 9: 5.8}
ORIGINAL = {0: 'R', 1: 'C', 2: 'R', 3: 'I', 4: 'I', 5: 'r', 6: 'i', 7: 'i', 8: 'r', 9: 'r'}

# English lines, by the number of the French line they replace. A line is a
# list of (style, text); a leading '>' right-aligns it on the French line's end.
EN = {
    0: [('i', 'the audience sold moves from the airwaves to the platform')],
    1: [('R', '1896 patent; c. 1900 maritime service:')],
    2: [('I', 'patents, leasing, refusal to interconnect')],
    3: [('R', 'broadcasting')],
    5: [('i', 'the pay station')],
    6: [('I', 'audience sold to the advertiser')],
    7: [('i', 'becomes the '), ('r', 'toll')],
    8: [('R', 'French semaphore')],
    9: [('R', '1982 Minitel, '), ('I', 'kiosk')],
    10: [('i', 'poles, workshops')],
    13: [('R', 'telegraph')],
    14: [('i', 'line saturation:')],
    16: [('R', '1876 patent; 1880 telephone: '), ('I', 'leasing')],
    17: [('i', 'multiplexing')],
    18: [('I', 'of the set, franchises; 48,000 subscribers')],
    19: [('I', 'state monopoly')],
    20: [('R', 'telephony')],
    21: ['>', ('C', 'transmit')],
    23: [('R', '1837 patents; 1844 line in service:')],
    24: [('R', '1969 ARPANET: '), ('I', 'public')],
    25: [('R', '2000 platform')],
    26: [('I', 'public commission, then monopolies')],
    27: [('I', 'funding, users’ rules')],
    28: [('I', 'audience sold')],
    29: ['>', ('i', 'the telephone network needs')],
    30: ['>', ('i', 'reliable switching:')],
    32: ['>', ('i', 'the transistor (Bell, 1947)')],
    33: [('I', 'open interface')],
    34: [('R', '1943 contract;')],
    36: [('I', 'classi-compteurs (March)')],
    40: [('R', '1946 ENIAC:')],
    41: [('I', 'public commission')],
    42: [('I', 'mission order')],
    45: [('i', 'leasing of the device,')],
    47: [('i', 'from the telephone to the tabulator')],
    48: ['>', ('i', 'the stored program')],
    50: ['>', ('i', 'passes to the tabulating firms')],
    51: [('R', '1969 unbundling')],
    52: [('I', 'software under licence')],
    53: [('R', 'cloud: three functions')],
    54: ['>', ('C', 'compute')],
    55: [('R', 'in a bundle')],
    58: [('R', '1884 patent; 1890 tabulator (census):')],
    60: [('I', 'leased machine')],
    61: [('I', 'leasing + exclusive cards')],
    62: [('I', 'leased capacity')],
    63: [('R', 'personal computer')],
    65: [('R', '1820 patent; 1851 arithmometer')],
    66: [('R', '1975 Altair;')],
    67: [('I', 'sale, fragmented market')],
    68: [('R', '1981 PC: '), ('I', 'sale')],
    69: [('I', '+ licence')],
    71: [('R', 'volatile memory')],
    72: [('R', 'writing, print')],
    73: [('R', '1877 phonograph; 1887 gramophone:')],
    74: [('I', 'sale of the medium')],
    75: ['>', ('I', 'sale of the recorded medium')],
    76: [('R', 'non-volatile medium,')],
    77: ['>', ('C', 'store')],
    79: [('R', 'kept without power')],
    80: [('R', '1890 punched card')],
    81: [('R', '1989 proposal; 1993 Web:')],
    82: [('I', 'exclusive consumable')],
    83: [('I', 'the file made available')],
    84: [('r', '1895 telephone')], 85: [('r', '2006 cloud')], 87: [('r', '1946 computing')], 88: [('r', '1970 memory')],
    91: ['>', ('C', 'electric grid')],
    92: [('i', '1882 Pearl Street: lighting sold,')],
    93: [('i', '1946 ENIAC, 1958 SAGE: power supply and building')],
    94: [('i', 'the lamp as unit of capacity')],
    95: [('i', 'designed with the machine')],
    96: [('i', '1892 Insull: the load factor; the tramway, a daytime customer; commissions 1907')],
    97: [('i', '2006 the data centre, a load that justifies capacity; 2024 twenty-year nuclear PPAs')],
    103: [('R', 'no constitutive dependence on electricity')],
    104: [('R', 'electricity constitutive of the operation or of holding a state')],
    105: [('R', 'energy drawn continuously for availability')],
    106: [('R', 'hollow circle: patent or demonstration; filled dot: first lasting service')],
    107: [('R', 'lineage extinct after having dominated')],
    108: [('R', 'alternative set aside (non-emergence)')],
    111: [('R', 'connection: substrate or medium taken over')],
    112: [('R', 'the electric grid; ticks mark the years when a function connects to it')],
    113: [('R', 'a substrate taken over (rights of way, workshops, operators)')],
    114: [('R', 'a form or a principle transferred (who pays, on what terms)')],
    115: [('R', 'a problem handed to the next lineage')],
}

fonts = {k: TTFont(FONTS + k + '.otf') for k in ('regular', 'italic', 'bold')}


def glyphs(style, text):
    """Glyph names and advances of a text: old-style figures, small capitals when asked."""
    name, size, smallcaps, track = STYLES[style]
    font = fonts[name]; cmap = font.getBestCmap(); order = set(font.getGlyphOrder())
    out = []
    for ch in text:
        g = cmap[ord(ch.lower() if smallcaps else ch)]
        if smallcaps and g + '.sc' in order: g += '.sc'
        if ch.isdigit() and g + '.oldstyle' in order: g += '.oldstyle'
        out.append((g, font['hmtx'][g][0] / 1000 * size + track * size))
    return font, size, out


def width(segments):
    return sum(a for st, tx in segments for _, a in glyphs(st, tx)[2])


shapes = {}  # (font, glyph, size) -> id and outline, drawn once and reused


def outline(segments, x, y, fill):
    uses = []
    for st, tx in segments:
        font, size, gl = glyphs(st, tx); gs = font.getGlyphSet(); k = size / 1000
        for g, adv in gl:
            key = (STYLES[st][0], g, size)
            if key not in shapes:
                pen = SVGPathPen(gs, lambda v: f'{v:.2f}'.rstrip('0').rstrip('.'))
                gs[g].draw(TransformPen(pen, (k, 0, 0, -k, 0, 0)))
                shapes[key] = (f'en-{len(shapes)}', pen.getCommands())
            if shapes[key][1]:
                uses.append(f'<use xlink:href="#{shapes[key][0]}" x="{x:.2f}" y="{y:.2f}"/>')
            x += adv
    return f'<g fill="{fill}">' + ''.join(uses) + '</g>'


svg = SRC.read_text()
cut = svg.index('</defs>')
runs = []
for m in re.finditer(r'<g fill="([^"]*)" fill-opacity="[^"]*">\s*((?:<use[^>]*/>\s*)+)</g>\n?', svg[cut:]):
    us = re.findall(r'#glyph-(\d+)-(\d+)" x="([\d.]+)" y="([\d.]+)"', m.group(2))
    f = int(us[0][0]); last = GLYPHS[f][int(us[-1][1])]
    end = float(us[-1][2]) + width([(ORIGINAL[f], last)])
    runs.append(dict(last=float(us[-1][2]), text=''.join(GLYPHS[int(a)][int(b)] for a, b, _, _ in us), f=f, x=float(us[0][2]), end=end,
                     y=float(us[0][3]), fill=m.group(1), span=(m.start() + cut, m.end() + cut)))
runs.sort(key=lambda r: (round(r['y'], 1), r['x']))
lines = []
for r in runs:
    L = lines[-1] if lines else None
    if L and abs(L['y'] - r['y']) < 0.2 and r['x'] - L['last'] < REACH[r['f']] and L['fill'] == r['fill']:
        L['text'] += ' ' + r['text']; L['end'] = r['end']; L['last'] = r['last']; L['spans'].append(r['span'])
    else:
        lines.append(dict(x=r['x'], y=r['y'], end=r['end'], last=r['last'], fill=r['fill'], text=r['text'], spans=[r['span']]))

if '--list' in sys.argv:
    for k, L in enumerate(lines): print(k, round(L['x']), round(L['y']), L['text'])
    sys.exit()

remove, added, right = [], [], 0
for k, segments in EN.items():
    L = lines[k]
    align_right = segments[0] == '>'
    segments = [s for s in segments if s != '>']
    x = L['end'] - width(segments) if align_right else L['x']
    right = max(right, x + width(segments))
    added.append(outline(segments, x, L['y'], L['fill']))
    remove += L['spans']
for a, b in sorted(remove, reverse=True):
    svg = svg[:a] + svg[b:]
defs = '<defs>' + ''.join(f'<path id="{i}" d="{d}"/>' for i, d in shapes.values() if d) + '</defs>'
svg = svg.replace('</svg>', defs + '\n' + '\n'.join(added) + '\n</svg>')
# Room on the right for the longest note.
w = max(781.746, right + 6)
svg = svg.replace('width="781.746" height="433.283" viewBox="0 0 781.746 433.283"', f'width="{w:.3f}" height="433.283" viewBox="0 0 {w:.3f} 433.283"')
OUT.write_text(svg)
print(len(EN), 'lines replaced; width', round(w, 1), '; file', OUT.stat().st_size // 1024, 'kB')
