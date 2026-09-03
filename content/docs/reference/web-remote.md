Title: Web-Based Remote Control
Slug: docs/reference/web-remote
Summary: Use the built-in web remote to control FieldStation42 from any browser on your network, including channel selection, volume, subtitle and audio track switching, navigation for Pay-Per-View channels, parental controls PIN entry, and system info.

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
- `NAV` button swaps the number pad for a navigation pad, used to drive Pay-Per-View and other web channels (see below)
- Number buttons send channel changes, and enter the PIN when a station is locked with parental controls (see below)
- `CLR` button clears a partly-typed channel number, or a partly-typed PIN
- `Exit` button to return to the main UI

---

## 🔊 Subtitles and Audio Tracks

The `Subs` and `Audio` buttons cycle through the tracks embedded in the video file that is currently on screen. `Subs` steps through each subtitle track and then back to off, so the same button both picks a language and turns subtitles off again. `Audio` steps through each audio track, which is useful for media that ships with alternate language dubs or commentary tracks.

A few things to keep in mind:

- Your choice sticks for the rest of the program. The player reapplies it each time the program resumes after a commercial break, and clears it when the next program starts.
- Only choices made while the program itself is on screen are remembered. If you press the buttons during a commercial or bump, that selection applies to the clip you are watching and is not carried forward.
- Nothing is written to disk, so selections are lost when the player restarts.
- Most media has a single audio track and no subtitles at all. On those files, pressing the buttons will not appear to do anything - there is nothing to cycle to.
- The remote's display briefly shows `SUBTITLES` or `AUDIO` to confirm the button press was sent, then returns to the channel number. It does not report which track ended up selected, so cycling is a matter of pressing until you hear or see what you want.

The same functions are available from an IR remote or keyboard - see [Connecting Remote Controls](/docs/guides/remote-control/).

---

## 🕹️ Navigation Pad

[Pay-Per-View](/docs/reference/ppv/) and other `web` type channels are driven by keystrokes rather than by the usual player commands, so the remote has a second pad for them.

The `NAV` button, on the same row as `0`, swaps the number pad for a navigation pad: arrows around a central `OK` button, with `123` in the same corner to swap back. The rest of the remote stays where it is.

- `▲` - next title (Page Up)
- `▼` - previous title (Page Down)
- `OK` - play the selected title (Enter)

A few things to keep in mind:

- The left and right arrows are there so the pad reads like a physical remote, but they are disabled. PPV does not bind any horizontal keys.
- Switching pads is manual. The remote does not swap to the navigation pad on its own when you tune to a web channel, and it stays on whichever pad you left it on.
- The keys only do something while the web channel itself is on screen. Once you press `OK` and a movie starts playing, the navigation keys are ignored until the movie ends and the channel returns to its slideshow.
- The display briefly shows `NEXT`, `PREV` or `SELECT` to confirm the button press was sent.
- The number pad is hidden while the navigation pad is up, so switch back with `123` before typing a channel number.

---

## 🔒 Parental Controls and the Number Buttons

If a station is configured with [parental controls](/docs/reference/main-config/#parental-controls), it will not play until its PIN is entered. The web remote can do this - the number buttons enter PIN digits whenever a locked station is waiting for one, and send channel changes the rest of the time. You do not switch anything to make that happen.

While the prompt is up, the remote's display shows `ENTER PIN`, then one dot per digit as the player confirms it. `CLR` clears what you have typed and starts the PIN over. Once the PIN is accepted the station plays and the number buttons go back to changing channels.

If you would rather leave the station alone than unlock it, the channel up/down buttons and `Guide` still work while the prompt is on screen.

PIN entry also works from an IR remote or keyboard (see [Connecting Remote Controls](/docs/guides/remote-control/)) and from the `/player/parental/digit/{digit}` endpoint of the [server API](/docs/reference/web-console/).

---