Title: Station Configuration Reference
Slug: docs/reference/station-config
Summary: Complete reference for FieldStation42 station/channel configuration files - required properties, network types, scheduling, sequences, marathons, and advanced features.

This document describes the configuration format for FieldStation42 station/channel configurations.

## Overview

Each station is configured via a JSON file in the `confs/` directory. The configuration file must contain a top-level `station_conf` object with the station's settings.

### Minimal Configuration

```json
{
  "station_conf": {
    "network_name": "MyChannel",
    "channel_number": 5
  }
}
```

All other properties have sensible defaults applied by the system.

### Default Values

If not specified, the following defaults are automatically applied:

| Property | Default Value |
|----------|---------------|
| `network_type` | `"standard"` |
| `schedule_increment` | `30` |
| `break_strategy` | `"standard"` |
| `commercial_free` | `false` |
| `clip_shows` | `[]` |
| `break_duration` | `120` |
| `hidden` | `false` |

## Required Properties

Only two properties are **strictly required**:

| Property | Type | Description |
|----------|------|-------------|
| `network_name` | string | Display name of the network/channel |
| `channel_number` | integer | Channel number for tuning |

## Network Types

The `network_type` property determines how the station operates:

| Type | Description | Common Use Case |
|------|-------------|-----------------|
| `standard` | Traditional TV station with scheduled programming | Broadcast channels with hourly schedules |
| `web` | Embeds a web page as the channel | Diagnostic pages, web content |
| `guide` | Interactive program guide display | Channel 0 / EPG |
| `loop` | Continuously loops content | Simple playlist channels |
| `streaming` | Plays external streaming sources | Live streams, HLS/m3u8 feeds |

## Top-Level Properties

### General Properties

| Property | Type | Description | Valid Values |
|----------|------|-------------|--------------|
| `network_name` | string | **Required.** Name of the network | Any string |
| `network_long_name` | string | Extended/full network name | Any string |
| `channel_number` | integer | **Required.** Channel number | Any positive integer |
| `network_type` | string | Type of network operation | `"standard"`, `"web"`, `"guide"`, `"loop"`, `"streaming"` |
| `hidden` | boolean | Hide channel from guide listings | `true`, `false` |
| `active_rules` | object | Availability rules for when this config should be active | See [Active Rules](#active-rules) below |

### Scheduling Properties (Standard Networks)

| Property | Type | Description | Valid Values |
|----------|------|-------------|--------------|
| `schedule_increment` | integer | Time slot increment in minutes | `0` (continuous), `30`, `60`, etc. |
| `schedule_offset` | integer | Offset in minutes from start of hour for showtimes | `5` (shows at :05, :35), `15` (shows at :15, :45), etc. |
| `break_strategy` | string | When to insert commercial breaks | `"standard"` (interspersed), `"end"` (end of program), `"center"` (single break in middle) |
| `commercial_free` | boolean | Whether channel has commercials | `true`, `false` |
| `break_duration` | integer | Duration of commercial breaks in seconds | Any positive integer (default: `120`) |
| `fallback_tag` | string | Tag/folder used when no content is found for a scheduled slot | A valid tag |

### Directory Paths

| Property | Type | Description |
|----------|------|-------------|
| `content_dir` | string | Directory containing video content files |
| `bump_dir` | string | Directory containing bump/interstitial videos |
| `commercial_dir` | string | Directory containing commercial videos |
| `runtime_dir` | string | Directory for runtime data (schedules, catalogs) |

### Media Files

| Property | Type | Description |
|----------|------|-------------|
| `standby_image` | string | Image shown when channel is on standby |
| `be_right_back_media` | string | Image/video shown during brief interruptions |
| `sign_off_video` | string | Video played during sign-off event |
| `off_air_video` | string | Video/pattern shown when off-air |

### Data Files

| Property | Type | Description |
|----------|------|-------------|
| `catalog_path` | string | Path to binary catalog file (`.bin`) |
| `schedule_path` | string | Path to binary schedule file (`.bin`) |

### Clip Shows

| Property | Type | Description |
|----------|------|-------------|
| `clip_shows` | array | List of clip show configurations |

Clip shows can be specified as:
- **Simple string**: `"show_tag"` (defaults to 60-minute duration)
- **Object**: `{"tags": "show_tag", "duration": 30}` (duration in minutes)

Example:
```json
"clip_shows": [
  "quickstop",
  {"tags": "variety", "duration": 30}
]
```

The system automatically adjusts durations based on `break_strategy` to account for commercial time.

### Active Rules

| Property | Type | Description |
|----------|------|-------------|
| `active_rules` | object | Rules that determine when this configuration should be active |

Active rules allow you to conditionally load a station configuration based on date ranges. If the active rules are not met, the configuration file will not be loaded on startup.

**Supported Rules:**

| Rule Property | Type | Description |
|---------------|------|-------------|
| `date_range` | string | Date range in the format: "Month Day - Month Day" (e.g., "December 1 - January 2") |

When `date_range` is specified, the configuration will only be loaded if the current date falls within the specified range (inclusive). The format uses full month names (capitalized) followed by the day of month, separated by a space-hyphen-space sequence.

Example:
```json
"active_rules": {
  "date_range": "December 1 - January 2"
}
```

This would make the configuration active only during the holiday season from December 1st through January 2nd.

**Note:** If the date range does not parse correctly, a warning will be logged and the configuration will still be loaded.

**See also:** To override the schedule on a single calendar date without swapping the entire config, use [`date_overrides`](#date-specific-overrides). To swap in a different week of programming for a stretch of dates, use [`week_overrides`](#week-schedule-overrides).

### Fallback Content

| Property | Type | Description |
|----------|------|-------------|
| `fallback_tag` | string | Tag/folder to use when no matching content is found |

When the scheduler cannot find content matching the scheduled tags (e.g., due to filtering or empty catalog), it will attempt to use content from the `fallback_tag` directory instead. This is useful for generic content that should only play when all other scheduled content has been filtered out.

Example:
```json
"fallback_tag": "generic-content"
```

If no `fallback_tag` is specified and content is not found, the scheduler will generate an error and stop.

### Display Properties

| Property | Type | Description |
|----------|------|-------------|
| `video_keepaspect` | boolean | Maintain video aspect ratio (default: `true`) |
| `panscan` | number | MPV panscan value (e.g., `1.0`) to fill screen by cropping top/bottom and left/right edges |
| `fullscreen` | boolean | Display in fullscreen mode |
| `width` | integer | Window width (pixels) (Guide only) |
| `height` | integer | Window height (pixels) (Guide only) |
| `window_decorations` | boolean | Show window decorations (Guide only) |

### Video and Audio Effects

| Property | Type | Description |
|----------|------|-------------|
| `video_scramble_fx` | string | Apply preset video scrambling effect (see values below) |
| `audio_scramble_fx` | string | Apply preset audio scrambling effect (see values below) |
| `station_fx` | string | Custom FFMPEG video filter string (ignored if `video_scramble_fx` is set) |

**Available `video_scramble_fx` values:**
- `horizontal_line` - Classic cable horizontal line scrambling
- `diagonal_lines` - Deep scrambling with diagonal patterns
- `static_overlay` - Static distortion overlay with rapid effects
- `pixel_block` - Heavy pixelation with random blocks
- `color_inversion` - Horizontal bars with inverted colors
- `severe_noise` - Intense noise effect
- `wavy` - Wavy distortion pattern
- `random_block` - Random block replacement distortion
- `chunky_scramble` - Complex realistic scramble effect
- `spicy` - Spicy scrambling effect
- `special_sauce` - Authentic scrambled cable TV emulation (pairs with the matching audio effect)
- `glitchtastic` - Glitchy digital look

**Available `audio_scramble_fx` values:**
- `special_sauce` - Audio companion to the `special_sauce` video effect

Both fields accept the same kind of value: a preset name applied as an mpv filter at playback time. They can be set independently or paired. New presets are defined in `fs42/station_player.py` and then referenced by name from a station config.

Example pairing both effects on a scrambled premium channel:
```json
{
  "video_scramble_fx": "special_sauce",
  "audio_scramble_fx": "special_sauce"
}
```

### On-Screen Display (Logo) Properties

| Property | Type | Description |
|----------|------|-------------|
| `logo_dir` | string | Directory containing logo image files |
| `show_logo` | boolean | Whether to display station logo on screen |
| `default_logo` | string | Default logo filename (e.g., `"StationLogo.png"`) |
| `logo_permanent` | boolean | If `true`, logo stays on screen; if `false`, may appear/disappear |
| `multi_logo` | string | Multi-logo configuration identifier |

### Web Network Properties

| Property | Type | Description |
|----------|------|-------------|
| `web_url` | string | URL to display (e.g., `"http://localhost:4242/diagnostics.html"`) |

### Guide Network Properties

| Property | Type | Description |
|----------|------|-------------|
| `messages` | array of strings | Text messages to display |
| `images` | array of strings | Image paths to display |
| `play_sound` | boolean | Whether to play background sound |
| `sound_to_play` | string or array | Path to audio file, directory path, or array of files for shuffle playlist |
| `scroll_speed` | number | Speed of scrolling (e.g., `1.0`) |

#### Guide Audio Examples

Single audio file:
```json
{
  "network_type": "guide",
  "play_sound": true,
  "sound_to_play": "runtime/guide/background.mp3"
}
```

Directory of audio files (automatically finds all .mp3 files and shuffles):
```json
{
  "network_type": "guide",
  "play_sound": true,
  "sound_to_play": "runtime/guide/music"
}
```
**Note:** Trailing slash is optional - any valid directory path will be auto-detected and expanded

Explicit shuffle playlist (plays files in random order, looping indefinitely):
```json
{
  "network_type": "guide",
  "play_sound": true,
  "sound_to_play": [
    "runtime/guide/track1.mp3",
    "runtime/guide/track2.mp3",
    "runtime/guide/track3.mp3",
    "runtime/guide/track4.mp3"
  ]
}
```

### Loop Network Properties

| Property | Type | Description |
|----------|------|-------------|
| `shuffle_loop` | boolean | When `true`, every video in `content_dir` plays once before the list is shuffled and replayed. Defaults to `false` (alphabetical order, looping). |

Example:
```json
{
  "network_type": "loop",
  "content_dir": "catalog/loop",
  "shuffle_loop": true
}
```

### Streaming Network Properties

| Property | Type | Description |
|----------|------|-------------|
| `streams` | array of objects | Stream definitions |

Each stream object contains:
```json
{
  "url": "https://example.com/stream.m3u8",
  "duration": 30,
  "title": "Stream Title"
}
```

## Day Scheduling

**Standard networks require all 7 days to be defined** (even if they're empty `{}`). Days are specified using lowercase full names:

- `monday`
- `tuesday`
- `wednesday`
- `thursday`
- `friday`
- `saturday`
- `sunday`

### Direct Scheduling

Define hour-by-hour slots directly:

```json
"monday": {
  "0": {"tags": "late-night"},
  "1": {"tags": "late-night"},
  "6": {"tags": "morning"},
  "12": {"tags": "daytime"},
  "20": {"tags": "primetime"}
}
```

**Note:** Hours not specified are treated as **off-air**. Days can be empty objects `{}` if the entire day is off-air, but all 7 days must be present in the configuration.

### Template References

Create reusable schedules using `day_templates`:

```json
"day_templates": {
  "weekday": {
    "6": {"tags": "morning"},
    "12": {"tags": "daytime"},
    "20": {"tags": "primetime"}
  }
},
"monday": "weekday",
"tuesday": "weekday",
"wednesday": "weekday"
```

**Processing:** Template references are resolved during config preprocessing by `ConfigProcessor._process_templates()`.

### Date-Specific Overrides

Use `date_overrides` to replace the normal weekday schedule on specific calendar dates. This is useful for holiday marathons, one-off events, and full-day takeovers.

FieldStation42 has two calendar-based override mechanisms. `date_overrides` applies a single day of programming to every matching date. [`week_overrides`](#week-schedule-overrides) applies a full week of programming across a range, keeping weekdays distinct. Both are resolved per hour against the regular weekday schedule, in the order described under [Override Resolution Order](#override-resolution-order).

| Property | Type | Description |
|----------|------|-------------|
| `date_overrides` | object | Map of `"Month Day"` strings to a `day_template` name or an inline hour-slot object |

Each key is a date written as `"Month Day"` (full month name, capitalized, followed by the day of the month). Each value is either:

- A string referencing a `day_templates` entry, or
- An object using the same hour-slot structure as a normal weekday.

Reference an existing template:
```json
"day_templates": {
  "christmas_day": {
    "0": {"tags": "christmas_movie"},
    "1": {"tags": "christmas_movie"}
  }
},
"date_overrides": {
  "December 25": "christmas_day"
}
```

Define the override inline:
```json
"date_overrides": {
  "December 25": {
    "0": {"tags": "christmas_movie"},
    "1": {"tags": "christmas_movie"},
    "2": {"tags": "christmas_movie"},
    "3": {"event": "signoff"}
  }
}
```

Partial overrides are supported. Hours not specified in the override fall back to the normal weekday schedule for that hour:
```json
"date_overrides": {
  "April 23": {
    "20": {"tags": "wwf"},
    "21": {"tags": "wcw"}
  }
}
```

On April 23, only 8 PM and 9 PM are overridden; every other hour uses the regular weekday schedule.

Date ranges are supported using the `"Month Day - Month Day"` form, and ranges that wrap the year boundary (`"December 24 - January 2"`) are handled correctly. Every date in the range receives the identical hour schedule regardless of what weekday it falls on. For a range that should keep its weekday structure, use [`week_overrides`](#week-schedule-overrides) instead.

**Resolution order:** See [Override Resolution Order](#override-resolution-order) below.

### Week Schedule Overrides

Use `week_overrides` to substitute a different **week** of programming across a date range. Unlike `date_overrides`, which applies one flat day of programming to every matching date, a week override preserves the weekday structure, so Saturday can still differ from Tuesday inside the range.

| Property | Type | Description |
|----------|------|-------------|
| `week_overrides` | object | Map of `"Month Day"` or `"Month Day - Month Day"` strings to a week schedule object |

**Date keys** use the same format as `date_overrides`: full month name, capitalized, followed by the day of the month. A single date or an inclusive range separated by a spaced hyphen (` - `). Years are never part of the key, so an entry applies every year. Ranges wrapping December into January are supported.

If two ranges overlap, the first entry listed in the config file wins. Order entries from most specific to least specific if you depend on this.

**Week schedule values** are objects keyed by lowercase day names (`monday` through `sunday`). Each day is either an object of hour slots or a string naming a `day_templates` entry:

```json
"week_overrides": {
  "November 20 - November 27": {
    "thursday": {"12": {"tags": "parade"}, "16": {"tags": "football"}},
    "friday": "holiday_shopping"
  }
}
```

Day keys are case-sensitive. A capitalized `Monday` is a configuration error rather than being silently ignored. Hour keys are strings, `"0"` through `"23"`, exactly as in a normal day schedule, and slots accept all the usual properties (`tags`, `bump_dir`, `commercial_dir`, `sequence`, `marathon`, and so on).

Full seasonal example:

```json
"day_templates": {
  "summer_weekday": {
    "6": {"tags": "summer_morning"},
    "20": {"tags": "summer_movie"}
  },
  "summer_weekend": {
    "8": {"tags": "cartoons"},
    "20": {"tags": "creature_feature"}
  }
},
"week_overrides": {
  "June 21 - September 1": {
    "monday": "summer_weekday",
    "tuesday": "summer_weekday",
    "wednesday": "summer_weekday",
    "thursday": "summer_weekday",
    "friday": "summer_weekday",
    "saturday": "summer_weekend",
    "sunday": "summer_weekend"
  }
}
```

Templates referenced from a week override are copied, not shared, so the same template can be used by the regular weekday schedule at the same time.

Slots inside a week override may reference a `slot_overrides` definition through the `overrides` key, with the same overridable property set listed under [Slot Overrides](#slot-overrides):

```json
"slot_overrides": {
  "movie_night": {"break_strategy": "standard", "marathon": true}
},
"week_overrides": {
  "October 25 - October 31": {
    "friday": {"20": {"tags": "horror", "overrides": "movie_night"}}
  }
}
```

**Catalog scanning:** Tags referenced inside a week override are picked up by the catalog scan, so their content is indexed like anything else. Sequences declared in override slots are scanned as well.

**Continued slots:** `"continued": true` works inside a week override, inheriting tags from the previous slot in that same override week. A continued slot cannot inherit across the fallthrough boundary from the regular schedule. If hour 21 is `continued` and the override week defines no preceding tagged slot, a configuration error is raised at startup.

### Override Resolution Order

When the scheduler resolves a given hour, it checks in this order:

1. `date_overrides`, an exact-date or range entry matching today
2. `week_overrides`, a week entry whose range contains today, at today's weekday
3. The regular weekday schedule
4. Off air, if none of the above define that hour

Resolution happens **per hour, not per day**. Both override types are patches over the normal schedule rather than replacements for it. An hour left undefined in an override falls through to the next level, so omitting an hour does not make it off air. To take an hour off air during an override, define the day explicitly.

Dates are validated when the config is loaded. An impossible date such as `"April 31"` raises a Configuration Error immediately rather than silently never matching during scheduling.

**Week override validation errors:**

| Message | Cause |
|---------|-------|
| `Invalid week_overrides key '...'` | Date key isn't `Month Day` or `Month Day - Month Day`, or the date doesn't exist |
| `... must be an object with day keys` | The value for a date key isn't an object |
| `... has unknown day key '...'` | Misspelled or capitalized day name |
| `... must be a day template reference or an object of hourly slots` | A day's value is neither a string nor an object |
| `... references template '...', but that template doesn't exist` | Unknown `day_templates` name |
| `... must be a slot object` | An hour's value isn't an object |
| `... references slot override '...' that doesn't exist` | Unknown `slot_overrides` name |
| `... tries to override '...'` | Property isn't in the overridable list |
| `'continued' at hour ... has no preceding tags slot` | No preceding tagged slot exists within the same override week |

The JSON schema in `fs42/station_config_schema.json` also covers `week_overrides`, so schema validation catches most structural mistakes before the station starts.

## Time Slot Configuration

Each hour slot is an object that can contain:

### Basic Properties

| Property | Type | Description |
|----------|------|-------------|
| `tags` | string or array | Content tag(s) to select from catalog |
| `event` | string | Special event (`"signoff"`) |

### Tag Selection

Tags can be:
- **Single string**: `"tags": "sitcom"`
- **Array** (for half-hour splits): `"tags": ["show1", "show2"]`
  - First half-hour (0-29 minutes): uses first tag
  - Second half-hour (30-59 minutes): uses second tag
- **Array with `random_tags`**: Randomly selects from the array

### Bump/Commercial Overrides

| Property | Type | Description |
|----------|------|-------------|
| `start_bump` | string | Path to bump video before content |
| `end_bump` | string | Path to bump video after content |
| `bump_dir` | string | Override bump directory for this slot |
| `commercial_dir` | string | Override commercial directory for this slot |
| `video_scramble_fx` | string or boolean | Apply video scrambling effect (see available effects above) or `false` to disable |
| `audio_scramble_fx` | string or boolean | Apply audio scrambling effect (see available effects above) or `false` to disable |

### Scheduling Overrides

| Property | Type | Description |
|----------|------|-------------|
| `schedule_increment` | integer | Override time increment for this slot |
| `break_strategy` | string | Override break strategy (`"standard"`, `"end"`, or `"center"`) |

### Sequences

Sequences allow playing episodes in order from a specific range:

| Property | Type | Description |
|----------|------|-------------|
| `sequence` | string | Sequence identifier |
| `sequence_start` | number | Starting point (0.0 to 1.0) |
| `sequence_end` | number | Ending point (0.0 to 1.0) |

Example:
```json
{
  "tags": "golden_girls",
  "sequence": "gg-season1",
  "sequence_start": 0.0,
  "sequence_end": 0.5
}
```

This plays the first half of the `gg-season1` sequence in order.

### Marathons

Trigger probabilistic multi-episode marathons:

| Property | Type | Description |
|----------|------|-------------|
| `marathon` | object | Marathon configuration |

Marathon object contains:
- `chance`: Probability (0.0 to 1.0) of marathon occurring
- `count`: Number of episodes to play consecutively
- `hint` (optional): Restricts the marathon to a specific time period -- accepts a month name, quarter (`Q1`-`Q4`), date range, or day of week. See [Scheduling Hints](/docs/guides/scheduling-hints/) for the full format.

Example:
```json
{
  "tags": "real_people",
  "marathon": {
    "chance": 0.5,
    "count": 6
  }
}
```

This has a 50% chance of playing 6 consecutive episodes.

To restrict a marathon to a specific season or day:

```json
{
  "tags": "horror",
  "marathon": {
    "chance": 1,
    "count": 6,
    "hint": "October 15 - October 31"
  }
}
```

**Processing:** Marathons are detected and executed by `MarathonAgent` during schedule building.

### Slot Overrides

Define named override sets for reuse across multiple time slots:

```json
"slot_overrides": {
  "prime_slots": {
    "start_bump": "caps/primetime_start.mp4",
    "end_bump": "caps/primetime_end.mp4",
    "break_strategy": "end",
    "schedule_increment": 60
  }
},
"monday": {
  "20": {"tags": "drama", "overrides": "prime_slots"},
  "21": {"tags": "sitcom", "overrides": "prime_slots"}
}
```

**Processing:** The `overrides` key is resolved by `ConfigProcessor._process_strategy()`, which inlines the properties and removes the `overrides` key.

**Overridable Properties:**
- `start_bump`, `end_bump`
- `bump_dir`, `commercial_dir`
- `break_strategy`
- `sequence`, `sequence_start`, `sequence_end`
- `schedule_increment`
- `random_tags`
- `video_scramble_fx`
- `audio_scramble_fx`
- `marathon`

### Tag Overrides

Define tag-based overrides that are automatically applied when content from a specific tag path is selected:

```json
"tag_overrides": {
  "sitcoms/friends": {
    "start_bump": "extra/friends_start.mp4",
    "end_bump": "extra/friends_end.mp4",
    "bump_dir": "extra/friends_bumps",
    "commercial_dir": "extra/friends_commercials",
    "break_strategy": "end",
    "schedule_increment": 30
  },
  "movies/action": {
    "break_strategy": "center",
    "schedule_increment": 120
  }
}
```

**How Tag Overrides Work:**

Tag overrides work similarly to slot overrides, but are applied automatically based on the content tag of the selected episode/video. The system detects when selected content has a more specific tag than what was scheduled and applies the corresponding override.

**Nested Tag Detection:**

Tags can be hierarchical (e.g., `sitcoms/friends`). When a slot schedules content using tag `"sitcoms"` and an episode from `"sitcoms/friends"` is selected, the system detects the difference and applies the `"sitcoms/friends"` tag override if one is defined.

**Example:**
```json
"tag_overrides": {
  "sitcoms/friends": {
    "start_bump": "friends_intro.mp4",
    "commercial_dir": "friends_commercials"
  }
},
"monday": {
  "20": {"tags": "sitcoms"}
}
```

If the scheduler picks an episode from `catalog/content/sitcoms/friends/`, the `"sitcoms/friends"` tag override will be applied automatically, using the Friends-specific bumps and commercials.

**Overridable Properties:**
Same as slot overrides:
- `start_bump`, `end_bump`
- `bump_dir`, `commercial_dir`
- `break_strategy`
- `sequence`, `sequence_start`, `sequence_end`
- `schedule_increment`
- `random_tags`
- `video_scramble_fx`
- `audio_scramble_fx`
- `marathon`

### Random Tag Selection

```json
{
  "tags": ["show1", "show2", "show3"],
  "random_tags": true
}
```

Randomly selects one tag from the array for each scheduling operation.

### Continued Slots

Use `"continued": true` to inherit the previous hour's tags (applies tag smoothing):

```json
"monday": {
  "20": {"tags": "movie"},
  "21": {"continued": true},
  "22": {"continued": true}
}
```

**Processing:** Tag smoothing is applied by `SlotReader.smooth_tags()` during station initialization.

## Advanced Features

### Autobump

Automatically generate bump videos with metadata:

```json
"autobump": {
  "title": "NBC TV",
  "subtitle": "Classic Television",
  "variation": "retro",
  "detail1": "Line 1 of details",
  "detail2": "Line 2 of details",
  "detail3": "Line 3 of details",
  "bg_music": "logo1.mp3",
  "strategy": "both"
}
```

| Property | Description |
|----------|-------------|
| `strategy` | When to show autobumps: `"both"`, `"start"`, `"end"` |
| `variation` | Visual style variant |

### Configuration Processing Pipeline

1. **Load JSON** (`StationManager.load_json_stations()`)
2. **Preprocess** (`ConfigProcessor.preprocess()`)
   - Resolve template references
   - Inline slot overrides
3. **Apply Defaults** (from `__overwatch`)
4. **Normalize Clip Shows** (convert to duration objects)
5. **Smooth Tags** (for standard networks via `SlotReader.smooth_tags()`)
6. **Add Metadata** (`_has_catalog`, `_has_schedule`)

## Validation

A JSON Schema is provided at `station_config_schema.json` for validation. Use the included `validate_configs.py` script:

```bash
python3 validate_configs.py
```

## Notes

- **File paths** in configuration are relative to the FieldStation42 root directory
- **Hour keys** in day schedules are strings (`"0"` through `"23"`)
- **Off-air hours** are simply omitted from the schedule
- **Template and override references** are case-sensitive
- **Network types** without schedules: `guide`, `streaming`, `web`
- **Network types** without catalogs: `guide`, `streaming`, `web`

## See Also

- `confs/examples/` - Example configuration files
- `station_config_schema.json` - JSON Schema for validation
- `fs42/config_processor.py` - Configuration preprocessing logic
- `fs42/slot_reader.py` - Schedule slot reading logic
- `fs42/station_manager.py` - Station loading and initialization
