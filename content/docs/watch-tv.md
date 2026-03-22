Title: Watch TV
Slug: docs/watch-tv
Summary: Start the FieldStation42 player and change channels using the web API, socket commands, or the built-in remote control.

## 1. Start the Player

From the top level of your FieldStation42 folder, activate the Python virtual environment:

```bash
source env/bin/activate
```

Then start the player:

```bash
python3 field_player.py
```

The player will automatically begin playing the scheduled content for the first configured channel.

> **Note:** Make sure you have already generated catalogs and schedules using `station_42.py` before starting the player.

## 2. Changing Channels

FieldStation42 offers several ways to change channels:

### A. Web Server API

By default, the player starts a web server on port 4242 (unless you use the `--noserver` option). You can change channels by visiting or calling these URLs:

- `http://localhost:4242/player/channels/up` - Tune channel up
- `http://localhost:4242/player/channels/down` - Tune channel down
- `http://localhost:4242/player/channels/42` - Direct tune to channel 42

### B. Plain Text File Commands

The player monitors the file `runtime/channel.socket` for channel change commands. You can:

- Change to channel 3:
  ```bash
  echo '{"command": "direct", "channel": 3}' > runtime/channel.socket
  ```
- Or, open `runtime/channel.socket` in a text editor and enter:
  ```json
  {"command": "direct", "channel": 3}
  ```

- Tune up or down:
  ```json
  {"command": "up", "channel": -1}
  ```
  ```json
  {"command": "down", "channel": -1}
  ```

## 3. Remote Control & Scripting

FieldStation42 includes a built-in web-based remote control. See the [Web-Based Remote guide](/docs/reference/web-remote/) for setup and usage.

You can also integrate with external scripts and programs:

- [Web Console and API](https://github.com/shane-mason/FieldStation42/wiki/Web-Console-and-API)
- [Connecting A Remote or App](https://github.com/shane-mason/FieldStation42/wiki/Connecting-Remote-Controls)
