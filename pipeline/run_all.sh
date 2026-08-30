#!/bin/sh
set -eu
ROOT=/workspace
TMP=/tmp/cta5-run
TEMPLATE=/tmp/cta5-official/Human/HumanwithSpriteHand.psd
LAB=$ROOT/public/lab
PY=python3

mkdir -p "$TMP/masks/front" "$TMP/masks/back" "$LAB/masks/front" "$LAB/masks/back" "$LAB/overlays"

echo "== dump template =="
$PY "$ROOT/pipeline/dump_template.py" --template "$TEMPLATE" --out "$LAB/template-tree.json"

echo "== parse front =="
$PY "$ROOT/pipeline/parse_character.py" --image "$LAB/front.png" --out "$TMP/masks/front" --view front

echo "== parse back =="
$PY "$ROOT/pipeline/parse_character.py" --image "$LAB/back.png" --out "$TMP/masks/back" --view back

echo "== fill front =="
$PY "$ROOT/pipeline/fill_template.py" \
  --template "$TEMPLATE" \
  --image "$LAB/front.png" \
  --masks "$TMP/masks/front" \
  --out "$LAB/front_filled.psd" \
  --preview "$LAB/front_filled.png" \
  --report "$TMP/front_report.json" \
  --view front

echo "== fill back =="
$PY "$ROOT/pipeline/fill_template.py" \
  --template "$TEMPLATE" \
  --image "$LAB/back.png" \
  --masks "$TMP/masks/back" \
  --out "$LAB/back_filled.psd" \
  --preview "$LAB/back_filled.png" \
  --report "$TMP/back_report.json" \
  --view back

echo "== publish masks =="
cp "$TMP/masks/front/overlay.png" "$LAB/overlays/front.png"
cp "$TMP/masks/back/overlay.png" "$LAB/overlays/back.png"
cp "$TMP/masks/front/cutout.png" "$LAB/overlays/front_cutout.png"
cp "$TMP/masks/back/cutout.png" "$LAB/overlays/back_cutout.png"
cp "$TMP/masks/front/manifest.json" "$LAB/masks/front/manifest.json"
cp "$TMP/masks/back/manifest.json" "$LAB/masks/back/manifest.json"

for view in front back; do
  mkdir -p "$LAB/masks/$view"
  cp "$TMP/masks/$view"/fill_*.png "$LAB/masks/$view/" 2>/dev/null || true
  cp "$TMP/masks/$view"/0*.png "$LAB/masks/$view/" 2>/dev/null || true
done

echo "== assemble run.json =="
$PY "$ROOT/pipeline/assemble_run.py" \
  --front "$TMP/front_report.json" \
  --back "$TMP/back_report.json" \
  --front-manifest "$TMP/masks/front/manifest.json" \
  --back-manifest "$TMP/masks/back/manifest.json" \
  --out "$LAB/run.json"

echo "== done =="
ls -la "$LAB" "$LAB/overlays" "$LAB/masks/front" | head -80
