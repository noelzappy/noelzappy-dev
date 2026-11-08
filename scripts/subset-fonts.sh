#!/bin/sh
# Re-subset Inter (variable, both styles) to the Latin range the site uses, and record the
# covered code points in src/lib/font-subset.json (checked by src/lib/font-coverage.test.ts).
# Needs fonttools + brotli:  python3 -m venv /tmp/v && /tmp/v/bin/pip install fonttools brotli
# Usage: PY=/tmp/v/bin/python3 scripts/subset-fonts.sh <dir with full Inter-*.woff2>
set -e
SRC="${1:?dir with the full Inter woff2 files}"
PY="${PY:-python3}"
UNICODES="U+0020-007E,U+00A0-00FF,U+0131,U+0152-0153,U+2010-2027,U+2030-203A,U+20AC,U+20B5,U+2122,U+2190-2193,U+2212,U+00D7,U+2605"
for f in Inter-Variable Inter-Italic-Variable; do
	"$PY" -m fontTools.subset "$SRC/$f.woff2" --unicodes="$UNICODES" \
		--layout-features='kern,liga,calt,ccmp,locl,mark,mkmk,tnum,case,zero,ss01,cv11' \
		--flavor=woff2 --output-file="static/fonts/$f.woff2"
done
"$PY" - <<'PYEOF'
import json
from fontTools.ttLib import TTFont
cps = sorted(TTFont("static/fonts/Inter-Variable.woff2").getBestCmap().keys())
json.dump(cps, open("src/lib/font-subset.json", "w"))
PYEOF
