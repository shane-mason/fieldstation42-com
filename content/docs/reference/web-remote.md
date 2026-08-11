Title: Web-Based Remote Control
Slug: docs/reference/web-remote
Summary: Use the built-in web remote to control FieldStation42 from any browser on your network, including channel selection, volume, subtitle and audio track switching, and system info.

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
- `Subs` and `Audio` buttons cycle through the subtitle and audio tracks of whatever is playing right now
- `Exit` button to return to the main UI

---

## 🔊 Subtitles and Audio Tracks

The `Subs` and `Audio` buttons cycle through the tracks embedded in the video file that is currently on screen. `Subs` steps through each subtitle track and then back to off, so the same button both picks a language and turns subtitles off again. `Audio` steps through each audio track, which is useful for media that ships with alternate language dubs or commentary tracks.

A few things to keep in mind:

- These buttons only affect the item playing at that moment. Each program, commercial and bump is loaded fresh, so your selection resets when the player moves on to the next item.
- Most media has a single audio track and no subtitles at all. On those files, pressing the buttons will not appear to do anything - there is nothing to cycle to.
- The remote's display briefly shows `SUBTITLES` or `AUDIO` to confirm the button press was sent, then returns to the channel number. It does not report which track ended up selected, so cycling is a matter of pressing until you hear or see what you want.

The same functions are available from an IR remote or keyboard - see [Connecting Remote Controls](/docs/guides/remote-control/).

---