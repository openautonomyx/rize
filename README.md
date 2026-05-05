# Rize (AGenNext Foundation)

This repository now includes an initial implementation of the **Agent Project Manifest** capability from the PRD MVP.

## Included MVP feature

- Framework-agnostic agent manifest model (`AgentManifest`)
- Manifest field validation for required metadata
- CLI command to validate manifest files: `rize-manifest <path>`
- Unit tests for manifest loading and validation behavior

## Quickstart

```bash
python -m venv .venv
source .venv/bin/activate
pip install -e .[dev]
pytest
```

## Example manifest

```json
{
  "name": "expense-approvals-agent",
  "version": "0.1.0",
  "framework": "langgraph",
  "runtime": "python3.12",
  "model_provider": "openai",
  "model": "gpt-4.1",
  "tools": ["workday", "slack"],
  "owners": ["team@example.com"]
}
```

Validate it:

```bash
rize-manifest ./manifest.json
```

## Docker

Build the image:

```bash
docker build -t rize-manifest .
```

Run manifest validation by mounting your manifest into the container:

```bash
docker run --rm -v "$PWD":/work -w /work rize-manifest ./manifest.json
```

Show CLI help:

```bash
docker run --rm rize-manifest
```
