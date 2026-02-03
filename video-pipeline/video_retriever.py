#!/usr/bin/env python3
"""
Video Retriever

Download generated videos from fal.ai or other URLs.

Usage: python video_retriever.py <video_url> output/video.mp4
"""

import argparse
import os
import sys
from pathlib import Path

try:
    import requests
except ImportError:
    print("Error: requests package not installed")
    print("Run: pip install requests")
    sys.exit(1)


def download_video(video_url: str, output_path: str, chunk_size: int = 8192) -> str:
    """
    Download a video from URL to local file.

    Args:
        video_url: URL to the video file
        output_path: Local path to save the video
        chunk_size: Download chunk size in bytes

    Returns:
        Path to the downloaded file
    """

    print(f"Downloading video...")
    print(f"  URL: {video_url[:70]}{'...' if len(video_url) > 70 else ''}")
    print(f"  Output: {output_path}")

    # Ensure output directory exists
    output_dir = Path(output_path).parent
    output_dir.mkdir(parents=True, exist_ok=True)

    # Download with streaming
    response = requests.get(video_url, stream=True)
    response.raise_for_status()

    # Get file size if available
    total_size = int(response.headers.get('content-length', 0))

    downloaded = 0
    with open(output_path, 'wb') as f:
        for chunk in response.iter_content(chunk_size=chunk_size):
            if chunk:
                f.write(chunk)
                downloaded += len(chunk)

                if total_size > 0:
                    progress = (downloaded / total_size) * 100
                    print(f"\r  Progress: {progress:.1f}% ({downloaded / 1024 / 1024:.1f} MB)", end="")

    print()  # New line after progress

    file_size = os.path.getsize(output_path)
    print(f"\n✅ Download complete!")
    print(f"   File: {output_path}")
    print(f"   Size: {file_size / 1024 / 1024:.2f} MB")

    return output_path


def main():
    parser = argparse.ArgumentParser(
        description="Download video from URL",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python video_retriever.py https://fal.ai/video.mp4 output/avatar.mp4
  python video_retriever.py "https://example.com/video.mp4" output/downloaded.mp4
        """
    )

    parser.add_argument("url", help="URL to the video file")
    parser.add_argument("output", help="Output file path (e.g., output/video.mp4)")

    args = parser.parse_args()

    # Basic URL validation
    if not args.url.startswith("http"):
        print("Error: URL must start with http:// or https://")
        sys.exit(1)

    try:
        download_video(args.url, args.output)
    except requests.exceptions.RequestException as e:
        print(f"Error downloading video: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
