Title: Configure Stations
Slug: docs/configure-stations
Summary: Create JSON configuration files that define your TV station's name, channels, content directories, and weekly schedules.

This guide will help you create your first TV station configuration.

**Note:** This guide focuses on **standard TV networks** (scheduled programming with commercials/bumps). FieldStation42 also supports other network types like web channels, program guides, looping playlists, and external streams. See the [Channel Recipe guide](/docs/guides/channel-recipes/) and the [detailed technical specification](https://github.com/shane-mason/FieldStation42/blob/main/docs/STATION_CONFIG_README.md#video-effects) for complete documentation on all network types.

## JSON Basics

Station configs are JSON files. Here are the key rules:

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

### Validating Your JSON

Before running FieldStation42, make sure your JSON is valid. Copy/paste your config into an online validator like https://jsonlint.com/ to check for errors.

**Common error messages:**

- "Expected comma" - You're missing a comma between items
- "Unexpected token" - Usually a trailing comma or missing quote
- "Duplicate key" - You have the same hour listed twice (e.g., two `"18"` entries)

## Station Configuration

Every station config lives in the `confs/` directory and defines your channel's identity, content source, and scheduling behavior. Here's a complete configuration with all common options:

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

**Important:** All standard networks must define all 7 days (monday through sunday). Use empty `{}` for days with no programming.

### Configuration Options

| Setting | What It Does | Example Values | Default |
|---------|--------------|----------------|---------|
| `network_name` | **Required.** Display name for your channel | `"HBO"`, `"Music TV"` | - |
| `channel_number` | **Required.** Channel number (must be unique) | `5`, `42`, `100` | - |
| `content_dir` | Where your videos are stored | `"catalog/my_videos"` | - |
| `schedule_increment` | Minutes for show blocks (0 = continuous) | `30`, `60`, `0` | `30` |
| `break_strategy` | Where commercials play | `"standard"`, `"end"`, `"center"` | `"standard"` |
| `commercial_free` | No commercials (bumps only) | `true`, `false` | `false` |
| `commercial_dir` | Subfolder for commercials | `"commercial"` | - |
| `bump_dir` | Subfolder for station bumps/promos | `"bump"` | - |
| `break_duration` | Seconds of commercials per break | `120` (2 minutes) | `120` |
| `hidden` | Hide channel from guide | `true`, `false` | `false` |
| `standby_image` | Image shown when station has technical issues | `"runtime/standby.png"` | - |
| `off_air_video` | Looping video when off-air | `"runtime/off_air.mp4"` | - |

**All settings except `network_name` and `channel_number` are optional.** Settings with defaults will be automatically filled in if not specified.

**Break strategy options:**

- `"standard"` - spread throughout the show (like real TV)
- `"end"` - all at the end of the show
- `"center"` - one break in the middle

**Note on `commercial_dir` and `bump_dir`:** These are subfolders inside your `content_dir`.

## Scheduling Slots

Define what plays each hour by adding time slots to your day definitions. Hours are numbered 0-23 (midnight to 11 PM):

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

### Day Templates

Instead of repeating the same schedule for each day, create templates and reference them:

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

Now all weekdays use the "weekday" template, and weekends use the "weekend" template. **Note:** Days can only reference templates defined in `day_templates`, not other days directly.

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

*Hours not listed (e.g., 0-5, 10-11, 13-17, 22) are off-air.*

**Save this as:** `confs/retrotv.json`

## Example Configurations

FieldStation42 includes several example configs in `confs/examples/`:

- **`indie42.json`** - Basic traditional network
- **`movie_channel.json`** - Movie-focused channel
- **`loop_channel.json`** - Simple looping channel
- **`guide.json`** - Program guide setup

Copy one of these to `confs/` and customize it for your needs!

## File Checklist

Before starting your station:

- [ ] Config file is in `confs/` directory
- [ ] Config file ends with `.json`
- [ ] Your `content_dir` folder exists and has video files
- [ ] Video files are in subfolders (the subfolder names become your tags)
- [ ] If not commercial-free: `commercial_dir` folder exists with videos
- [ ] `bump_dir` folder exists with videos
