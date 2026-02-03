#!/usr/bin/env python3
"""
Video Post Processor

Add background music, trim, and finalize videos using FFmpeg.

Usage: python post_processor.py input.mp4 music.mp3 output.mp4
"""

import argparse
import os
import subprocess
import sys
from pathlib import Path


def check_ffmpeg():
    """Check if FFmpeg is installed."""
    try:
        subprocess.run(
            ["ffmpeg", "-version"],
            capture_output=True,
            check=True
        )
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        return False


def get_video_duration(video_path: str) -> float:
    """Get video duration in seconds using FFprobe."""
    result = subprocess.run(
        [
            "ffprobe",
            "-v", "error",
            "-show_entries", "format=duration",
            "-of", "default=noprint_wrappers=1:nokey=1",
            video_path
        ],
        capture_output=True,
        text=True
    )
    return float(result.stdout.strip())


def add_background_music(
    video_path: str,
    music_path: str,
    output_path: str,
    music_volume: float = 0.15,
    trim_start: float = 0,
    trim_end: float = 0
) -> str:
    """
    Add background music to video with optional trimming.

    Args:
        video_path: Path to input video
        music_path: Path to background music file
        output_path: Path for output video
        music_volume: Volume of background music (0.0 to 1.0)
        trim_start: Seconds to trim from start
        trim_end: Seconds to trim from end

    Returns:
        Path to the output video
    """

    if not os.path.exists(video_path):
        raise FileNotFoundError(f"Video not found: {video_path}")

    if not os.path.exists(music_path):
        raise FileNotFoundError(f"Music not found: {music_path}")

    print("Post-processing video...")
    print(f"  Video: {video_path}")
    print(f"  Music: {music_path}")
    print(f"  Music volume: {music_volume * 100:.0f}%")

    # Get video duration
    video_duration = get_video_duration(video_path)
    print(f"  Video duration: {video_duration:.1f}s")

    # Calculate actual duration after trimming
    actual_duration = video_duration - trim_start - trim_end
    if actual_duration <= 0:
        raise ValueError("Trim values exceed video duration")

    # Ensure output directory exists
    output_dir = Path(output_path).parent
    output_dir.mkdir(parents=True, exist_ok=True)

    # Build FFmpeg command
    cmd = ["ffmpeg", "-y"]

    # Input video
    if trim_start > 0:
        cmd.extend(["-ss", str(trim_start)])

    cmd.extend(["-i", video_path])

    # Input music
    cmd.extend(["-i", music_path])

    # Duration limit
    if trim_end > 0 or trim_start > 0:
        cmd.extend(["-t", str(actual_duration)])

    # Filter complex: mix audio with volume adjustment
    filter_complex = f"[1:a]volume={music_volume},aloop=loop=-1:size=2e+09[music];[0:a][music]amix=inputs=2:duration=first:dropout_transition=2[aout]"

    cmd.extend([
        "-filter_complex", filter_complex,
        "-map", "0:v",           # Video from first input
        "-map", "[aout]",        # Audio from mix
        "-c:v", "libx264",       # Video codec
        "-preset", "medium",     # Encoding speed/quality
        "-crf", "23",            # Quality (lower = better)
        "-c:a", "aac",           # Audio codec
        "-b:a", "128k",          # Audio bitrate
        "-movflags", "+faststart",  # Web optimization
        output_path
    ])

    print("\nRunning FFmpeg...")

    # Run FFmpeg
    result = subprocess.run(cmd, capture_output=True, text=True)

    if result.returncode != 0:
        print(f"FFmpeg error: {result.stderr}")
        raise Exception("FFmpeg processing failed")

    file_size = os.path.getsize(output_path)
    print(f"\n✅ Post-processing complete!")
    print(f"   Output: {output_path}")
    print(f"   Size: {file_size / 1024 / 1024:.2f} MB")
    print(f"   Duration: {actual_duration:.1f}s")

    return output_path


def main():
    if not check_ffmpeg():
        print("Error: FFmpeg not found")
        print("Install with: brew install ffmpeg (Mac) or apt install ffmpeg (Linux)")
        sys.exit(1)

    parser = argparse.ArgumentParser(
        description="Add background music and post-process video",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python post_processor.py output/avatar.mp4 assets/music/bg.mp3 output/final.mp4
  python post_processor.py video.mp4 music.mp3 output.mp4 --music-volume 0.2
  python post_processor.py video.mp4 music.mp3 output.mp4 --trim-start 2 --trim-end 1
        """
    )

    parser.add_argument("video", help="Input video file path")
    parser.add_argument("music", help="Background music file path")
    parser.add_argument("output", help="Output video file path")
    parser.add_argument(
        "--music-volume",
        type=float,
        default=0.15,
        help="Background music volume 0.0-1.0 (default: 0.15)"
    )
    parser.add_argument(
        "--trim-start",
        type=float,
        default=0,
        help="Seconds to trim from start (default: 0)"
    )
    parser.add_argument(
        "--trim-end",
        type=float,
        default=0,
        help="Seconds to trim from end (default: 0)"
    )

    args = parser.parse_args()

    # Validate volume
    if not 0 <= args.music_volume <= 1:
        print("Error: music-volume must be between 0.0 and 1.0")
        sys.exit(1)

    try:
        add_background_music(
            args.video,
            args.music,
            args.output,
            args.music_volume,
            args.trim_start,
            args.trim_end
        )
    except FileNotFoundError as e:
        print(f"Error: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
