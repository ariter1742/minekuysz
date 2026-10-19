"""云杉寨 · 占位头像生成器
=====================================================
用像素风生成 8×8 的“方块头”头像（128×128 PNG），供成员墙在
没有真实截图时也能正常显示。

用法（在项目根目录执行）：
    python tools/generate-avatars.py

生成结果写入 assets/avatars/01.png … 16.png。
真实头像可以直接覆盖同名文件，或改 data/members.js 里的 avatar 路径，
不需要再运行这个脚本。

依赖：Pillow（若未安装：pip install pillow）
"""

from pathlib import Path
import random

from PIL import Image

# 8×8 像素网格放大到 128×128
GRID = 8
SCALE = 16
SIZE = GRID * SCALE

SKIN_TONES = [
    (241, 201, 168),
    (232, 184, 146),
    (222, 166, 124),
    (201, 143, 96),
    (176, 119, 74),
    (154, 99, 64),
]

HAIR_COLORS = [
    (43, 43, 43),
    (74, 47, 34),
    (107, 74, 47),
    (160, 90, 44),
    (202, 161, 90),
    (46, 59, 78),
    (122, 59, 59),
    (200, 200, 200),
    (61, 40, 40),
    (96, 64, 96),
    (60, 82, 60),
]

ACCENT_COLORS = [
    (126, 201, 106),
    (215, 176, 106),
    (127, 178, 201),
    (196, 158, 214),
    (214, 118, 95),
]


def shade(color, factor):
    """按系数压暗/提亮颜色。"""
    return tuple(max(0, min(255, int(channel * factor))) for channel in color)


def build_face(seed):
    rnd = random.Random(seed)
    skin = rnd.choice(SKIN_TONES)
    hair = rnd.choice(HAIR_COLORS)
    accent = rnd.choice(ACCENT_COLORS)
    eye = (30, 30, 30)
    mouth = shade(skin, 0.62)

    grid = [[skin for _ in range(GRID)] for _ in range(GRID)]

    # 头发：前两行整行 + 第三行不规则刘海
    for y in (0, 1):
        for x in range(GRID):
            grid[y][x] = hair
    fringe = rnd.choice([1, 2, 2, 3])
    for x in range(GRID):
        if x < fringe or x >= GRID - fringe or rnd.random() < 0.3:
            grid[2][x] = hair

    # 帽子 / 头巾
    if rnd.random() < 0.28:
        for y in (0, 1):
            for x in range(GRID):
                grid[y][x] = accent

    # 眼睛
    for x in (2, 5):
        grid[3][x] = eye
        if rnd.random() < 0.55:
            grid[3][x + (1 if x == 2 else -1)] = (245, 245, 245)

    # 眼镜
    if rnd.random() < 0.22:
        grid[3][1] = eye
        grid[3][2] = eye
        grid[3][5] = eye
        grid[3][6] = eye

    # 眉毛
    if rnd.random() < 0.4:
        for x in (2, 5):
            grid[2][x] = shade(hair, 0.75)

    # 嘴
    grid[5][3] = mouth
    grid[5][4] = mouth

    # 两侧阴影
    for y in range(2, GRID):
        grid[y][0] = shade(skin, 0.9)
        grid[y][GRID - 1] = shade(skin, 0.9)

    # 最后一行下巴阴影
    for x in range(GRID):
        grid[GRID - 1][x] = shade(skin, 0.92)

    return grid


def main():
    out_dir = Path(__file__).resolve().parent.parent / "assets" / "avatars"
    out_dir.mkdir(parents=True, exist_ok=True)

    for index in range(1, 17):
        grid = build_face(seed=index * 97)
        image = Image.new("RGB", (GRID, GRID))
        for y in range(GRID):
            for x in range(GRID):
                image.putpixel((x, y), grid[y][x])
        image = image.resize((SIZE, SIZE), Image.NEAREST)
        path = out_dir / f"{index:02d}.png"
        image.save(path)
        print(f"生成 {path.relative_to(out_dir.parent.parent)}")

    print(f"完成：{out_dir}")


if __name__ == "__main__":
    main()
