Title: Main Configuration Reference
Slug: docs/reference/main-config
Summary: Reference for confs/main_config.json - global settings including server options, normalize_titles, day_parts, and custom title patterns.

This document describes the main configuration file (`confs/main_config.json`) which contains global settings that apply across all stations.

## Overview

The `confs/main_config.json` file is optional. If it doesn't exist, FieldStation42 uses built-in defaults. Any settings you specify will override the defaults.

### Example Configuration

```json
{
  "server_host": "0.0.0.0",
  "server_port": 4242,
  "normalize_titles": true,
  "show_cable_box_time": true,
  "day_parts": {
    "morning": {"start_hour": 6, "end_hour": 10},
    "daytime": {"start_hour": 10, "end_hour": 18},
    "prime": {"start_hour": 18, "end_hour": 23},
    "late": {"start_hour": 23, "end_hour": 2},
    "overnight": {"start_hour": 2, "end_hour": 6}
  }
}
```

## Configuration Options

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `server_host` | string | `"0.0.0.0"` | Host address for the web server |
| `server_port` | integer | `4242` | Port for the web server |
| `channel_socket` | string | `"runtime/channel.socket"` | Unix socket for channel control |
| `status_socket` | string | `"runtime/play_status.socket"` | Unix socket for status updates |
| `time_format` | string | `"%H:%M"` | Format for displaying times (strftime format) |
| `date_time_format` | string | `"%Y-%m-%dT%H:%M:%S"` | Format for date/time values (strftime format) |
| `start_channel` | integer | none | Channel number to tune to on startup (must match a station's `channel_number`). When set, overrides `recall_last_channel`. |
| `recall_last_channel` | boolean | `true` | Whether to start on the last channel that was playing. If `false`, the system starts on the lowest numbered channel instead. Ignored when `start_channel` is set. |
| `start_mpv` | boolean | `true` | Whether to start mpv player automatically |
| `show_cable_box_time` | boolean | `true` | Show the current time in the cable box OSD display |
| `db_path` | string | `"runtime/fs42_fluid.db"` | Path to the SQLite database |
| `normalize_titles` | boolean | `false` | Enable automatic title normalization from filenames |
| `title_patterns` | array | `[]` | Custom regex patterns for title parsing (see below) |
| `video_seek_timeout` | integer | `10` | How long in seconds to wait when seeking in streams and videos before giving up |
| `schedule_agent` | object | none | Background agent for proactive schedule generation (see below) |
| `follow_static_symlinks` | boolean | `false` | Serve files through symlinks that point outside the static directories (see below) |
| `parental_controls_pin` | string | none | Four-digit PIN required before a locked station will play (see below) |
| `parental_controls_theme` | string | `"minimal"` | Visual style for the PIN prompt: `"classic"`, `"modern"`, or `"minimal"` |

## Live Schedule Agent

The live schedule agent runs in the background and automatically extends channel schedules before they expire, preventing the `schedule_panic` fallback from ever needing to fire during normal operation.

### Configuration

Add a `schedule_agent` block to `main_config.json`:

```json
{
    "schedule_agent": {
        "trigger_add_at": "day",
        "amount_to_add": "week"
    }
}
```

| Property | Options | Description |
|----------|---------|-------------|
| `trigger_add_at` | `"day"`, `"week"`, `"month"` | How close a channel's schedule can get to expiring before the agent extends it. `"day"` triggers when less than 24 hours remain; `"week"` when less than 7 days remain; `"month"` when less than 30 days remain. |
| `amount_to_add` | `"day"`, `"week"`, `"month"` | How much schedule to generate when triggered. |

### How It Works

- The agent checks all channel schedules approximately once per hour during playback
- If any channel's schedule ends within the `trigger_add_at` threshold, a background process is spawned to extend it by `amount_to_add`
- Schedule generation runs in a separate process so playback is not interrupted
- Once the build finishes, schedules are reloaded automatically on the next check
- A shared lock prevents conflicts between the background agent and the `schedule_panic` fallback

`schedule_panic` still fires if you tune to a channel with no schedule at all. The agent is proactive; `schedule_panic` is the last resort.

### Behavior Without Configuration

If `schedule_agent` is not present in your config, the agent does not activate and behavior is identical to before: `schedule_panic` handles everything on-demand.

## Validation and Error Handling

When FieldStation42 loads `main_config.json`:

1. **Pattern validation**: Each regex pattern is compiled to check for syntax errors
2. **Required fields**: Patterns must have both `pattern` and `group` fields
3. **Logging**: Successfully loaded patterns are logged with their descriptions
4. **Error recovery**: Invalid patterns are logged and skipped (they won't crash the system)

Check your logs on startup to verify your patterns loaded correctly:

```
INFO: Loaded custom title pattern: Studio releases with year and episode
INFO: Loaded custom title pattern: Remastered editions
INFO: Loaded 2 custom title pattern(s)
```



## Day Parts

Day parts define time periods used for scheduling purposes. Each day part has a start and end hour (0-23).

### Configuration

```json
{
  "day_parts": {
    "morning": {"start_hour": 6, "end_hour": 10},
    "daytime": {"start_hour": 10, "end_hour": 18},
    "prime": {"start_hour": 18, "end_hour": 23},
    "late": {"start_hour": 23, "end_hour": 2},
    "overnight": {"start_hour": 2, "end_hour": 6}
  }
}
```

### Wrapping Midnight

When `end_hour` is less than `start_hour`, the period wraps around midnight. For example, `late` runs from 11 PM to 2 AM.

## Custom Title Patterns

When `normalize_titles` is enabled, FieldStation42 automatically parses video filenames to extract clean, display-ready titles. You can add custom regex patterns to handle special naming conventions in your media library.

### Why Use Custom Patterns?

The built-in patterns handle common formats like:
- `Show Name - s01e05.mp4` -> "Show Name"
- `Movie (2020).mp4` -> "Movie"
- `[Group] Title - 03.mkv` -> "Title"

But if your files use a unique naming scheme, you can add custom patterns to parse them correctly.

### Pattern Format

Each pattern is an object with three fields:

```json
{
  "pattern": "regex pattern here",
  "group": 1,
  "description": "What this pattern matches"
}
```

- **pattern**: A regular expression string (remember to escape backslashes in JSON!)
- **group**: The capture group number containing the title (usually `1`)
- **description**: Optional human-readable description

### Example Patterns

```json
{
  "title_patterns": [
    {
      "pattern": "^\\[Studio\\][\\s._-]+(.+?)[\\s._-]+Special.*$",
      "group": 1,
      "description": "Studio specials with [Studio] prefix"
    },
    {
      "pattern": "^(.+?)[\\s._-]+HD[\\s._-]+\\d+p.*$",
      "group": 1,
      "description": "Videos with HD quality markers"
    },
    {
      "pattern": "^(.+?)_REMASTER_\\d{4}.*$",
      "group": 1,
      "description": "Remastered content"
    }
  ]
}
```

### How It Works

1. Custom patterns are tried **first**, in the order you specify
2. If a custom pattern matches, that title is used
3. If no custom pattern matches, built-in patterns are tried
4. The first matching pattern wins

**Example:**

Filename: `[Studio] My Great Show - Special Edition.mp4`

- **Without custom pattern**: "My Great Show Special Edition"
- **With pattern above**: "My Great Show"

### JSON Regex Escaping Guide

JSON requires backslashes to be escaped. Here's a quick reference:

| Regex Pattern | In JSON String |
|---------------|----------------|
| `\d` (any digit) | `"\\d"` |
| `\s` (whitespace) | `"\\s"` |
| `\w` (word character) | `"\\w"` |
| `\.` (literal period) | `"\\."` |
| `\[` (literal bracket) | `"\\["` |
| `[abc]` (character class) | `"[abc]"` *(no escape)* |
| `(group)` (capture group) | `"(group)"` *(no escape)* |
| `.*` (zero or more) | `".*"` *(no escape)* |
| `.+?` (non-greedy) | `".+?"` *(no escape)* |

### Common Separator Pattern

Many patterns use a "separator" regex to match spaces, dots, underscores, and dashes:

```json
"pattern": "^(.+?)[\\s._-]+Episode[\\s._-]+\\d+$"
```

This matches titles like:
- `Show Title Episode 05.mp4`
- `Show.Title.Episode.05.mp4`
- `Show_Title_Episode_05.mp4`
- `Show-Title-Episode-05.mp4`

### Testing Your Patterns

Before adding patterns to your config:

1. Test your regex using a tool like [regex101.com](https://regex101.com)
2. Make sure to select the Python flavor
3. Remember to add the JSON escaping when copying to your config
4. Check the FieldStation42 logs on startup - they will show if patterns fail to compile

### Example: Complete Configuration

```json
{
  "server_port": 4242,
  "normalize_titles": true,
  "title_patterns": [
    {
      "pattern": "^\\[STUDIO\\][\\s._-]+(.+?)[\\s._-]+\\d{4}[\\s._-]+\\d+.*$",
      "group": 1,
      "description": "Studio releases with year and episode"
    },
    {
      "pattern": "^(.+?)[\\s._-]+REMASTERED[\\s._-]+.*$",
      "group": 1,
      "description": "Remastered editions"
    }
  ],
  "day_parts": {
    "morning": {"start_hour": 6, "end_hour": 10},
    "daytime": {"start_hour": 10, "end_hour": 18},
    "prime": {"start_hour": 18, "end_hour": 23},
    "late": {"start_hour": 23, "end_hour": 2},
    "overnight": {"start_hour": 2, "end_hour": 6}
  },
  "schedule_agent": {
    "trigger_add_at": "day",
    "amount_to_add": "week"
  }
}
```
### Best Practices

1. **Start simple**: Add one pattern at a time and test it
2. **Order matters**: Put more specific patterns first
3. **Be precise**: Use `^` and `$` anchors to match the whole filename
4. **Use non-greedy**: `.+?` instead of `.+` to avoid over-matching
5. **Document**: Always include a description for future reference
6. **Test filenames**: Verify your patterns work with actual filenames from your library

## Following Static Symlinks

By default, the web server refuses to serve a file if the path resolves outside of its static directories. This is a safety measure: it keeps a stray symlink from exposing the rest of your filesystem over the network.

Setting `follow_static_symlinks` to `true` relaxes that check, so symlinked files are served as if they lived in the static directory itself.

```json
{
  "follow_static_symlinks": true
}
```

### Why You Might Want This

The most common use is keeping CSS themes somewhere other than the FieldStation42 install. Instead of copying a theme file into the static directory every time you change it, you can link to it:

```bash
ln -s ~/my-themes/retro-amber.css static/themes/retro-amber.css
```

With `follow_static_symlinks` enabled, the linked theme shows up in the web console theme list just like any other theme. Your themes stay in your own directory, survive a fresh checkout, and can live in their own git repository.

The same applies to any other static asset you would rather store outside the project, such as logos, fonts, or background images.

### Security Note

Only enable this if you control the contents of your static directories. A symlink can point anywhere the FieldStation42 process can read, so a link pointing at something like a home directory or a config file would make that file reachable from the web server. Keep the setting off unless you are actually using symlinks, and only link to files you intend to publish.

If your web server is reachable beyond your local network, be especially deliberate about what you link.



## Parental Controls

Setting `parental_controls_pin` turns on an optional PIN prompt. Individual stations opt in by setting `parental_controls` to `true` in their own config, and those stations will not play until the PIN is entered.

Setting it up takes two files.

**1. Set the PIN in `confs/main_config.json`.** Both keys belong at the top level of the file, alongside your other main config settings:

```json
{
  "parental_controls_pin": "1234",
  "parental_controls_theme": "classic"
}
```

**2. Lock the stations you want**, in each station's own config file, inside `station_conf`:

```json
{
  "station_conf": {
    "network_name": "Drama",
    "channel_number": 13,
    "parental_controls": true
  }
}
```

Repeat that for every station you want behind the prompt. There is one shared PIN for the whole system, not one per station.

The PIN must be exactly four digits. If it is missing or malformed, parental controls stay off entirely and every station plays normally, with a warning in the log. The `parental_controls_theme` setting controls the look of the prompt and accepts `classic` (dark with yellow text), `modern` (dark with a blue accent), or `minimal` (light and plain). Anything else falls back to `minimal`.

When you tune to a locked station, playback stops and the prompt appears. The correct PIN starts the station; a wrong entry clears the digits and lets you try again. The unlock only lasts while you stay put - tune away and come back, and the PIN is required again.

Only `standard` stations honor the setting. Guide, web, and executable channels start before the check runs, so setting `parental_controls` on one of those is accepted by the config schema but has no effect.

### Entering the PIN

PIN entry works from the number keys on a [connected IR remote](/docs/guides/remote-control/), from the [web remote](/docs/reference/web-remote/), and from the `/player/parental/digit/{digit}` API endpoint.

On the web remote, the number buttons switch to entering PIN digits on their own whenever a locked station is waiting for one, and go back to changing channels once it unlocks. To leave a locked station without unlocking it, use channel up/down, the guide button, or the last-channel button.

### When Nothing Happens

Every way this can be misconfigured fails the same way - the locked station simply plays, with no prompt and nothing on screen to explain why. Check these in order:

- **Is the PIN at the top level of `main_config.json`?** Nesting it inside another object - under `custom_holidays`, say - is silently ignored. Only recognized top-level keys are read into the config.
- **Is the PIN exactly four digits, in quotes?** Anything else turns parental controls off for every station. The warning goes to the player log, not to the screen.
- **Is the station a `standard` network?** Guide, web, and executable channels never reach the check, as described above.

### What This Actually Protects

Treat this as an entertainment feature, not a security control. The PIN is stored in plain text in `main_config.json`, and it only gates playback on the TV - it does not restrict the web console, the API, or the guide, all of which can still see and tune the locked station. It is there to keep a channel off the dial for casual viewing, in the spirit of the hardware it imitates.
