"""Compress public/img/*.jpg into src/embeds.json as data URIs for single-file HTML."""
from __future__ import annotations

import base64
import json
import sys
from io import BytesIO
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
IMG_DIR = ROOT / "public" / "img"
OUT = ROOT / "src" / "embeds.json"

# logical key -> filename under public/img
FILES = {
    "westlake": "sight-westlake.jpg",
    "brokenBridge": "sight-westlake.jpg",
    "wuzhen": "sight-wuzhen.jpg",
    "hotelWuzhen": "hotel-wuzhen.jpg",
    "bund": "sight-bund.jpg",
    "lujiazui": "sight-lujiazui.jpg",
    "wukang": "sight-wukang.jpg",
    "xintiandi": "sight-xintiandi.jpg",
    "lingyin": "sight-lingyin.jpg",
    "qinghefang": "sight-qinghefang.jpg",
    "disney": "sight-disney.jpg",
    "yuyuan": "sight-yuyuan.jpg",
    "pvg": "transit-pvg.jpg",
    "waipojia": "food-waipojia.jpg",
    "greentea": "food-greentea.jpg",
    "xinzhouji": "food-xinzhouji.jpg",
    "sanbao": "food-sanbao.jpg",
    "yuxingji": "food-yuxingji.jpg",
    "shengjian": "food-shengjian.jpg",
    "fuxiaoguan": "food-fuxiaoguan.jpg",
}


def compress(path: Path, max_w: int = 960, quality: int = 68) -> bytes:
    im = Image.open(path).convert("RGB")
    if im.width > max_w:
        h = int(im.height * max_w / im.width)
        im = im.resize((max_w, h), Image.Resampling.LANCZOS)
    buf = BytesIO()
    im.save(buf, format="JPEG", quality=quality, optimize=True, progressive=True)
    return buf.getvalue()


def main() -> int:
    out: dict[str, str] = {}
    total = 0
    for key, name in FILES.items():
        path = IMG_DIR / name
        if not path.exists():
            print(f"missing {path}", file=sys.stderr)
            return 1
        data = compress(path)
        total += len(data)
        out[key] = "data:image/jpeg;base64," + base64.b64encode(data).decode("ascii")
        print(f"{key}: {len(data)} bytes <- {name}")
    OUT.write_text(json.dumps(out, ensure_ascii=False), encoding="utf-8")
    print(f"wrote {OUT} ({total} raw jpeg bytes, {OUT.stat().st_size} json)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
