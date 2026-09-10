"""Cross-platform browser launcher script supporting Windows, Linux, macOS, and WSL.
Handles Windows session isolation (dispatching across session boundaries to Session 1 via schtasks /it)
and standard POSIX/macOS display launchers (xdg-open, wslview, open).
"""

import argparse
import os
import platform
import random
import shutil
import subprocess
import sys
import time
import webbrowser


def find_windows_browser(preferred: str = "auto") -> str | None:
    program_files = os.environ.get("ProgramFiles", r"C:\Program Files")
    program_files_x86 = os.environ.get("ProgramFiles(x86)", r"C:\Program Files (x86)")
    local_app_data = os.environ.get("LOCALAPPDATA", "")

    candidates = {
        "brave": [
            os.path.join(program_files, r"BraveSoftware\Brave-Browser\Application\brave.exe"),
            os.path.join(program_files_x86, r"BraveSoftware\Brave-Browser\Application\brave.exe"),
            os.path.join(local_app_data, r"BraveSoftware\Brave-Browser\Application\brave.exe"),
        ],
        "chrome": [
            os.path.join(program_files, r"Google\Chrome\Application\chrome.exe"),
            os.path.join(program_files_x86, r"Google\Chrome\Application\chrome.exe"),
            os.path.join(local_app_data, r"Google\Chrome\Application\chrome.exe"),
        ],
        "edge": [
            os.path.join(program_files_x86, r"Microsoft\Edge\Application\msedge.exe"),
            os.path.join(program_files, r"Microsoft\Edge\Application\msedge.exe"),
        ],
        "firefox": [
            os.path.join(program_files, r"Mozilla Firefox\firefox.exe"),
            os.path.join(program_files_x86, r"Mozilla Firefox\firefox.exe"),
        ],
    }

    if preferred != "auto" and preferred in candidates:
        for path in candidates[preferred]:
            if os.path.isfile(path):
                return path

    # Auto priority: Brave -> Chrome -> Edge -> Firefox
    for b in ["brave", "chrome", "edge", "firefox"]:
        for path in candidates[b]:
            if os.path.isfile(path):
                return path

    return None


def launch_windows(url: str, browser_choice: str = "auto", profile_dir: str | None = None) -> bool:
    target_exe = find_windows_browser(browser_choice)
    task_name = f"OpenBrowserApp_{random.randint(10000, 99999)}"

    if target_exe:
        profile_part = f'--profile-directory=\\"{profile_dir}\\" ' if profile_dir else ""
        tr_arg = f'\\"{target_exe}\\" {profile_part}{url}'
    else:
        tr_arg = f'cmd.exe /c start "" "{url}"'

    # Try scheduled task dispatch (crosses session isolation to user's interactive desktop)
    try:
        create_cmd = ["schtasks", "/create", "/tn", task_name, "/tr", tr_arg, "/sc", "ONCE", "/st", "23:59", "/it", "/f"]
        res_create = subprocess.run(create_cmd, capture_output=True, text=True, check=False)
        if res_create.returncode == 0:
            subprocess.run(["schtasks", "/run", "/tn", task_name], capture_output=True, check=False)
            time.sleep(0.5)
            subprocess.run(["schtasks", "/delete", "/tn", task_name, "/f"], capture_output=True, check=False)
            print(f"Dispatched browser launch to active Windows desktop: {target_exe or 'default'} (profile: {profile_dir or 'default'})")
            return True
    except Exception as e:
        print(f"schtasks dispatch failed ({e}), falling back to direct execution...", file=sys.stderr)

    # Fallback to direct process start
    if target_exe:
        cmd = [target_exe]
        if profile_dir:
            cmd.append(f"--profile-directory={profile_dir}")
        cmd.append(url)
        try:
            subprocess.Popen(cmd, shell=False)
            print(f"Launched browser directly: {target_exe} (profile: {profile_dir or 'default'})")
            return True
        except Exception as e:
            print(f"Direct launch failed ({e})", file=sys.stderr)

    os.startfile(url)
    print(f"Opened URL via os.startfile: {url}")
    return True


def launch_linux(url: str, browser_choice: str = "auto", profile_dir: str | None = None) -> bool:
    # Check for WSL environment
    is_wsl = "microsoft" in platform.uname().release.lower() or "WSL" in os.environ.get("WSL_DISTRO_NAME", "")
    if is_wsl and shutil.which("wslview"):
        subprocess.Popen(["wslview", url])
        print(f"Opened URL via wslview: {url}")
        return True

    # Check for preferred Linux browsers
    executables = {
        "brave": ["brave-browser", "brave"],
        "chrome": ["google-chrome", "google-chrome-stable", "chromium", "chromium-browser"],
        "firefox": ["firefox"],
    }

    if browser_choice != "auto" and browser_choice in executables:
        for exe in executables[browser_choice]:
            if shutil.which(exe):
                cmd = [exe]
                if profile_dir:
                    cmd.append(f"--profile-directory={profile_dir}")
                cmd.append(url)
                subprocess.Popen(cmd)
                print(f"Launched browser: {exe}")
                return True

    if shutil.which("xdg-open"):
        subprocess.Popen(["xdg-open", url])
        print(f"Opened URL via xdg-open: {url}")
        return True

    return webbrowser.open(url)


def launch_macos(url: str, browser_choice: str = "auto", profile_dir: str | None = None) -> bool:
    app_map = {
        "brave": "Brave Browser",
        "chrome": "Google Chrome",
        "safari": "Safari",
        "firefox": "Firefox",
    }
    if browser_choice in app_map:
        app_name = app_map[browser_choice]
        cmd = ["open", "-a", app_name]
        if profile_dir:
            cmd.extend(["--args", f"--profile-directory={profile_dir}"])
        cmd.append(url)
        subprocess.Popen(cmd)
        print(f"Opened URL in {app_name}: {url}")
        return True

    subprocess.Popen(["open", url])
    print(f"Opened URL via macOS open: {url}")
    return True


def open_browser(url: str = "http://localhost:3000", browser: str = "auto", profile_dir: str | None = None) -> bool:
    system = platform.system().lower()
    if system == "windows":
        return launch_windows(url, browser, profile_dir)
    elif system == "darwin":
        return launch_macos(url, browser, profile_dir)
    elif system == "linux":
        return launch_linux(url, browser, profile_dir)
    else:
        return webbrowser.open(url)


def main() -> None:
    parser = argparse.ArgumentParser(description="Cross-platform browser launcher")
    parser.add_argument("--url", default="http://localhost:3000", help="URL to open")
    parser.add_argument(
        "--browser",
        choices=["auto", "chrome", "brave", "edge", "firefox", "default"],
        default="auto",
        help="Target browser executable",
    )
    parser.add_argument(
        "--profile-dir",
        default=None,
        help="Target browser profile directory (e.g. 'Default', 'Profile 1')",
    )
    args = parser.parse_args()
    open_browser(url=args.url, browser=args.browser, profile_dir=args.profile_dir)


if __name__ == "__main__":
    main()
