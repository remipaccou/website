#!/bin/bash
# Compiles the thesis timelines kept here, in French and in English, and
# exports them as SVG into public/figures/ (letters as outlines, like the
# timeline already on the site). Needs pdflatex, the TikZ and mathpazo
# packages, and pdftocairo.   bash figures-src/build.sh
set -e
cd "$(dirname "$0")"
python3 -I translate.py
mkdir -p build
for f in confluence transmit; do
  for l in fr en; do
    pdflatex -interaction=nonstopmode -halt-on-error -output-directory=build -jobname="$f.$l" "\def\figfile{$f.$l.tex}\input{wrap.tex}" > /dev/null
    case $l in en) out="../public/figures/2026-10-11-$f.en.svg" ;; *) out="../public/figures/2026-10-11-$f.svg" ;; esac
    pdftocairo -svg "build/$f.$l.pdf" "$out"
    echo "$out"
  done
done
