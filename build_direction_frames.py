"""
Build public/frames/dir-00.webp … dir-63.webp: 64 frames evenly spaced around the circle
(dir-00 = looking straight up, increasing clockwise in 5.625° steps), from the frames that
extract_frames.py pulled out of character.mp4.

The red backdrop is recoloured to a flat BACKDROP_HEX (the site's main red), so the frames
blend into the page with no visible box or vignette. Also writes dir-center.webp (the
forward-facing pose, recoloured the same way).

The source video only sweeps through the right-hand side (up → right → down); it never looks
left. So the left half is synthesised by mirroring the matching right-hand pose: only the head
and neck are mirrored (about the head's centre line) and blended onto the unmirrored body, so
the lettering on the sweater stays readable.

Run from the project root after extract_frames.py:  python build_direction_frames.py
"""

import os

import cv2
import numpy as np

FRAMES_DIR = os.path.join("public", "frames")
OUTPUT_COUNT = 64

# [pointer angle in degrees, clockwise from straight up] -> source frame-NN index, for the
# right half of the circle. Hand-picked by viewing the extracted frames; the source frames are
# not evenly spaced (0–18 swing right -> up, 18–49 sweep up -> right -> down, 50–63 settle
# forward). Repeating an angle marks a jump between two runs of the video.
RIGHT_HALF_ANCHORS = [
    (0, 15),
    (45, 10),
    (90, 4),
    (90, 21),
    (112, 23),
    (135, 27),
    (180, 40),
]

# Mirror axis: x of the head's centre line in the 720px-wide frames (measured on center.webp).
MIRROR_AXIS_X = 382
# Rows (fraction of frame height) over which the mirrored head blends into the original body.
# Above BLEND_START is fully mirrored; below BLEND_END is untouched (keeps the chest logo).
BLEND_START = 0.64
BLEND_END = 0.70

WEBP_QUALITY = 82

# Site main red (--gb-red). The photo's backdrop is replaced with this flat colour.
BACKDROP_HEX = "#C8102E"
# Backdrop detection in OpenCV HSV (H 0–180): saturated, bright, hue near pure red. Skin and
# lips are hue 6–10 and much darker, so brightness separates them. (low, high) ramps -> soft mask.
HUE_DISTANCE = (3, 6)
SATURATION = (120, 160)
BRIGHTNESS = (130, 170)


def source_frame_for(degrees):
    """Source frame index for a right-half angle (0–180), interpolating between anchors."""
    for (a0, f0), (a1, f1) in zip(RIGHT_HALF_ANCHORS, RIGHT_HALF_ANCHORS[1:]):
        if degrees <= a1:
            t = 1.0 if a1 == a0 else (degrees - a0) / (a1 - a0)
            return round(f0 + (f1 - f0) * t)
    return RIGHT_HALF_ANCHORS[-1][1]


def load(index):
    path = os.path.join(FRAMES_DIR, f"frame-{index:02d}.webp")
    image = cv2.imread(path)
    if image is None:
        raise SystemExit(f"Missing {path}; run extract_frames.py first.")
    return image


def mirror_head(image):
    """Mirror the head about MIRROR_AXIS_X and blend it onto the unmirrored body."""
    height, width = image.shape[:2]
    flip = np.float32([[-1, 0, 2 * MIRROR_AXIS_X], [0, 1, 0]])
    mirrored = cv2.warpAffine(image, flip, (width, height), borderMode=cv2.BORDER_REPLICATE)

    rows = np.arange(height, dtype=np.float32) / height
    alpha = np.clip((BLEND_END - rows) / (BLEND_END - BLEND_START), 0, 1)
    alpha = alpha * alpha * (3 - 2 * alpha)  # smoothstep
    alpha = alpha[:, None, None]
    return (mirrored * alpha + image * (1 - alpha)).astype(np.uint8)


def ramp(values, low, high, rising=True):
    t = np.clip((values - low) / (high - low), 0, 1)
    return t if rising else 1 - t


def recolor_backdrop(image):
    """Replace the red backdrop with flat BACKDROP_HEX, with soft edges at hair and cap."""
    hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV).astype(np.float32)
    hue, sat, val = hsv[..., 0], hsv[..., 1], hsv[..., 2]
    hue_distance = np.minimum(hue, 180 - hue)
    mask = (
        ramp(hue_distance, *HUE_DISTANCE, rising=False)
        * ramp(sat, *SATURATION)
        * ramp(val, *BRIGHTNESS)
    )
    # Only red connected to the frame border is backdrop; this excludes lips and the red
    # accents on the glasses, which can pass the colour test.
    _, labels = cv2.connectedComponents((mask > 0.5).astype(np.uint8))
    border = np.concatenate([labels[0], labels[:, 0], labels[:, -1]])
    backdrop = np.isin(labels, np.unique(border[border > 0])).astype(np.uint8)
    backdrop = cv2.dilate(backdrop, np.ones((5, 5), np.uint8)).astype(np.float32)
    mask = (mask * backdrop)[..., None]
    r, g, b = (int(BACKDROP_HEX[i : i + 2], 16) for i in (1, 3, 5))
    target = np.array([b, g, r], dtype=np.float32)
    return (image * (1 - mask) + target * mask).astype(np.uint8)


def save(image, name):
    out = os.path.join(FRAMES_DIR, name)
    cv2.imwrite(out, recolor_backdrop(image), [cv2.IMWRITE_WEBP_QUALITY, WEBP_QUALITY])


def main():
    step = 360 / OUTPUT_COUNT
    for i in range(OUTPUT_COUNT):
        degrees = i * step
        if degrees <= 180:
            frame = load(source_frame_for(degrees))
        else:
            frame = mirror_head(load(source_frame_for(360 - degrees)))
        save(frame, f"dir-{i:02d}.webp")
    center = cv2.imread(os.path.join(FRAMES_DIR, "center.webp"))
    if center is None:
        raise SystemExit("Missing center.webp; run extract_frames.py first.")
    save(center, "dir-center.webp")
    print(f"Wrote {OUTPUT_COUNT} frames to {FRAMES_DIR}/dir-NN.webp, plus dir-center.webp")


if __name__ == "__main__":
    main()
