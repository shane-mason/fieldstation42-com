Title: Autostart on System Login
Slug: docs/guides/autostart
Summary: Configure FieldStation42 to start automatically on system login using systemd services or a desktop autostart entry.

Once you have FieldStation42 running stably, you'll probably want it to start automatically whenever the system boots. This page covers two approaches: the recommended systemd method, and the simpler desktop autostart method for setups that don't need full service management.

## Recommended: systemd Services

Running FieldStation42 as systemd user services gives you:

- Automatic startup on login
- Background execution with no terminal windows
- Automatic restart on failure
- Centralized logging via the systemd journal
- Easy start, stop, and restart via `systemctl`

**Only set this up after FieldStation42 is configured and running stably.** This is not part of the initial install.

### Install the Services

```bash
bash install/install_services.sh
```

The installer will prompt you to choose which services to enable:

- **Field Player** (`fs42`) - Core playback service, enabled by default
- **Cable Box** (`fs42-cable-box`) - Optional cable box interface
- **Remote Controller** (`fs42-remote-controller`) - Optional
- **OSD** (`fs42-osd`) - Optional on-screen display overlay

Services are enabled but not started immediately. They will start automatically on next login, or you can start them manually right away.

### Managing Services

**Field Player** is the one you'll interact with most:

```bash
systemctl --user start fs42
systemctl --user stop fs42
systemctl --user restart fs42
systemctl --user status fs42
journalctl --user -u fs42 -f
```

To control all FieldStation42 services at once:

```bash
systemctl --user start fs42-*
systemctl --user stop fs42-*
systemctl --user restart fs42-*
systemctl --user status fs42-*
journalctl --user -u fs42-* -f
```

Individual service names:

- `fs42` - Field Player (main content playback)
- `fs42-cable-box` - Cable Box interface
- `fs42-remote-controller` - Remote Controller
- `fs42-osd` - On-Screen Display (waits 30 seconds before starting)

### Uninstall

```bash
bash install/uninstall_services.sh
```

### Migrating from the Desktop Autostart Method

If you're currently using the desktop entry approach and want to switch to systemd, remove the old entry first:

```bash
sudo rm /etc/xdg/autostart/fieldstation42.desktop
```

Then follow the install steps above.

## Alternative: Desktop Autostart

For simpler setups, you can create a desktop entry that launches FieldStation42 on login. This approach requires no service management but gives you no easy way to stop or restart without killing processes manually.

### Basic Setup

Create the desktop entry file:

```bash
sudo nano /etc/xdg/autostart/fieldstation42.desktop
```

Paste the following:

```ini
[Desktop Entry]
Name=FieldStation42
Exec=/usr/bin/bash /path/to/repo/FieldStation42/fs42/hot_start.sh
```

Replace `/path/to/repo/` with the actual path to your FieldStation42 directory. By default this would be `/home/pi/` on a Raspberry Pi, making the full path `/home/pi/FieldStation42/fs42/hot_start.sh`.

To save in nano: press `Ctrl+O`, then `Enter`. To exit: press `Ctrl+X`.

### With Cable Box

If you're using the cable box, your `hot_start.sh` might look like this:

```bash
#!/usr/bin/bash
cd ~/FieldStation42
. env/bin/activate
python3 field_player.py 1>/dev/null 2>/dev/null & disown
python3 fs42/pi/cable_box.py 1>/dev/null 2>/dev/null & disown
```

### With Visible Output for Debugging

If you want to see output while troubleshooting, use xterm windows instead:

```bash
#!/usr/bin/bash
cd ~/FieldStation42
. env/bin/activate
xterm -bg black -fg yellow -hold -e "python3 fs42/pi/cable_box.py; bash" &
xterm -bg black -fg green -hold -e "python3 field_player.py; bash" &
```

### With All Services

To autostart everything including OSD and the remote control webapp:

```bash
xterm -bg black -fg yellow -hold -e "python3 fs42/pi/cable_box.py; bash" &
xterm -bg black -fg green -hold -e "python3 field_player.py; bash" &
xterm -bg blue -fg white -hold -e "uvicorn fs42.remote.server:app --host 0.0.0.0; bash" &
sleep 30
DISPLAY=:0 python3 fs42/osd/main.py 1>/dev/null 2>/dev/null & disown
```