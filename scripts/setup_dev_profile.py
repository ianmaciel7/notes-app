import getpass
import os
import platform
import shutil
import subprocess
import sys
from pathlib import Path


def get_source_data_dir() -> str | None:
    home = Path.home()
    system = platform.system().lower()

    if system == 'windows':
        local_app_data = os.environ.get('LOCALAPPDATA', str(home / 'AppData' / 'Local'))
        candidates = [
            os.path.join(local_app_data, r'Google\Chrome\User Data'),
            os.path.join(local_app_data, r'BraveSoftware\Brave-Browser\User Data'),
            os.path.join(local_app_data, r'Microsoft\Edge\User Data'),
        ]
    elif system == 'darwin':
        candidates = [
            str(home / 'Library' / 'Application Support' / 'Google' / 'Chrome'),
            str(home / 'Library' / 'Application Support' / 'BraveSoftware' / 'Brave-Browser'),
        ]
    else:  # linux / wsl
        candidates = [
            str(home / ".config" / "google-chrome"),
            str(home / ".config" / "BraveSoftware" / "Brave-Browser"),
            str(home / ".config" / "chromium"),
        ]

    for cand in candidates:
        if os.path.exists(os.path.join(cand, "Default")):
            return cand
    return None


def get_browser_executable() -> str | None:
    system = platform.system().lower()
    if system == "windows":
        local_app_data = os.environ.get("LOCALAPPDATA", "")
        program_files = os.environ.get("ProgramFiles", r"C:\Program Files")
        program_files_x86 = os.environ.get("ProgramFiles(x86)", r"C:\Program Files (x86)")
        candidates = [
            os.path.join(program_files, r"Google\Chrome\Application\chrome.exe"),
            os.path.join(program_files_x86, r"Google\Chrome\Application\chrome.exe"),
            os.path.join(local_app_data, r"Google\Chrome\Application\chrome.exe"),
            os.path.join(program_files, r"BraveSoftware\Brave-Browser\Application\brave.exe"),
        ]
        for cand in candidates:
            if os.path.isfile(cand):
                return cand
    elif system == "darwin":
        mac_chrome = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
        if os.path.isfile(mac_chrome):
            return mac_chrome
    else:
        for exe in ["google-chrome", "google-chrome-stable", "chromium", "chromium-browser", "brave-browser"]:
            found = shutil.which(exe)
            if found:
                return found
    return None


def setup_and_launch():
    home = Path.home()
    source_dir = get_source_data_dir()

    if not source_dir:
        print("No browser user data directory found on this system.")
        return False

    dest_dir = str(home / ".chrome-dev-profile")
    dest_default = os.path.join(dest_dir, 'Default')
    os.makedirs(dest_default, exist_ok=True)

    src_default = os.path.join(source_dir, 'Default')
    print(f'Cloning profile session data from "{src_default}" to "{dest_default}"...')

    items_to_copy = [
        'Cookies',
        'Network',
        'Local Storage',
        'IndexedDB',
        'Session Storage',
        'Preferences',
        'Secure Preferences',
        'Web Data',
        'Login Data',
    ]

    copied_count = 0
    for item in items_to_copy:
        src_item = os.path.join(src_default, item)
        dest_item = os.path.join(dest_default, item)

        if not os.path.exists(src_item):
            continue

        try:
            if os.path.isdir(src_item):
                if os.path.exists(dest_item):
                    shutil.rmtree(dest_item, ignore_errors=True)
                shutil.copytree(
                    src_item,
                    dest_item,
                    dirs_exist_ok=True,
                    ignore=shutil.ignore_patterns('*.lock', 'LOCK', 'LOG*'),
                )
            else:
                shutil.copy2(src_item, dest_item)
            copied_count += 1
            print(f'  [+] Copied {item}')
        except Exception as err:
            print(f'  [-] Skipped {item}: {err}')

    print(f'Successfully copied {copied_count} profile items to "{dest_dir}".')

    browser_exe = get_browser_executable()
    if not browser_exe:
        print('No compatible browser executable found.')
        return True

    print(f'Launching browser with remote debugging on port 9222 using profile "{dest_dir}"...')
    cmd = [
        browser_exe,
        '--remote-debugging-port=9222',
        f'--user-data-dir={dest_dir}',
        '--profile-directory=Default',
        'http://localhost:3000',
    ]
    subprocess.Popen(cmd)
    print('Browser launched with remote debugging port 9222.')
    return True


if __name__ == '__main__':
    setup_and_launch()
