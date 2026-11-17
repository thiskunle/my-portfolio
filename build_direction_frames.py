"""
Build public/frames/dir-00.webp … dir-63.webp: 64 frames evenly spaced around the circle
(dir-00 = looking straight up, increasing clockwise in 5.625° steps), plus dir-center.webp
(the forward-facing pose), straight from the source head-turn video.

The red backdrop is recoloured to a flat BACKDROP_HEX (the site's main red), so the frames
blend into the page with no visible box or vignette.

The source video does not look in every direction. It looks forward, then up and to the
viewer's right, then to the viewer's left, then down, then forward again. ANCHORS maps each
22.5° direction to the video frame that best shows it. Directions the video never shows are
filled by mirroring a pose from the opposite side: only the head and neck are mirrored (about
the head's centre line) and blended onto the unmirrored body, so the sweater lettering stays
readable.

Usage, from the project root:  python build_direction_frames.py path/to/head-turn.mp4
"""

import os
import sys

import cv2
import numpy as np

FRAMES_DIR = os.path.join("public", "frames")
OUTPUT_COUNT = 64

# (pointer angle in degrees clockwise from straight up, video frame index, mirrored?).
# Hand-picked by viewing the video's frames. Between two neighbouring anchors from the same
# continuous run of the video (same mirroring, frames close together) the frame index is
# interpolated; otherwise the nearer anchor is used as is.
ANCHORS = [
    (0.0, 56, False),  # eyes and chin lifted
    (22.5, 66, False),
    (45.0, 80, False),  # up and to the viewer's right
    (67.5, 99, True),
    (90.0, 104, True),  # viewer's right (mirrored three-quarter turn)
    (112.5, 163, False),
    (135.0, 160, False),  # down and to the viewer's right
    (157.5, 156, False),
    (180.0, 151, False),  # down
    (202.5, 146, False),
    (225.0, 144, False),  # down and to the viewer's left
    (247.5, 142, False),
    (270.0, 104, False),  # viewer's left (three-quarter turn)
    (292.5, 100, False),
    (315.0, 80, True),  # up and to the viewer's left (mirrored)
    (337.5, 66, True),
]
# Anchors further apart than this in the video are separate runs (never interpolated).
MAX_RUN_GAP = 20
# The forward-facing resting pose.
CENTER_FRAME = 189

# This video frames the head higher than the layout expects (CursorTrackingCanvas's FACE_Y).
# Shift every frame down by this many pixels, filling the top with backdrop.
SHIFT_DOWN = 90

# Mirror axis: x of the head and neck centre line in the 720px-wide video frames.
MIRROR_AXIS_X = 365
# Rows (fraction of frame height, after SHIFT_DOWN) over which the mirrored head blends into
# the original body. Above BLEND_START is fully mirrored; below BLEND_END is untouched (keeps
# the chest logo readable).
BLEND_START = 0.62
BLEND_END = 0.69
# Below SHOULDER_TOP only a band this many pixels either side of MIRROR_AXIS_X (the neck) is
# mirrored, feathered over NECK_FEATHER pixels, so the shoulders are never mirrored.
SHOULDER_TOP = 0.62
NECK_HALF_WIDTH = 190
NECK_FEATHER = 50

WEBP_QUALITY = 82

# Site main red (--gb-red). The photo's backdrop is replaced with this flat colour.
BACKDROP_HEX = "#C8102E"
# Backdrop detection in OpenCV HSV (H 0–180): saturated, bright, hue near pure red. Skin and
# lips are hue 6–10 and much darker, so brightness separates them. (low, high) ramps -> soft mask.
HUE_DISTANCE = (3, 6)
SATURATION = (120, 160)
BRIGHTNESS = (130, 170)


def read_video(path):
    capture = cv2.VideoCapture(path)
    if not capture.isOpened():
        raise SystemExit(f"Could not open {path}")
    frames = []
    while True:
        ok, frame = capture.read()
        if not ok:
            break
        frames.append(frame)
    capture.release()
    return frames


def pose_for(degrees):
    """(video frame index, mirrored) for a pointer angle, from ANCHORS."""
    for i, (a0, f0, m0) in enumerate(ANCHORS):
        a1, f1, m1 = ANCHORS[(i + 1) % len(ANCHORS)]
        if a1 <= a0:
            a1 += 360
        if a0 <= degrees < a1:
            t = (degrees - a0) / (a1 - a0)
            if m0 == m1 and abs(f1 - f0) <= MAX_RUN_GAP:
                return round(f0 + (f1 - f0) * t), m0
            return (f0, m0) if t < 0.5 else (f1, m1)
    raise ValueError(degrees)


def shift_down(image):
    """Move the picture down by SHIFT_DOWN pixels, repeating the (backdrop) top row above it."""
    top = np.repeat(image[:1], SHIFT_DOWN, axis=0)
    return np.vstack([top, image[: image.shape[0] - SHIFT_DOWN]])


def mirror_head(image):
    """Mirror the head about MIRROR_AXIS_X and blend it onto the unmirrored body."""
    height, width = image.shape[:2]
    flip = np.float32([[-1, 0, 2 * MIRROR_AXIS_X], [0, 1, 0]])
    mirrored = cv2.warpAffine(image, flip, (width, height), borderMode=cv2.BORDER_REPLICATE)

    rows = np.arange(height, dtype=np.float32) / height
    alpha = np.clip((BLEND_END - rows) / (BLEND_END - BLEND_START), 0, 1)
    alpha = alpha * alpha * (3 - 2 * alpha)  # smoothstep

    columns = np.abs(np.arange(width, dtype=np.float32) - MIRROR_AXIS_X)
    neck = np.clip((NECK_HALF_WIDTH + NECK_FEATHER - columns) / NECK_FEATHER, 0, 1)
    below_shoulders = (rows >= SHOULDER_TOP)[:, None]
    alpha = alpha[:, None] * np.where(below_shoulders, neck[None, :], 1)
    alpha = alpha[..., None]
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
    # reflections in the glasses, which can pass the colour test.
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
    if len(sys.argv) != 2:
        raise SystemExit("Usage: python build_direction_frames.py path/to/head-turn.mp4")
    frames = read_video(sys.argv[1])
    os.makedirs(FRAMES_DIR, exist_ok=True)
    step = 360 / OUTPUT_COUNT
    for i in range(OUTPUT_COUNT):
        index, mirrored = pose_for(i * step)
        frame = shift_down(frames[index])
        if mirrored:
            frame = mirror_head(frame)
        save(frame, f"dir-{i:02d}.webp")
    save(shift_down(frames[CENTER_FRAME]), "dir-center.webp")
    print(f"Wrote {OUTPUT_COUNT} frames to {FRAMES_DIR}/dir-NN.webp, plus dir-center.webp")


if __name__ == "__main__":
    main()
