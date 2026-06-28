"""Remove black background from aset/lp/owl.png (RGBA transparency)."""
from __future__ import annotations

from collections import deque
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
OWL = ROOT / "aset" / "lp" / "owl.png"
PUBLIC = ROOT / "public" / "aset" / "lp" / "owl.png"
THRESHOLD = 42


def is_background(r: int, g: int, b: int) -> bool:
    return max(r, g, b) <= THRESHOLD


def main() -> None:
    img = Image.open(OWL).convert("RGBA")
    w, h = img.size
    px = img.load()
    visited = [[False] * w for _ in range(h)]
    queue: deque[tuple[int, int]] = deque()

    for x in range(w):
        for y in (0, h - 1):
            if is_background(*px[x, y][:3]):
                queue.append((x, y))
                visited[y][x] = True
    for y in range(h):
        for x in (0, w - 1):
            if not visited[y][x] and is_background(*px[x, y][:3]):
                queue.append((x, y))
                visited[y][x] = True

    while queue:
        x, y = queue.popleft()
        r, g, b, _a = px[x, y]
        px[x, y] = (r, g, b, 0)
        for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
            if 0 <= nx < w and 0 <= ny < h and not visited[ny][nx]:
                nr, ng, nb, _na = px[nx, ny]
                if is_background(nr, ng, nb):
                    visited[ny][nx] = True
                    queue.append((nx, ny))

    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a == 0:
                continue
            mx = max(r, g, b)
            if mx <= 70 and r + g - b < 80:
                px[x, y] = (r, g, b, int(min(a, max(0, (mx - 20) * 6))))

    img.save(OWL, "PNG")
    PUBLIC.parent.mkdir(parents=True, exist_ok=True)
    img.save(PUBLIC, "PNG")
    print(f"Updated {OWL} and {PUBLIC}")


if __name__ == "__main__":
    main()
