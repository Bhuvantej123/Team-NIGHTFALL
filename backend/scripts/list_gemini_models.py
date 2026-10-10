"""
backend/scripts/list_gemini_models.py
One-off helper script: lists all Gemini models available for your API key.
Run this before setting GEMINI_MODEL in .env.

Usage (from project root, venv activated, .env configured):
    python backend/scripts/list_gemini_models.py

The output shows model names; pick one that supports generateContent.
Names typically include "flash" or "pro" in the current generation.
"""

import os
import sys
from pathlib import Path

# Ensure project root is on the path so backend.config imports work
sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent))

from dotenv import load_dotenv
load_dotenv(Path(__file__).resolve().parent.parent.parent / ".env")


def main():
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key or api_key == "your-gemini-api-key-here":
        print(
            "ERROR: GEMINI_API_KEY is not set or is still the placeholder value.\n"
            "Edit .env and set a real API key, then re-run this script."
        )
        sys.exit(1)

    try:
        from google import genai  # type: ignore
    except ImportError:
        print(
            "ERROR: google-genai package is not installed.\n"
            "Run: pip install google-genai"
        )
        sys.exit(1)

    client = genai.Client(api_key=api_key)

    print("\nAvailable Gemini models for your API key:")
    print("=" * 60)
    found = False
    for model in client.models.list():
        name = getattr(model, "name", str(model))
        print(f"  {name}")
        found = True

    if not found:
        print("  (no models returned — check your API key and network)")

    print("\nSet the model name you want to use in .env:")
    print("  GEMINI_MODEL=<paste model name here>")
    print()


if __name__ == "__main__":
    main()
