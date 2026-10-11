"""
WSGI entrypoint for production deployment (e.g., Render Web Service).
Allows starting via:
    gunicorn wsgi:app
    gunicorn app:app
    gunicorn "app:create_app()"
    gunicorn backend.wsgi:app  (from repository root)
"""
import sys
from pathlib import Path

# Ensure repository root is on sys.path so 'backend.*' absolute imports resolve
_repo_root = str(Path(__file__).resolve().parent.parent)
if _repo_root not in sys.path:
    sys.path.insert(0, _repo_root)

from backend.app import create_app

app = create_app()

if __name__ == "__main__":
    import os
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
