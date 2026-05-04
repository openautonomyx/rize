from pathlib import Path

import pytest

from rize_manifest.manifest import AgentManifest, ValidationError, load_manifest


def test_manifest_from_dict_success() -> None:
    manifest = AgentManifest.from_dict(
        {
            "name": "expense-approvals-agent",
            "version": "0.1.0",
            "framework": "langgraph",
            "runtime": "python3.12",
            "model_provider": "openai",
            "model": "gpt-4.1",
            "tools": ["workday", "slack"],
            "owners": ["team@example.com"],
        }
    )

    assert manifest.name == "expense-approvals-agent"


def test_manifest_requires_fields() -> None:
    with pytest.raises(ValidationError):
        AgentManifest.from_dict({"name": ""})


def test_load_manifest(tmp_path: Path) -> None:
    file_path = tmp_path / "manifest.json"
    file_path.write_text(
        '{"name":"a","version":"1","framework":"x","runtime":"py","model_provider":"o","model":"m","owners":["a@b.com"]}',
        encoding="utf-8",
    )

    manifest = load_manifest(file_path)
    assert manifest.version == "1"
