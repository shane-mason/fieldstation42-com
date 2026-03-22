Title: Autostart on System Login
Slug: docs/reference/autostart
Summary: Configure FieldStation42 to start automatically on system login using systemd services or a desktop autostart entry.

Once you have your install stable, you might want to set it up to start every time the system starts. There are several ways to auto-start programs on the Raspberry Pi (or any Linux distribution). This guide covers 2 approaches:

- The recommended approach: using Linux built-in systemd to start the player on login. This approach allows you to easily start, stop and restart the system.
- The older way: using the desktop environment's autostart folder. This is a simple approach, but there are no easy ways to stop or restart the system.

---

## FieldStation42 systemd Services

FieldStation42 can run as systemd user services, which means:

- Automatically starts on login
- Runs in background (no terminal windows)
- Automatic restart on failure
- Centralized logging via systemd journal
- Easy management with systemctl commands

**Note to existing users:** if you are currently using the old way and want to move to the new way, just remove the desktop entry you created:

```
sudo rm /etc/xdg/autostart/fieldstation42.desktop
```

and follow the install instructions below.

### Installation

**Important:** Only install systemd services after you have FieldStation42 configured and running stably. This is not part of the initial installation.

When ready, run:

```bash
bash install/install_services.sh
```

The installer will prompt you to select which services to enable:

- **Field Player** (fs42) - Core service, enabled by default
- **Cable Box** (fs42-cable-box) - Optional, for cable box interface
- **Remote Controller** (fs42-remote-controller) - Optional
- **OSD** (fs42-osd) - Optional, on-screen display overlay

Services are enabled but not started immediately. They will start automatically on next login, or you can start them manually.

### Managing Services

#### Field Player (main service)

The field player is the core service that manages content playback. You'll restart this most often:

```bash
## Start
systemctl --user start fs42

## Stop
systemctl --user stop fs42

## Restart (most common)
systemctl --user restart fs42

## Check status
systemctl --user status fs42

## View logs
journalctl --user -u fs42 -f
```

#### All Services

```bash
## Start all
systemctl --user start fs42-*

## Stop all
systemctl --user stop fs42-*

## Restart all
systemctl --user restart fs42-*

## Check status of all
systemctl --user status fs42-*

## View all logs
journalctl --user -u fs42-* -f
```

#### Individual Services

- `fs42` - Field Player (main content playback)
- `fs42-cable-box` - Cable Box interface
- `fs42-remote-controller` - Remote Controller
- `fs42-osd` - On-Screen Display (waits 30s before starting)

### Uninstall

```bash
bash install/uninstall_services.sh
```

---

## The Other Way

### 1. Create an Autostart Entry

Open a terminal and create a desktop entry using your favorite editor (here we use nano):

```bash
sudo nano /etc/xdg/autostart/fieldstation42.desktop
```

Paste the following content:

```ini
[Desktop Entry]
Name=FieldStation42
Exec=/usr/bin/bash /path/to/repo/FieldStation42/fs42/hot_start.sh
```

Replace `/path/to/repo/` with the actual path to your FieldStation42 repository. By default, `hot_start.sh` expects the repo at `/home/username/FieldStation42`. If your repo is elsewhere, edit `hot_start.sh` to match.

To save in nano: press `Ctrl+O`, then `Enter`. To exit: press `Ctrl+X`.

---

### 2. Cable Box Configuration (Optional)

If you're using the cable box setup, your `hot_start.sh` might look like this:

```bash
#!/usr/bin/bash
cd ~/FieldStation42
. env/bin/activate
python3 field_player.py 1>/dev/null 2>/dev/null & disown
python3 fs42/pi/cable_box.py 1>/dev/null 2>/dev/null & disown
```

---

### 3. View Output in XTerm (Optional)

If you want to see output and debug, use this version:

```bash
#!/usr/bin/bash
cd ~/FieldStation42
. env/bin/activate
xterm -bg black -fg yellow -hold -e "python3 fs42/pi/cable_box.py; bash" &
xterm -bg black -fg green -hold -e "python3 field_player.py; bash" &
```

This opens two xterm windows that stay open even if the scripts exit.

---

### 4. Run All Services (OSD & Remote Control)

To autostart everything, including OSD and the remote control webapp:

```bash
xterm -bg black -fg yellow -hold -e "python3 fs42/pi/cable_box.py; bash" &
xterm -bg black -fg green -hold -e "python3 field_player.py; bash" &
xterm -bg blue -fg white -hold -e "uvicorn fs42.remote.server:app --host 0.0.0.0; bash" &
sleep 30
DISPLAY=:0 python3 fs42/osd/main.py 1>/dev/null 2>/dev/null & disown
```

---

> **Tip:** You can further customize your startup scripts to match your setup and preferences. For more advanced options, see the FieldStation42 documentation.
