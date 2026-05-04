from __future__ import annotations

from dataclasses import dataclass, field
from pathlib import Path
import json


class ValidationError(ValueError):
    """Raised when a manifest is missing required fields or has invalid data."""


@dataclass
class AgentManifest:
    name: str
    version: str
    framework: str
    runtime: str
    model_provider: str
    model: str
    tools: list[str] = field(default_factory=list)
    owners: list[str] = field(default_factory=list)

    def validate(self) -> None:
        required = {
            "name": self.name,
            "version": self.version,
            "framework": self.framework,
            "runtime": self.runtime,
            "model_provider": self.model_provider,
            "model": self.model,
        }
        missing = [key for key, value in required.items() if not str(value).strip()]
        if missing:
            raise ValidationError(f"Missing required field(s): {', '.join(missing)}")

        if not isinstance(self.tools, list) or any(not isinstance(item, str) for item in self.tools):
            raise ValidationError("'tools' must be a list of strings")

        if not isinstance(self.owners, list) or any("@" not in item for item in self.owners):
            raise ValidationError("'owners' must be a list of email-like strings")


    @classmethod
    def from_dict(cls, payload: dict) -> "AgentManifest":
        manifest = cls(
            name=payload.get("name", ""),
            version=payload.get("version", ""),
            framework=payload.get("framework", ""),
            runtime=payload.get("runtime", ""),
            model_provider=payload.get("model_provider", ""),
            model=payload.get("model", ""),
            tools=payload.get("tools", []),
            owners=payload.get("owners", []),
        )
        manifest.validate()
        return manifest


def load_manifest(path: str | Path) -> AgentManifest:
    manifest_path = Path(path)
    payload = json.loads(manifest_path.read_text(encoding="utf-8"))
    return AgentManifest.from_dict(payload)
