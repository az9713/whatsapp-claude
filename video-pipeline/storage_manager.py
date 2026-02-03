#!/usr/bin/env python3
"""
fal.ai CDN Storage Manager

Upload files to fal.ai CDN for use with OmniHuman video generation.

Usage: python storage_manager.py audio.mp3 avatar.png
"""

import argparse
import os
import sys
from pathlib import Path

try:
    import fal_client
except ImportError:
    print("Error: fal-client package not installed")
    print("Run: pip install fal-client")
    sys.exit(1)


def upload_file(file_path: str) -> str:
    """Upload a file to fal.ai CDN and return the URL."""

    if not os.path.exists(file_path):
        raise FileNotFoundError(f"File not found: {file_path}")

    print(f"Uploading: {file_path}")

    # Upload to fal.ai CDN
    url = fal_client.upload_file(file_path)

    file_size = os.path.getsize(file_path)
    print(f"  ✅ Uploaded: {Path(file_path).name} ({file_size / 1024:.1f} KB)")
    print(f"  URL: {url}")

    return url


def upload_files(audio_path: str, image_path: str) -> tuple[str, str]:
    """Upload audio and image files to fal.ai CDN."""

    print("Uploading files to fal.ai CDN...\n")

    audio_url = upload_file(audio_path)
    print()
    image_url = upload_file(image_path)

    print("\n" + "=" * 50)
    print("Upload complete!")
    print(f"audio {audio_url}")
    print(f"image {image_url}")
    print("=" * 50)

    return audio_url, image_url


def main():
    parser = argparse.ArgumentParser(
        description="Upload files to fal.ai CDN for OmniHuman video generation",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python storage_manager.py output/voice.mp3 assets/avatar.png
  python storage_manager.py audio.mp3 image.jpg

Output format:
  audio <audio_url>
  image <image_url>
        """
    )

    parser.add_argument("audio", help="Audio file path (MP3, WAV)")
    parser.add_argument("image", help="Image file path (PNG, JPG)")

    args = parser.parse_args()

    # Validate files exist
    if not os.path.exists(args.audio):
        print(f"Error: Audio file not found: {args.audio}")
        sys.exit(1)

    if not os.path.exists(args.image):
        print(f"Error: Image file not found: {args.image}")
        sys.exit(1)

    try:
        upload_files(args.audio, args.image)
    except Exception as e:
        if "FAL_KEY" in str(e) or "authentication" in str(e).lower():
            print("Error: FAL_KEY environment variable not set")
            print("Set it with: export FAL_KEY=your_key_here")
        else:
            print(f"Error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
