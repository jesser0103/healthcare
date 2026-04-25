from __future__ import annotations

from pathlib import Path
from urllib.error import HTTPError
from urllib.request import Request, urlopen


def render_mermaid_png_kroki(mermaid_source: str) -> bytes:
    # Kroki renders Mermaid text directly.
    # Docs: https://kroki.io/
    url = "https://kroki.io/mermaid/png"
    data = mermaid_source.encode("utf-8")
    req = Request(
        url,
        data=data,
        headers={
            "User-Agent": "healthcare-demo-doc-generator",
            "Content-Type": "text/plain; charset=utf-8",
        },
        method="POST",
    )
    try:
        with urlopen(req, timeout=30) as resp:
            if resp.status != 200:
                raise RuntimeError(f"HTTP {resp.status} rendering mermaid via kroki")
            return resp.read()
    except HTTPError as exc:
        body = b""
        try:
            body = exc.read() or b""
        except Exception:
            body = b""
        msg = body.decode("utf-8", errors="replace").strip()
        raise RuntimeError(f"Kroki HTTP {exc.code}: {msg[:1000]}") from exc


def render_all(diagrams_dir: Path, out_dir: Path) -> list[Path]:
    out_dir.mkdir(parents=True, exist_ok=True)
    outputs: list[Path] = []

    for mmd in sorted(diagrams_dir.glob("*.mmd")):
        source = mmd.read_text(encoding="utf-8").strip() + "\n"
        try:
            png_bytes = render_mermaid_png_kroki(source)
        except Exception as exc:
            raise RuntimeError(f"Failed rendering {mmd.name}: {exc}") from exc

        out_path = out_dir / (mmd.stem + ".png")
        out_path.write_bytes(png_bytes)
        outputs.append(out_path)

    return outputs


if __name__ == "__main__":
    repo_root = Path(__file__).resolve().parents[1]
    diagrams_dir = repo_root / "tools" / "diagrams"
    out_dir = diagrams_dir / "out"

    outputs = render_all(diagrams_dir, out_dir)
    for p in outputs:
        print(f"Wrote {p}")
