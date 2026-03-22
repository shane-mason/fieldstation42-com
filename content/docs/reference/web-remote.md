Title: Web-Based Remote Control
Slug: docs/reference/web-remote
Summary: Use the built-in web remote to control FieldStation42 from any browser on your network, including channel selection, volume, and system info.

FieldStation42 includes a web-based remote you can use from any desktop or mobile browser on your network. This is included in the FS42 web based GUI. It is only available while `field_player.py` is running - it is not available when running the server from `station_42.py`.

---

## 📱 Using the Remote Interface

1. Make sure your device is on the same network as FieldStation42.
2. Find the IP address of your FieldStation42 host (e.g., `192.168.50.77`).
3. Open your browser and go to `http://192.168.50.77:4242`

This will take you to the main web interface for FS42, just select 'Remote' from the menu to open the remote interface. You can also get there directly by navigating to `http://192.168.50.77:4242/remote`

- Supports channels up to 999
- `Stop` button to shut down FieldStation42
- `Volume+`, `Volume-` and `Mute` buttons to control sound (should work on most Linux systems, including WSL if you install alsamixer)
- `Guide` button auto-navigates to guide channel (if you have one configured)
- `Info` button toggles the 'Now Playing' to show system information like CPU load, memory usage and even CPU temperature if available.
- `Exit` button to return to the main UI

---
