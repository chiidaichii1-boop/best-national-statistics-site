#!/bin/sh
# shots.sh — take the entry's screenshots with headless Chromium.
# Serves app/ locally, screenshots four real renders, converts to JPEG.
set -e
cd "$(dirname "$0")"
CHROME="$HOME/.cache/ms-playwright/chromium-1255/chrome-linux64/chrome"
PORT=8123
PATH="$HOME/workspace/tools/node-v22/bin:$PATH" node serve.ts --port $PORT &
SRV=$!
trap 'kill $SRV 2>/dev/null || true' EXIT
sleep 1

shot() {
  name="$1"; route="$2"; w="$3"; h="$4"
  "$CHROME" --headless --disable-gpu --no-sandbox --hide-scrollbars \
    --window-size="$w,$h" --virtual-time-budget=6000 \
    --screenshot="/tmp/datanusa-$name.png" \
    "http://localhost:$PORT/$route" >/dev/null 2>&1
  python3 - "$name" <<'PY'
import sys
from PIL import Image
name = sys.argv[1]
im = Image.open(f"/tmp/datanusa-{name}.png").convert("RGB")
im.save(f"screenshots/{name}.jpg", "JPEG", quality=82)
print(name, im.size)
PY
}

shot 1-home "#/" 1280 800
shot 2-economy "#/ekonomi" 1280 800
shot 3-provinces "#/provinsi" 1280 800
shot 4-home-phone "#/" 390 844
ls -l screenshots/
