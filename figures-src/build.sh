#!/bin/bash
# Compiles the thesis timelines kept here, in French and in English, and
# the timeline of the essay on the Californian ideology (English only, like
# the essay), and exports them as SVG into public/figures/ (letters as
# outlines, like the timeline already on the site). Needs pdflatex, the TikZ and mathpazo
# packages, and pdftocairo.   bash figures-src/build.sh
set -e
cd "$(dirname "$0")"
python3 -I translate.py
mkdir -p build
for f in confluence transmit; do
  for l in fr en; do
    pdflatex -interaction=nonstopmode -halt-on-error -output-directory=build -jobname="$f.$l" "\def\figfile{build/$f.$l.tex}\input{wrap.tex}" > /dev/null
    case $l in en) out="../public/figures/2026-10-11-$f.en.svg" ;; *) out="../public/figures/2026-10-11-$f.svg" ;; esac
    pdftocairo -svg "build/$f.$l.pdf" "$out"
    echo "$out"
  done
done
python3 -I gen_californian.py
pdflatex -interaction=nonstopmode -halt-on-error -output-directory=build -jobname=californian.en "\def\figfile{californian.en.tex}\input{wrap.tex}" > /dev/null
pdftocairo -svg build/californian.en.pdf ../public/figures/2025-11-10-californian.en.svg
echo ../public/figures/2025-11-10-californian.en.svg
