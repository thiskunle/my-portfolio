import cv2
import os

video_path = r"C:\Projects\grambyte-website\public\character.mp4"
output_folder = r"C:\Projects\grambyte-website\public\frames"

os.makedirs(output_folder, exist_ok=True)

cap = cv2.VideoCapture(video_path)

if not cap.isOpened():
    print("Could not open video.")
    exit()

total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
fps = cap.get(cv2.CAP_PROP_FPS)

print("Video loaded successfully")
print("Total frames:", total_frames)
print("FPS:", fps)

# We want 64 directional frames
num_output_frames = 64

# Your video has 192 frames, so every 3rd frame gives 64 frames exactly
step = total_frames // num_output_frames

if step == 0:
    print("Video does not have enough frames.")
    cap.release()
    exit()

print("Sampling every", step, "frame(s)")

saved = 0

for i in range(num_output_frames):
    source_frame_index = i * step

    # Prevent going out of range
    if source_frame_index >= total_frames:
        source_frame_index = total_frames - 1

    cap.set(cv2.CAP_PROP_POS_FRAMES, source_frame_index)
    success, frame = cap.read()

    if not success:
        print(f"Failed to read frame {source_frame_index}")
        continue

    output_path = os.path.join(output_folder, f"frame-{i:02d}.webp")

    cv2.imwrite(
        output_path,
        frame,
        [cv2.IMWRITE_WEBP_QUALITY, 100]
    )

    print(f"Saved {output_path} from source frame {source_frame_index}")
    saved += 1

# Save the final forward-facing pose as center.webp
center_frame_index = total_frames - 1
cap.set(cv2.CAP_PROP_POS_FRAMES, center_frame_index)
success, center_frame = cap.read()

if success:
    center_output_path = os.path.join(output_folder, "center.webp")
    cv2.imwrite(
        center_output_path,
        center_frame,
        [cv2.IMWRITE_WEBP_QUALITY, 100]
    )
    print(f"Saved {center_output_path} from source frame {center_frame_index}")
else:
    print("Failed to save center.webp")

cap.release()

print()
print("Done.")
print("Directional frames saved:", saved)
print("Plus: center.webp")