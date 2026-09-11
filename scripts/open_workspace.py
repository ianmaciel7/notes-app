"""Shortcut script to launch the full workspace links in a single browser window:
1. Capacities (https://app.capacities.io)
2. Local Notes App (http://localhost:3000)
3. Local Service (http://localhost:61000/)
"""

import sys
from pathlib import Path

# Add scripts directory to path if needed
sys.path.insert(0, str(Path(__file__).parent))

from open_browser import open_browser

WORKSPACE_URLS = [
    "https://app.capacities.io",
    "http://localhost:3000",
    "http://localhost:61000/",
]


def main() -> None:
    open_browser(url=WORKSPACE_URLS)


if __name__ == "__main__":
    main()
