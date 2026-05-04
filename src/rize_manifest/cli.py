from __future__ import annotations

import argparse
import sys

from .manifest import ValidationError, load_manifest


def main() -> int:
    parser = argparse.ArgumentParser(description="Validate an AGenNext/Rize agent manifest.")
    parser.add_argument("path", help="Path to manifest JSON file")
    args = parser.parse_args()

    try:
        manifest = load_manifest(args.path)
    except FileNotFoundError:
        print(f"Manifest not found: {args.path}", file=sys.stderr)
        return 1
    except (ValidationError, ValueError) as exc:
        print(f"Manifest validation failed: {exc}", file=sys.stderr)
        return 1

    print(f"Manifest OK: {manifest.name} ({manifest.version})")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
