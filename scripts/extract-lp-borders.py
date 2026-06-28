"""Crop ornate frame and divider strips from the LP border reference sheet."""
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SHEET = ROOT / "aset" / "lp" / "border-sheet.png"
OUT = ROOT / "aset" / "lp" / "borders"

# Fallback: raw export filename if border-sheet not yet copied
FALLBACK = next(
    (p for p in (ROOT / "aset").rglob("*(10).png") if "border" not in p.name.lower()),
    None,
)


def main() -> None:
    source = SHEET if SHEET.exists() else FALLBACK
    if source is None:
        raise SystemExit("border sheet not found")

    if not SHEET.exists() and source:
        SHEET.parent.mkdir(parents=True, exist_ok=True)
        Image.open(source).save(SHEET)

    im = Image.open(SHEET)
    w, h = im.size
    OUT.mkdir(parents=True, exist_ok=True)

    # Top ornate rectangle frame
    frame_h = int(h * 0.44)
    im.crop((0, 0, w, frame_h)).save(OUT / "frame-ornate.png")

    # Five horizontal dividers (equal rows below frame)
    divider_top = frame_h + int(h * 0.04)
    divider_h = h - divider_top
    row_h = divider_h // 5

    names = [
        "divider-star.png",
        "divider-en-simple.png",
        "divider-en-ornate.png",
        "divider-en-compact.png",
        "divider-crest.png",
    ]
    for i, name in enumerate(names):
        y0 = divider_top + i * row_h
        y1 = divider_top + (i + 1) * row_h if i < 4 else h
        im.crop((0, y0, w, y1)).save(OUT / name)

    print(f"Extracted borders to {OUT}")


if __name__ == "__main__":
    main()
