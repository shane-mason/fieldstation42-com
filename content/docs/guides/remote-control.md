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
| Mute | `m` |
| Channel Up | `Up Arrow` |
| Channel Down | `Down Arrow` |
| Last Channel | `Backspace` |
| Subtitles On/Off | `v` |
| Subtitle Track | `j` |
| Audio Track | `a` |
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
| Volume Up | `Right Arrow` | Increase volume by 2% |
| Volume Down | `Left Arrow` | Decrease volume by 2% |
| Mute | `m` | Mute or unmute volume |
| Channel Up | `Up Arrow` | Next channel |
| Channel Down | `Down Arrow` | Previous channel |
| Last Channel | `Backspace` | Jump back to the previously watched channel |
| Toggle Subtitles | `v` | Show or hide subtitles |
| Cycle Subtitles | `j` | Step through the available subtitle tracks |
| Cycle Audio | `a` | Step through the available audio tracks |
| Power/Stop | `End` | Toggle the FieldStation42 services on and off |
| Exit | `Esc` | Exit remote controller |

### Channel Selection

- Press `1`, wait one second: switch to channel 1
- Press `1`, `2`, wait one second: switch to channel 12
- Press `1`, `2`, `3`: immediately switch to channel 123

If the station you are on has [parental controls](/docs/reference/main-config/#parental-controls) and is waiting for its PIN, the number keys enter PIN digits instead of selecting a channel. Channel up/down, the guide button, and the last-channel button still work, so you can leave the station without entering the PIN.

### Subtitles and Audio Tracks

The subtitle and audio keys act on whatever is playing right now. `j` steps through each subtitle track in the current file and then back to off, while `v` hides and restores subtitles without changing which track is selected. `a` steps through the audio tracks, which is useful for media carrying alternate language dubs or commentary.

Your track choice sticks for the rest of the program. The player reapplies it each time the program resumes after a commercial break, and clears it when the next program starts. Only choices made while the program itself is on screen are remembered - pressing these keys during a commercial or bump affects just that clip and is not carried forward. Nothing is written to disk, so selections are lost when the player restarts.

Most media has a single audio track and no subtitles at all - on those files, pressing these keys will not appear to do anything because there is nothing to cycle to.

The same subtitle and audio cycling is available on the [web remote](/docs/reference/web-remote/).

### The Power Button

By default the power key does not simply stop the player. `USE_SYSTEMCTL` is enabled at the top of `remote_controller.py`, so pressing it checks whether `fs42.service` is running and then starts or stops every service listed in `SYSTEMCTL_TO_TOGGLE` - the player, the cable box and the OSD. That gives a real power button that brings the whole system up and down.

If you would rather have the key only stop the player, set `use_systemctl` to `false` in the [settings file](#the-settings-file) below and it will call the player's stop command instead. The list of services it toggles can be changed there too.

## The Settings File

Create `runtime/remote_controller.json` to change how the remote controller behaves without editing the script. The file is optional - when it is missing, the built-in defaults are used.

```json
{
    "use_systemctl": true,
    "systemctl_to_toggle": [
        "fs42.service",
        "fs42-cable-box.service",
        "fs42-osd.service"
    ],
    "key_mappings": {
        "volume_up": "pageup",
        "volume_down": "pagedown"
    }
}
```

| Setting | Type | Description |
|---------|------|-------------|
| `use_systemctl` | boolean | Whether the power key toggles services instead of only stopping the player |
| `systemctl_to_toggle` | list | Service names the power key starts and stops |
| `key_mappings` | object | Function names mapped to key names - see [Customizing Key Mappings](#customizing-key-mappings) below |

Every setting is optional and anything you leave out keeps its default, so a file containing nothing but `use_systemctl` is perfectly valid. Note that JSON booleans are lowercase `true` and `false`, not Python's `True` and `False`.

The file is read once when the remote controller starts, so restart it after making changes. If it cannot be read - a stray comma, a missing brace - the remote controller reports the error and carries on with the defaults rather than refusing to start.

## Customizing Key Mappings

You don't need Flirc to use the remote controller. Any keyboard works. Add a `key_mappings` block to `runtime/remote_controller.json` listing only the functions you want to change:

```json
{
    "key_mappings": {
        "volume_up": "pageup",
        "volume_down": "pagedown"
    }
}
```

Everything you leave out keeps its default key. The example above moves volume onto the page keys while the guide stays on `Home`, mute stays on `m`, and the rest are untouched.

These are the function names and the defaults you are overriding:

```json
{
    "key_mappings": {
        "show_guide": "home",
        "volume_up": "right",
        "volume_down": "left",
        "channel_up": "up",
        "channel_down": "down",
        "last_channel": "backspace",
        "mute": "m",
        "toggle_subtitles": "v",
        "cycle_subtitles": "j",
        "cycle_audio": "a",
        "power_stop": "end",
        "exit": "esc"
    }
}
```

The number keys are always handled as channel entry and are not part of `key_mappings`.

Editing `DEFAULT_KEY_MAPPINGS` at the top of `remote_controller.py` still works, but the settings file is the better place - it survives updates to the code.

### Taking a Key From Another Function

If you assign a key that another function holds by default, that function gives the key up rather than competing for it. Mapping `channel_up` to `right` means the right arrow changes channels, and volume up is left with no key at all:

```json
{
    "key_mappings": {
        "channel_up": "right"
    }
}
```

When you are rearranging keys this way, map the displaced function somewhere too:

```json
{
    "key_mappings": {
        "channel_up": "right",
        "volume_up": "pageup"
    }
}
```

### Available Key Names

- **Letters**: `a` through `z`
- **Numbers**: `0` through `9`
- **Function keys**: `f1` through `f12`
- **Arrows**: `up`, `down`, `left`, `right`
- **Navigation**: `home`, `end`, `pageup`, `pagedown`, `insert`, `delete`
- **Common**: `space`, `enter`, `tab`, `backspace`, `esc`
- **Modifiers**: `leftshift`, `rightshift`, `leftctrl`, `rightctrl`, `leftalt`, `rightalt`

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
    "end": "path/to/power_pressed.sh"
}
```

Any valid shell command works here, including Python scripts.

The keys in this file are **key names**, not function names - use `end` rather than `power_stop`, and `backspace` rather than `last_channel`. A callback runs in addition to the normal function for that key, so mapping `end` still toggles the services as usual. The file is read once when the remote controller starts, so restart it after making changes.

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
{"status": "playing", "network_name": "MyStation", "channel_number": 42, "timestamp": "2025-02-03T08:13:46.431558", "awaiting_pin": false, "pin_digits_entered": 0}
```

**Player is stopped:**

```json
{"status": "stopped", "network_name": "", "channel_number": -1, "timestamp": "2025-02-03T08:13:46.431558"}
```