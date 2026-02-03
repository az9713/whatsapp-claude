#!/usr/bin/env python3
"""
OmniHuman v1.5 Video Generator

Generate lip-synced avatar videos using fal.ai OmniHuman model.

Usage: python video_generator.py <audio_url> <image_url>
"""

import argparse
import sys
import time

try:
    import fal_client
except ImportError:
    print("Error: fal-client package not installed")
    print("Run: pip install fal-client")
    sys.exit(1)


# OmniHuman model on fal.ai
OMNIHUMAN_MODEL = "fal-ai/omnihuman"


def generate_video(audio_url: str, image_url: str, poll_interval: int = 5) -> str:
    """
    Generate a lip-synced video using OmniHuman v1.5.

    Args:
        audio_url: URL to the audio file on fal.ai CDN
        image_url: URL to the avatar image on fal.ai CDN
        poll_interval: Seconds between status checks

    Returns:
        URL to the generated video
    """

    print("Generating avatar video with OmniHuman v1.5...")
    print(f"  Audio: {audio_url[:50]}...")
    print(f"  Image: {image_url[:50]}...")
    print()

    # Submit the job
    handler = fal_client.submit(
        OMNIHUMAN_MODEL,
        arguments={
            "audio_url": audio_url,
            "image_url": image_url,
            "resolution": "720p",
            "fps": 25,
            "face_enhance": True
        }
    )

    request_id = handler.request_id
    print(f"Job submitted: {request_id}")
    print("Waiting for completion...")

    # Poll for completion
    start_time = time.time()
    while True:
        status = handler.status()

        if status.get("status") == "COMPLETED":
            break
        elif status.get("status") == "FAILED":
            error = status.get("error", "Unknown error")
            raise Exception(f"Video generation failed: {error}")

        elapsed = time.time() - start_time
        print(f"  Status: {status.get('status', 'PROCESSING')} ({elapsed:.0f}s elapsed)")
        time.sleep(poll_interval)

    # Get result
    result = handler.get()

    if "video" not in result:
        raise Exception("No video URL in response")

    video_url = result["video"]["url"]

    total_time = time.time() - start_time
    print(f"\n✅ Video generated successfully!")
    print(f"   Time: {total_time:.1f}s")
    print(f"   URL: {video_url}")

    return video_url


def main():
    parser = argparse.ArgumentParser(
        description="Generate lip-synced avatar video using OmniHuman v1.5",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python video_generator.py https://fal.ai/audio.mp3 https://fal.ai/image.png

The audio and image URLs should be from fal.ai CDN (use storage_manager.py first).
        """
    )

    parser.add_argument("audio_url", help="URL to audio file on fal.ai CDN")
    parser.add_argument("image_url", help="URL to avatar image on fal.ai CDN")
    parser.add_argument(
        "--poll-interval",
        type=int,
        default=5,
        help="Seconds between status checks (default: 5)"
    )

    args = parser.parse_args()

    # Basic URL validation
    if not args.audio_url.startswith("http"):
        print("Error: audio_url must be a valid URL")
        sys.exit(1)

    if not args.image_url.startswith("http"):
        print("Error: image_url must be a valid URL")
        sys.exit(1)

    try:
        video_url = generate_video(args.audio_url, args.image_url, args.poll_interval)
        # Print just the URL for easy piping
        print(f"\n{video_url}")
    except Exception as e:
        if "FAL_KEY" in str(e) or "authentication" in str(e).lower():
            print("Error: FAL_KEY environment variable not set")
            print("Set it with: export FAL_KEY=your_key_here")
        else:
            print(f"Error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
