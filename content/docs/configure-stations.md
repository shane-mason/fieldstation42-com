Title: Configure Stations
Slug: docs/configure-stations
Summary: Create JSON configuration files that define your TV station's name, channels, content directories, and weekly schedules.

This guide will help you create your first TV station configuration. If you're new to JSON files, don't worry - we'll walk through everything step by step.

**Note:** This guide focuses on **standard TV networks** (scheduled programming with commercials/bumps). FieldStation42 also supports other network types like web channels, program guides, looping playlists, and external streams. See the [Channel Recipe guide](https://github.com/shane-mason/FieldStation42/wiki/Channel-Recipes) and the [detailed technical specification](https://github.com/shane-mason/FieldStation42/blob/main/docs/STATION_CONFIG_README.md#video-effects) for complete documentation on all network types.

## What You Need to Know About JSON

JSON is a simple text format for storing settings. Here are the key rules:

- **Use double quotes** around text: `"network_name"` not `'network_name'`
- **Commas** separate items, but don't put one after the last item
- **Curly braces** `{ }` group related settings
- **Square brackets** `[ ]` create lists
- **No comments allowed** - can't use `//` like in other languages

### Common Mistakes to Avoid

- Trailing comma: `"channel_number": 5,` - remove this comma if it's the last item
- Missing quotes: `network_name: "MyTV"` - should be `"network_name": "MyTV"`
- Single quotes: `'network_name'` - must use double quotes: `"network_name"`
- Comments in file: `// this is my channel` - JSON doesn't support comments

## Quick Start: Your First Channel

The simplest possible station configuration needs **2 required fields plus all 7 days defined**:

```json
{
  "station_conf": {
    "network_name": "My First Channel",
    "channel_number": 5,
    "content_dir": "catalog/my_videos",
    "monday": {},
    "tuesday": {},
    "wednesday": {},
    "thursday": {},
    "friday": {},
    "saturday": {},
    "sunday": {}
  }
}
```

**Important:** All standard networks must define all 7 days (monday through sunday). Use empty `{}` for days with no programming.

### What This Does

- Creates a channel called "My First Channel"
- Assigns it to channel number 5
- Has all 7 days defined (required for standard networks)
- The channel will be **off-air** since no hours are scheduled
- Uses default settings (30-minute blocks, standard commercials, etc.)

**To actually run this channel:** You need to either:

1. Add scheduled hours to at least one day (see Step 4 below), OR
2. Add `"off_air_video": "runtime/pattern.mp4"` to show a looping video during off-air times

Without scheduled content or an off-air pattern, the schedule builder will report an error.

## Step-by-Step: Building a Complete Station

Let's build a more realistic TV station configuration step by step.

### Step 1: Basic Information

Every station starts with these basics (including all 7 days):

```json
{
  "station_conf": {
    "network_name": "Classic TV",
    "channel_number": 4,
    "content_dir": "catalog/classic_content",
    "monday": {},
    "tuesday": {},
    "wednesday": {},
    "thursday": {},
    "friday": {},
    "saturday": {},
    "sunday": {}
  }
}
```

- **network_name**: What viewers see (e.g., "HBO", "NBC", "My Music Channel")
- **channel_number**: The channel number to tune to (must be unique)
- **content_dir**: Folder where your video files are stored
- **All 7 days**: Must be present for standard networks (we'll add schedules in Step 4)

### Step 2: Add Scheduling Settings

Control how your shows are scheduled:

```json
{
  "station_conf": {
    "network_name": "Classic TV",
    "channel_number": 4,
    "content_dir": "catalog/classic_content",
    "schedule_increment": 30,
    "break_strategy": "standard",
    "commercial_free": false,
    "monday": {},
    "tuesday": {},
    "wednesday": {},
    "thursday": {},
    "friday": {},
    "saturday": {},
    "sunday": {}
  }
}
```

*This is a complete, valid configuration.*

**What These Mean:**

- **schedule_increment**: Minutes shows fit into (30 = half-hour blocks). Set to `0` for continuous play, no breaks.
- **break_strategy**: Where commercials go:
  - `"standard"` - spread throughout the show (like real TV)
  - `"end"` - all at the end of the show
  - `"center"` - one break in the middle
- **commercial_free**: Set to `true` for no commercials (still uses bumps)

### Step 3: Point to Your Media Folders

Tell the station where to find commercials and bumps:

```json
{
  "station_conf": {
    "network_name": "Classic TV",
    "channel_number": 4,
    "content_dir": "catalog/classic_content",
    "schedule_increment": 30,
    "break_strategy": "standard",
    "commercial_free": false,
    "commercial_dir": "commercial",
    "bump_dir": "bump",
    "monday": {},
    "tuesday": {},
    "wednesday": {},
    "thursday": {},
    "friday": {},
    "saturday": {},
    "sunday": {}
  }
}
```

*This is a complete, valid configuration.*

**Note:** The `commercial_dir` and `bump_dir` are subfolders inside your `content_dir`.

### Step 4: Add a Weekly Schedule

Define what plays each hour. Hours are numbered 0-23 (midnight to 11 PM):

```json
{
  "station_conf": {
    "network_name": "Classic TV",
    "channel_number": 4,
    "content_dir": "catalog/classic_content",
    "commercial_dir": "commercial",
    "bump_dir": "bump",
    "monday": {
      "7": {"tags": "cartoons"},
      "8": {"tags": "cartoons"},
      "9": {"tags": "sitcoms"},
      "12": {"tags": "movies"},
      "20": {"tags": "sitcoms"},
      "21": {"tags": "sitcoms"},
      "23": {"tags": "movies"}
    },
    "tuesday": {
      "7": {"tags": "cartoons"},
      "20": {"tags": "sitcoms"}
    },
    "wednesday": {},
    "thursday": {},
    "friday": {},
    "saturday": {},
    "sunday": {}
  }
}
```

*Note: This example is abbreviated for clarity - only Monday and Tuesday have scheduled hours. The other days are empty (off-air).*

**Understanding Tags:**

- A **tag** is the name of a subfolder in your `content_dir`
- If you have `catalog/classic_content/sitcoms/`, use `"tags": "sitcoms"`
- The scheduler picks a random video from that folder

**Understanding Hours:**

- `"7"` = 7:00 AM
- `"12"` = noon
- `"20"` = 8:00 PM (use 24-hour format)
- Hours must be **strings** (with quotes): `"7"` not `7`

**Hours Not Listed = Off Air:**

- In the example above, hours 0-6, 10-11, 13-19, 22 have no schedule
- The station will be off-air during those times (shows a pattern or nothing)

### Step 5: Copy Schedule Across Days Using Templates

Instead of repeating the same schedule, create templates and reference them:

```json
{
  "station_conf": {
    "network_name": "Classic TV",
    "channel_number": 4,
    "content_dir": "catalog/classic_content",
    "commercial_dir": "commercial",
    "bump_dir": "bump",
    "day_templates": {
      "weekday": {
        "7": {"tags": "cartoons"},
        "12": {"tags": "movies"},
        "20": {"tags": "sitcoms"}
      },
      "weekend": {
        "8": {"tags": "cartoons"},
        "20": {"tags": "movies"}
      }
    },
    "monday": "weekday",
    "tuesday": "weekday",
    "wednesday": "weekday",
    "thursday": "weekday",
    "friday": "weekday",
    "saturday": "weekend",
    "sunday": "weekend"
  }
}
```

*This is valid JSON. Note that hours not listed (e.g., 0-6, 22, etc.) are off-air.*

Now all weekdays use the "weekday" template, and weekends use the "weekend" template. **Note:** Days can only reference templates defined in `day_templates`, not other days directly.

## Common Configuration Options

Here's a reference table of the most common settings:

| Setting | What It Does | Example Values | Default |
|---------|--------------|----------------|---------|
| `network_name` | **Required.** Display name for your channel | `"HBO"`, `"Music TV"` | - |
| `channel_number` | **Required.** Channel number (must be unique) | `5`, `42`, `100` | - |
| `content_dir` | Where your videos are stored | `"catalog/my_videos"` | - |
| `commercial_dir` | Subfolder for commercials | `"commercial"` | - |
| `bump_dir` | Subfolder for station bumps/promos | `"bump"` | - |
| `schedule_increment` | Minutes for show blocks (0 = continuous) | `30`, `60`, `0` | `30` |
| `break_strategy` | Where commercials play | `"standard"`, `"end"`, `"center"` | `"standard"` |
| `commercial_free` | No commercials (bumps only) | `true`, `false` | `false` |
| `break_duration` | Seconds of commercials per break | `120` (2 minutes) | `120` |
| `hidden` | Hide channel from guide | `true`, `false` | `false` |
| `standby_image` | Image shown when station has technical issues | `"runtime/standby.png"` | - |
| `off_air_video` | Looping video when off-air | `"runtime/off_air.mp4"` | - |

**All settings except `network_name` and `channel_number` are optional.** Settings with defaults will be automatically filled in if not specified.

## Complete Example Configuration

Here's a full working example you can copy and customize:

```json
{
  "station_conf": {
    "network_name": "Retro TV",
    "channel_number": 8,
    "content_dir": "catalog/retro_content",
    "commercial_dir": "commercial",
    "bump_dir": "bump",
    "schedule_increment": 30,
    "commercial_free": false,
    "break_strategy": "standard",
    "standby_image": "runtime/standby.png",
    "off_air_video": "runtime/off_air_pattern.mp4",
    "day_templates": {
      "weekday": {
        "6": {"tags": "news"},
        "7": {"tags": "cartoons"},
        "8": {"tags": "cartoons"},
        "9": {"tags": "sitcoms"},
        "12": {"tags": "movies"},
        "18": {"tags": "news"},
        "19": {"tags": "sitcoms"},
        "20": {"tags": "sitcoms"},
        "21": {"tags": "drama"},
        "23": {"tags": "movies"}
      },
      "weekend": {
        "8": {"tags": "cartoons"},
        "12": {"tags": "movies"},
        "20": {"tags": "movies"},
        "23": {"tags": "movies"}
      }
    },
    "monday": "weekday",
    "tuesday": "weekday",
    "wednesday": "weekday",
    "thursday": "weekday",
    "friday": "weekday",
    "saturday": "weekend",
    "sunday": "weekend"
  }
}
```

*This is valid JSON. Hours not listed (e.g., 0-5, 10-11, 13-17, 22) are off-air.*

**Save this as:** `confs/retrotv.json`

## Intermediate Features

### Playing Multiple Shows Per Hour

Split an hour between two different tags:

```json
"18": {"tags": ["news", "sitcoms"]}
```

Since there are two items in the list, this will segment the hour into 30 minute blocks:

- **18:00-18:29** - video from `news` folder
- **18:30-18:59** - video from `sitcoms` folder

If the first show is longer than 30 minutes, the second tag is skipped.

Consider this example:

```json
"18": {"tags": ["showA", "showB", "showC"]}
```

Since there are three items in the list, this will segment the hour into three 20 minute blocks:

- **18:00-18:19** - video from `showA` folder
- **18:20-18:39** - video from `showB` folder
- **18:40-18:59** - video from `showC` folder

You'll want to make sure that the timings line up with your `schedule_increment` for precision programming.

### Clip Shows (Music Videos, Sketches, etc.)

For folders with many short clips, define them as clip shows:

```json
{
  "station_conf": {
    "content_dir": "catalog/music",
    "clip_shows": ["music_videos", "comedy_shorts"]
  }
}
```

*This is a partial config snippet showing only the clip_shows property.*

Then use them in your schedule:

```json
"14": {"tags": "music_videos"}
```

*This is a snippet showing a single time slot.*

The scheduler will fill the hour with random clips from that folder, inserting commercials between them.

**Custom Duration:**

Clip shows target 60 minute runtime by default. To set a custom duration, use the `duration` property.

```json
"clip_shows": [
  {"tags": "music_videos", "duration": 30},
  {"tags": "comedy_shorts", "duration": 90}
]
```

**Clip Bookends:**

If you want your clip show to start with a show opener or closer, use start_clip and end_clip options. If set, clip shows will start and end with exactly one randomly selected clip from the given tag. Useful for creating intro and outro sequences for clip shows.

```json
"clip_shows": [
  {"tags": "music_videos", "start_clip": "openers/music", "end_clip": "closers/music"},
  {"tags": "comedy_shorts", "start_clip": "openers/comedy", "end_clip": "closers/comedy"}
]
```

### Sign-Off Event

Play a special video (like a national anthem) then go off-air:

```json
{
  "sign_off_video": "runtime/signoff.mp4",
  "off_air_video": "runtime/off_air_pattern.mp4",
  "monday": {
    "3": {"event": "signoff"}
  }
}
```

At 3:00 AM, plays `signoff.mp4`, then loops `off_air_pattern.mp4` for the rest of the hour.

### Special Bumps for Specific Shows

Add custom bumps for branded programming blocks:

```json
"20": {
  "tags": "adult_swim",
  "start_bump": "caps/as_start.mp4",
  "end_bump": "caps/as_end.mp4"
}
```

*This is a snippet showing a single time slot.*

**Important:** Place these bumps in a separate folder (not your regular `bump_dir`) so they don't play during other shows.

## Testing Your Configuration

### 1. Check Your JSON is Valid

Before running FieldStation42, make sure your JSON is valid:

**Online validators:**

- https://jsonlint.com/
- Copy/paste your config file to check for errors

**Common error messages:**

- "Expected comma" - You're missing a comma between items
- "Unexpected token" - Usually a trailing comma or missing quote
- "Duplicate key" - You have the same hour listed twice (e.g., two `"18"` entries)

### 2. File Checklist

Before starting your station:

- [ ] Config file is in `confs/` directory
- [ ] Config file ends with `.json`
- [ ] Your `content_dir` folder exists and has video files
- [ ] Video files are in subfolders (the subfolder names become your tags)
- [ ] If not commercial-free: `commercial_dir` folder exists with videos
- [ ] `bump_dir` folder exists with videos

### 3. Folder Structure Example

```
FieldStation42/
    └── my_videos/              <- your content_dir
        ├── sitcoms/            <- tag: "sitcoms"
        ├── movies/             <- tag: "movies"
        ├── commercial/         <- commercials
        └── bump/               <- station promos
            ├── promo1.mp4
            └── promo2.mp4
```

## Troubleshooting

### "Failed to load station configuration"

- Your JSON has a syntax error
- Copy/paste into https://jsonlint.com/ to find the problem
- Common causes: trailing comma, missing quote, comment in file

### "Content directory not found"

- Check your `content_dir` path is correct
- Paths use forward slashes `/` even on Windows
- Path is relative to FieldStation42 root folder

### "No videos scheduled"

- Make sure your tag names match your subfolder names exactly (case-sensitive)
- Check that hour numbers are strings: `"7"` not `7`
- Verify your day names are lowercase: `"monday"` not `"Monday"`

### Station shows nothing but off-air pattern

- Check that you have scheduled hours for the current time
- Remember: hour `"0"` = midnight, `"13"` = 1 PM, `"20"` = 8 PM
- Hours not in your schedule = off-air

## Example Configurations

FieldStation42 includes several example configs in `confs/examples/`:

- **`indie42.json`** - Basic traditional network
- **`movie_channel.json`** - Movie-focused channel
- **`loop_channel.json`** - Simple looping channel
- **`guide.json`** - Program guide setup

Copy one of these to `confs/` and customize it for your needs!
