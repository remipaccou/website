"""Draws the figures of the essay on thermodynamic limits.

Black line work on a transparent ground, set in Computer Modern so the
figures match the text and the equations. Run:  python3 scripts/figures.py
"""
from pathlib import Path
import numpy as np
import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt

OUT = Path(__file__).resolve().parent.parent / "src/content/writing/2025-12-12-the-thermodynamic-limits-of-terrestrial-computational-intelligence"
W = 6.375  # inches: the text column at 96 px per inch
S = 12.5   # points: the size of the captions on the page
K = "#000000"
plt.rcParams.update({
    "font.family": "cmr10", "mathtext.fontset": "cm", "font.size": S,
    "axes.formatter.use_mathtext": True, "axes.unicode_minus": False,
    "svg.fonttype": "path", "savefig.transparent": True,
    "axes.linewidth": 0.6, "xtick.major.width": 0.6, "ytick.major.width": 0.6,
    "xtick.major.size": 4, "ytick.major.size": 4, "xtick.direction": "out", "ytick.direction": "out",
    "text.color": K, "axes.edgecolor": K, "axes.labelcolor": K, "xtick.color": K, "ytick.color": K,
})


def axes(h, left=0.13, right=0.97, bottom=0.12, top=0.97):
    fig = plt.figure(figsize=(W, h))
    ax = fig.add_axes([left, bottom, right - left, top - bottom])
    for side in ("top", "right"):
        ax.spines[side].set_visible(False)
    return fig, ax


def powers(ax, axis, values):
    getattr(ax, f"set_{axis}ticks")(values)
    getattr(ax, f"set_{axis}ticklabels")([rf"$10^{{{v}}}$" for v in values])


def save(fig, name):
    fig.savefig(OUT / name, metadata={"Date": None})
    plt.close(fig)


def figure1():
    """Training compute against the two ceilings."""
    fig, ax = axes(4.3)
    curve = lambda t: 24 + 0.0777 * (t - 2025) ** 2  # shape of the original projection
    t = np.linspace(2025, 2036, 100)
    ax.plot(t, curve(t), color=K, lw=1.6, solid_capstyle="round")
    t = np.linspace(2036, 2037.7, 30)
    ax.plot(t, curve(t), color=K, lw=1.1, ls=(0, (1, 3)))
    for level, name in ((36, "GPT-9"), (40, "GPT-11")):
        ax.axhline(level, color=K, lw=0.6, ls=(0, (6, 4)))
        ax.text(2025.3, level + 0.45, name, va="bottom")
    for level, zone in ((30.5, "feasible"), (38, "climate sacrifice"), (41.6, "planet destructive"), (44.4, "impossible")):
        ax.text(2039.9, level, zone, ha="right", va="center", style="italic")
    ax.axhline(43, color=K, lw=0.6, ls=(0, (6, 4)))
    ax.set_xlim(2025, 2040); ax.set_ylim(24, 46)
    ax.set_xticks([2025, 2028, 2031, 2034, 2037, 2040]); powers(ax, "y", [25, 30, 35, 40, 45])
    ax.set_ylabel("Training compute (FLOP)")
    save(fig, "figure-1-compute-projection.svg")


def stems(name, ylabel, items, lo, hi, ceiling, ceiling_label, ticks, gap=None):
    """Quantities on a logarithmic scale: a thin stem and a dot for each."""
    fig, ax = axes(3.9, bottom=0.2)
    for i, (symbol, label, value, log) in enumerate(items):
        ax.plot([i, i], [lo, log], color=K, lw=0.8)
        ax.plot(i, log, "o", color=K, ms=6.5)
        on_line = abs(log - ceiling) < 0.01
        ax.text(i + 0.1, log + (0.2 if on_line else 0), value, ha="left", va="bottom" if on_line else "center")
        ax.text(i, lo - (hi - lo) * 0.075, symbol, ha="center", va="top")
        ax.text(i, lo - (hi - lo) * 0.155, label, ha="center", va="top", style="italic")
    ax.axhline(ceiling, color=K, lw=0.6, ls=(0, (6, 4)))
    ax.text(-0.5, ceiling + (hi - lo) * 0.02, ceiling_label, ha="left", va="bottom", style="italic")
    if gap:
        x, a, b, text = gap
        ax.annotate("", xy=(x, b), xytext=(x, a), arrowprops=dict(arrowstyle="<->", color=K, lw=0.6, shrinkA=3, shrinkB=3))
        ax.text(x + 0.08, (a + b) / 2, text, va="center")
    ax.set_xlim(-0.55, len(items) - 0.3); ax.set_ylim(lo, hi)
    ax.set_xticks([]); powers(ax, "y", ticks); ax.set_ylabel(ylabel)
    ax.spines["bottom"].set_visible(False)
    save(fig, name)


def figure2():
    stems("figure-2-energy-scenarios.svg", "Power (W)", [
        (r"$E_0$", "today", "100 GW", 11), (r"$E_1$", "2030", "200 GW", 11.3),
        (r"$E_2$", "solar maximum", "1 PW", 15), (r"$E_3$", "nuclear", "50 PW", 16.7),
    ], 10, 18.4, 17.2, "Earth's heat dissipation limit", [10, 12, 14, 16, 18])


def figure3():
    stems("figure-3-compute-efficiency.svg", "Efficiency (FLOPS/W)", [
        (r"$\eta_0$", "H100", r"$10^{13}$", 13), (r"$\eta_1$", "1% of the limit", r"$5\times10^{16}$", 16.7),
        (r"$\eta_2$", "Landauer", r"$5\times10^{18}$", 18.7),
    ], 12, 20.4, 18.7, "thermodynamic ceiling", [12, 14, 16, 18, 20], gap=(0.5, 13, 18.7, r"$10^5\times$"))


def figure4():
    """The ladder: one vertical scale, a rung for each scenario."""
    fig, ax = axes(4.6, left=0.13, right=0.98, bottom=0.04, top=0.97)
    rungs = [
        (25, "GPT-4", "today", ""),
        (31.5, "GPT-6", "C1, market-bounded growth", ""),
        (35.5, "GPT-9", "C2, coordinated national effort", ""),
        (40.2, "GPT-11", "C3, planetary commitment", "warming of 1 to 2 K"),
        (41.86, "GPT-11.5", "C4, catastrophic overshoot", "biosphere collapse"),
    ]
    for log, model, scenario, cost in rungs:
        ax.plot([0, 0.06], [log, log], color=K, lw=0.8)
        ax.plot(0, log, "o", color=K, ms=6.5, clip_on=False)
        ax.text(0.1, log, model, va="center")
        ax.text(0.3, log, scenario, va="center", style="italic")
        if cost:
            ax.text(1.0, log, cost, va="center", ha="right")
    ax.text(1.0, 39.0, "", ha="right")
    ax.set_xlim(0, 1); ax.set_ylim(24, 44)
    ax.set_xticks([]); powers(ax, "y", [25, 30, 35, 40]); ax.set_ylabel("Training compute (FLOP)")
    ax.spines["bottom"].set_visible(False)
    # C3 and C4 sit close together: nudge their text apart, keep the dots true.
    for text in ax.texts:
        y = text.get_position()[1]
        if abs(y - 41.86) < 0.01: text.set_y(42.35)
        if abs(y - 40.2) < 0.01: text.set_y(39.75)
    save(fig, "figure-4-scenarios-ladder.svg")


def figure5():
    """Four walls: a square, one constraint on each side."""
    fig = plt.figure(figsize=(W, 4.5)); ax = fig.add_axes([0, 0, 1, 1]); ax.axis("off")
    ax.set_xlim(0, W); ax.set_ylim(0, 4.5); ax.set_aspect("equal")
    cx, cy, r = W / 2, 2.25, 1.15
    ax.plot([cx - r, cx + r, cx + r, cx - r, cx - r], [cy - r, cy - r, cy + r, cy + r, cy - r], color=K, lw=1.0)
    ax.text(cx, cy + 0.14, "terrestrial", ha="center", va="center", style="italic")
    ax.text(cx, cy - 0.14, "intelligence", ha="center", va="center", style="italic")
    d = 0.2
    ax.text(cx, cy + r + d + 0.3, "Energy", ha="center"); ax.text(cx, cy + r + d, "1 PW from the Sun", ha="center", style="italic")
    ax.text(cx, cy - r - d - 0.12, "Landauer", ha="center", va="top"); ax.text(cx, cy - r - d - 0.42, r"$5\times10^{18}$ FLOPS/W", ha="center", va="top", style="italic")
    ax.text(cx - r - d, cy + 0.14, "Latency", ha="right", va="center"); ax.text(cx - r - d, cy - 0.14, "67 ms across the Earth", ha="right", va="center", style="italic")
    ax.text(cx + r + d, cy + 0.14, "Heat", ha="left", va="center"); ax.text(cx + r + d, cy - 0.14, "Stefan-Boltzmann law", ha="left", va="center", style="italic")
    save(fig, "figure-5-four-walls.svg")


def figure6():
    """Two paradigms, set side by side as two short columns."""
    fig = plt.figure(figsize=(W, 3.3)); ax = fig.add_axes([0, 0, 1, 1]); ax.axis("off")
    ax.set_xlim(0, 1); ax.set_ylim(0, 1)
    cols = [
        (0.27, "Entropic", ["Compute", "Energy", "Scale", "Accumulation"], "planetary sacrifice for\nmomentary capability"),
        (0.73, "Negentropic", ["Organization", "Diversity", "Resilience", "Cultivation"], "sustainable collective\nintelligence"),
    ]
    heads = ["Intelligence", "", "Success", "Method"]
    for x, title, rows, end in cols:
        ax.text(x, 0.93, title, ha="center", va="center", size=S * 1.15, style="italic")
        ax.plot([x - 0.19, x + 0.19], [0.85, 0.85], color=K, lw=0.6)
        heads[1] = rows[0]
        for i, (a, b) in enumerate(zip(heads, rows)):
            ax.text(x, 0.74 - i * 0.115, f"{a} = {b}", ha="center", va="center")
        ax.plot([x - 0.19, x + 0.19], [0.3, 0.3], color=K, lw=0.6)
        ax.text(x, 0.17, end, ha="center", va="center", style="italic", linespacing=1.35)
    ax.annotate("", xy=(0.545, 0.57), xytext=(0.455, 0.57), arrowprops=dict(arrowstyle="->", color=K, lw=0.8))
    save(fig, "figure-6-two-paradigms.svg")


for draw in (figure1, figure2, figure3, figure4, figure5, figure6):
    draw()
