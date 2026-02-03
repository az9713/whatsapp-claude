#!/usr/bin/env python3
"""
OpenAI TTS Voice Generator

Usage: python voice_generator.py "Your text here" output/voice.mp3 [--voice nova]

Available voices: alloy, echo, fable, onyx, nova, shimmer
"""

import argparse
import os
import sys
from pathlib import Path

try:
    from openai import OpenAI
except ImportError:
    print("Error: openai package not installed")
    print("Run: pip install openai")
    sys.exit(1)


VALID_VOICES = ["alloy", "echo", "fable", "onyx", "nova", "shimmer"]
VALID_MODELS = ["tts-1", "tts-1-hd"]


def generate_voice(text: str, output_path: str, voice: str = "nova", model: str = "tts-1-hd") -> str:
    """Generate voice-over audio from text using OpenAI TTS."""

    if voice not in VALID_VOICES:
        raise ValueError(f"Invalid voice: {voice}. Available: {', '.join(VALID_VOICES)}")

    if model not in VALID_MODELS:
        raise ValueError(f"Invalid model: {model}. Available: {', '.join(VALID_MODELS)}")

    # Initialize OpenAI client
    client = OpenAI()

    print(f"Generating TTS...")
    print(f"  Text: \"{text[:50]}{'...' if len(text) > 50 else ''}\"")
    print(f"  Voice: {voice}")
    print(f"  Model: {model}")
    print(f"  Output: {output_path}")

    # Generate speech
    response = client.audio.speech.create(
        model=model,
        voice=voice,
        input=text
    )

    # Ensure output directory exists
    output_dir = Path(output_path).parent
    output_dir.mkdir(parents=True, exist_ok=True)

    # Write to file
    response.stream_to_file(output_path)

    file_size = os.path.getsize(output_path)
    print(f"\n✅ Audio generated successfully!")
    print(f"   File: {output_path}")
    print(f"   Size: {file_size / 1024:.1f} KB")
    print(f"   Characters: {len(text)}")

    return output_path


def main():
    parser = argparse.ArgumentParser(
        description="Generate voice-over audio using OpenAI TTS",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python voice_generator.py "Hello world" output/hello.mp3
  python voice_generator.py "Professional intro" output/intro.mp3 --voice onyx
  python voice_generator.py "$(cat script.txt)" output/narration.mp3 --voice nova
        """
    )

    parser.add_argument("text", help="Text to convert to speech")
    parser.add_argument("output", help="Output file path (e.g., output/voice.mp3)")
    parser.add_argument(
        "--voice",
        default="nova",
        choices=VALID_VOICES,
        help=f"Voice to use (default: nova)"
    )
    parser.add_argument(
        "--model",
        default="tts-1-hd",
        choices=VALID_MODELS,
        help="Model to use (default: tts-1-hd)"
    )

    args = parser.parse_args()

    try:
        generate_voice(args.text, args.output, args.voice, args.model)
    except Exception as e:
        if "OPENAI_API_KEY" in str(e):
            print("Error: OPENAI_API_KEY environment variable not set")
            print("Set it with: export OPENAI_API_KEY=your_key_here")
        else:
            print(f"Error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
