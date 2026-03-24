Title: Connecting Remote Controls
Slug: docs/guides/remote-control
Summary: Use a Flirc USB receiver to control FieldStation42 with any IR remote, customize key mappings, or integrate external scripts via the channel socket.

FieldStation42 can be controlled with any IR remote using a Flirc USB receiver, or with a keyboard directly. You can also change channels and read player status from external scripts using a simple socket file interface.

## Quick Start with Flirc USB

**Flirc USB** lets you use any IR remote with your Raspberry Pi. It maps remote buttons to keyboard keys, which FieldStation42's remote controller script then translates into commands.

### 1. Get and Program Flirc

Pick up a [Flirc USB receiver](https://flirc.tv/) and install the Flirc software on your computer. Use the Flirc GUI to program your remote buttons to the following keyboard keys:

| Remote Button | Map to Key |
|---------------|------------|
| Numbers 0-9 | `0` through `9` |
| Home / Guide | `Home` |
| Volume Up | `Right Arrow` |
| Volume Down | `Left Arrow` |
| Channel Up | `Up Arrow` |
| Channel Down | `Down Arrow` |
| Power / Stop | `End` |

Then plug the Flirc receiver into your Raspberry Pi.

### 2. Install Dependencies

```bash
pip install evdev requests
```

### 3. Run the Remote Controller

```bash
python3 fs42/pi/remote_controller.py
```

On Linux Mint, Ubuntu, and some other distributions you need `sudo` to access input devices. When using sudo, make sure to point at the virtual environment's Python directly rather than the system Python:

```bash
sudo env/bin/python3 fs42/pi/remote_controller.py
```

Using `sudo python3` instead will use the system Python and won't have access to the packages installed in your FieldStation42 environment.

## Remote Functions Reference

| Function | Default Key | Description |
|----------|-------------|-------------|
| Numbers 0-9 | `0-9` | Channel selection |
| Show Guide | `Home` | Display program guide |
| Volume Up | `Right Arrow` | Increase volume by 5% |
| Volume Down | `Left Arrow` | Decrease volume by 5% |
| Channel Up | `Up Arrow` | Next channel |
| Channel Down | `Down Arrow` | Previous channel |
| Power/Stop | `End` | Stop the player |
| Exit | `Esc` | Exit remote controller |

### Channel Selection

- Press `1`, wait one second: switch to channel 1
- Press `1`, `2`, wait one second: switch to channel 12
- Press `1`, `2`, `3`: immediately switch to channel 123

## Customizing Key Mappings

You don't need Flirc to use the remote controller. Any keyboard works. Edit the `KEY_MAPPINGS` section at the top of `remote_controller.py` to match whatever keys you want:

```python
KEY_MAPPINGS = {
    'show_guide': 'home',
    'volume_up': 'right',
    'volume_down': 'left',
    'channel_up': 'up',
    'channel_down': 'down',
    'power_stop': 'end',
    'exit': 'esc',
}
```

### Available Key Names

- **Letters**: `a` through `z`
- **Numbers**: `0` through `9`
- **Function keys**: `f1` through `f12`
- **Arrows**: `up`, `down`, `left`, `right`
- **Navigation**: `home`, `end`, `pageup`, `pagedown`, `insert`, `delete`
- **Common**: `space`, `enter`, `tab`, `backspace`, `esc`

## Selecting an Input Device

By default the remote controller auto-detects your Flirc device, or falls back to the first available input device. If it picks the wrong one, or you want to be explicit, start by listing what's available:

```bash
python3 fs42/pi/remote_controller.py --list-devices
```

On systems that require sudo for input device access:

```bash
sudo env/bin/python3 fs42/pi/remote_controller.py --list-devices
```

You'll see output like this:

```
Available input devices:
0: Flirc (/dev/input/event4)
1: Logitech M510 (/dev/input/event3)
2: Power Button (/dev/input/event1)
Using default device: Flirc
```

Then use `-d` to specify which device to use, by index, name pattern, or full path:

```bash
# By index
python3 fs42/pi/remote_controller.py -d 0

# By name pattern (matches first device containing that text)
python3 fs42/pi/remote_controller.py -d flirc
python3 fs42/pi/remote_controller.py -d keyboard

# By full device path
python3 fs42/pi/remote_controller.py -d /dev/input/event4
```

You can also set the device via environment variable instead of passing `-d` every time:

```bash
FS42_INPUT_DEVICE=flirc python3 fs42/pi/remote_controller.py
```

## Server Location

If FieldStation42 is running on a different machine, set the host and port:

```bash
FS42_HOST=192.168.1.100 FS42_PORT=8080 python3 remote_controller.py
```

Or edit the values directly at the top of `remote_controller.py`.

## Button Callbacks

You can run a script or shell command whenever a button is pressed. Create `runtime/remote_callback_map.json`:

```json
{
    "up": "echo Up pressed",
    "power_stop": "path/to/power_pressed.sh"
}
```

Any valid shell command works here, including Python scripts.

## Troubleshooting

**Permission denied:** Run with `sudo env/bin/python3` to access input devices. Using `sudo python3` will use the system Python instead of the virtual environment.

**No devices found:** Check that Flirc is plugged in and verify with `ls /dev/input/event*`. Run `sudo evtest` to see what keys your device actually sends.

**Remote not responding:** Verify FieldStation42 is running, check the host and port settings, and use the Flirc GUI to confirm key mappings are set correctly. Use the "Full Keyboard" controller template in the Flirc GUI for best results.

## Changing Channels from External Scripts

FieldStation42 monitors `runtime/channel.socket` for JSON-formatted channel commands. This lets any external script or program change the channel without going through the remote controller.

**Tune to a specific channel:**

```json
{"command": "direct", "channel": 42}
```

**Tune up one channel:**

```json
{"command": "up", "channel": -1}
```

**Tune down one channel:**

```json
{"command": "down", "channel": -1}
```

### Example: Python Script

```python
import json

command = {"command": "direct", "channel": 42}
with open('runtime/channel.socket', 'w') as fp:
    fp.write(json.dumps(command))
```

## Reading Player Status

The player publishes its current status to `runtime/play_status.socket` as JSON. External scripts can read this to know what is currently playing.

**Player is active:**

```json
{"status": "playing", "network_name": "MyStation", "channel_number": 42, "timestamp": "2025-02-03T08:13:46.431558"}
```

**Player is stopped:**

```json
{"status": "stopped", "network_name": "", "channel_number": -1, "timestamp": "2025-02-03T08:13:46.431558"}
```