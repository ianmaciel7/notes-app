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


import getpass

def launch_windows(url: str | list[str], browser_choice: str = "auto", profile_dir: str | None = None) -> bool:
    urls = [url] if isinstance(url, str) else url
    target_exe = find_windows_browser(browser_choice)
    user_name = os.environ.get("USERNAME") or getpass.getuser()
    task_name = f"OpenBrowserApp_{random.randint(10000, 99999)}"
    temp_dir = os.environ.get("TEMP", r"C:\Windows\Temp")
    bat_path = os.path.join(temp_dir, f"{task_name}.bat")

    profile_part = f'--profile-directory="{profile_dir}" ' if profile_dir else ""
    urls_quoted = " ".join([f'"{u}"' for u in urls])

    if target_exe:
        bat_content = f'@echo off\nstart "" "{target_exe}" --new-window {profile_part}{urls_quoted}\n'
    else:
        bat_content = f'@echo off\nstart "" {urls_quoted}\n'

    try:
        with open(bat_path, "w", encoding="utf-8") as f:
            f.write(bat_content)

        tr_arg = f'cmd.exe /c "{bat_path}"'
        create_cmd = ["schtasks", "/create", "/tn", task_name, "/tr", tr_arg, "/sc", "ONCE", "/st", "23:59", "/ru", user_name, "/it", "/f"]
        res_create = subprocess.run(create_cmd, capture_output=True, text=True, check=False)
        if res_create.returncode == 0:
            subprocess.run(["schtasks", "/run", "/tn", task_name], capture_output=True, check=False)
            time.sleep(0.5)
            subprocess.run(["schtasks", "/delete", "/tn", task_name, "/f"], capture_output=True, check=False)
            try:
                os.remove(bat_path)
            except Exception:
                pass
            print(f"Dispatched new browser window with {len(urls)} tabs to user desktop ({user_name})")
            return True
    except Exception as e:
        print(f"schtasks dispatch failed ({e}), falling back to direct execution...", file=sys.stderr)
        if os.path.exists(bat_path):
            try:
                os.remove(bat_path)
            except Exception:
                pass

    if target_exe:
        cmd = [target_exe, "--new-window"]
        if profile_dir:
            cmd.append(f"--profile-directory={profile_dir}")
        cmd.extend(urls)
        try:
            subprocess.Popen(cmd, shell=False)
            print(f"Launched browser directly: {target_exe} with {len(urls)} tabs")
            return True
        except Exception as e:
            print(f"Direct launch failed ({e}), falling back to os.startfile...", file=sys.stderr)

    for u in urls:
        try:
            os.startfile(u)
        except Exception:
            webbrowser.open(u)
    return True


def launch_linux(url: str | list[str], browser_choice: str = "auto", profile_dir: str | None = None) -> bool:
    urls = [url] if isinstance(url, str) else url
    is_wsl = "microsoft" in platform.uname().release.lower() or "WSL" in os.environ.get("WSL_DISTRO_NAME", "")
    if is_wsl and shutil.which("wslview"):
        for u in urls:
            subprocess.Popen(["wslview", u])
        print(f"Opened URLs via wslview: {urls}")
        return True

    executables = {
        "brave": ["brave-browser", "brave"],
        "chrome": ["google-chrome", "google-chrome-stable", "chromium", "chromium-browser"],
        "firefox": ["firefox"],
    }

    if browser_choice != "auto" and browser_choice in executables:
        for exe in executables[browser_choice]:
            if shutil.which(exe):
                cmd = [exe, "--new-window"]
                if profile_dir:
                    cmd.append(f"--profile-directory={profile_dir}")
                cmd.extend(urls)
                subprocess.Popen(cmd)
                print(f"Launched browser: {exe} with {len(urls)} tabs")
                return True

    for u in urls:
        if shutil.which("xdg-open"):
            subprocess.Popen(["xdg-open", u])
        else:
            webbrowser.open(u)
    return True


def launch_macos(url: str | list[str], browser_choice: str = "auto", profile_dir: str | None = None) -> bool:
    urls = [url] if isinstance(url, str) else url
    app_map = {
        "brave": "Brave Browser",
        "chrome": "Google Chrome",
        "safari": "Safari",
        "firefox": "Firefox",
    }
    if browser_choice in app_map:
        app_name = app_map[browser_choice]
        cmd = ["open", "-n", "-a", app_name]
        if profile_dir:
            cmd.extend(["--args", f"--profile-directory={profile_dir}"])
        cmd.extend(urls)
        subprocess.Popen(cmd)
        print(f"Opened URLs in {app_name}: {urls}")
        return True

    for u in urls:
        subprocess.Popen(["open", u])
    return True


def open_browser(url: str | list[str] = "http://localhost:3000", browser: str = "auto", profile_dir: str | None = None) -> bool:
    system = platform.system().lower()
    if system == "windows":
        return launch_windows(url, browser, profile_dir)
    elif system == "darwin":
        return launch_macos(url, browser, profile_dir)
    elif system == "linux":
        return launch_linux(url, browser, profile_dir)
    else:
        urls = [url] if isinstance(url, str) else url
        for u in urls:
            webbrowser.open(u)
        return True


def main() -> None:
    parser = argparse.ArgumentParser(description="Cross-platform browser launcher")
    parser.add_argument("--url", action="append", help="URL to open (can be specified multiple times)")
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
    urls = args.url if args.url else ["http://localhost:3000"]
    open_browser(url=urls, browser=args.browser, profile_dir=args.profile_dir)


if __name__ == "__main__":
    main()
