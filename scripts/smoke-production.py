"""Read-only verification of the published app and byte-identical static assets."""
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
import subprocess

root = Path(__file__).resolve().parent.parent
origin = 'https://howdopasskeyswork.com'
def fetch(url):
    return subprocess.check_output(['curl', '-fsS', '--max-time', '20', url])
html = fetch(origin).decode()
assert 'Try a pretend sign-in' in html and 'Your everyday questions.' in html
assert 'What happens at every step' in html
assert 'Watch mode' not in html and '/audio/scene-' not in html
files = ['favicon.svg', 'mystic-dragon.webp', 'apple.svg', 'google-password-manager.webp', '1password.svg']
def verify(path):
    assert fetch(f'{origin}/{path}') == (root / 'public' / path).read_bytes(), path
    return path
with ThreadPoolExecutor(max_workers=4) as pool:
    passed = list(pool.map(verify, files))
print(f'Production HTTPS page and {len(passed)} exact asset matches passed.')
