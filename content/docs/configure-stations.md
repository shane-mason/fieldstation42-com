Title: Configure Stations
Slug: docs/configure-stations
Summary: Create a JSON config file that tells FieldStation42 what to play, when, and on which channel.

This is where you bring your channel to life. You'll create a small configuration file that tells FieldStation42 your channel's name, where to find your videos, and what to play at each hour of the day.

**Note:** This guide covers **standard TV networks** -- scheduled programming with commercials and bumps, like a real broadcast channel. FieldStation42 also supports looping playlists, web channels, streaming, and more. Check out [Channel Recipes](/docs/guides/channel-recipes/) for other channel types.

## A Quick Word About JSON

Station configs are written in JSON, a simple text format for storing settings. It's a little fussy about formatting, so here are the things that trip people up most:

- Everything is wrapped in `{ }` curly braces
- Setting names and text values need **double quotes**: `"network_name"` (single quotes won't work)
- Commas go between items, but **not** after the last one
- No comments allowed -- you can't use `//` or `#`

If something isn't working, paste your config into [jsonlint.com](https://jsonlint.com/) -- it will point you right to the problem. The most common errors are a missing comma, an extra comma at the end of a list, or a missing quote.

## Create Your First Channel

Create a new file in the `confs/` folder -- something like `confs/mychanel.json`. Here's the simplest working config for a standard channel:

```json
{
  "station_conf": {
    "network_name": "Classic TV",
    "channel_number": 4,
    "content_dir": "catalog/classic_content",
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

Here's what each piece means:

- **`network_name`** -- The name viewers see. Call it whatever you want.
- **`channel_number`** -- The channel number to tune to. Each channel needs a unique number.
- **`content_dir`** -- Points to the channel folder you created in the previous step.
- **`commercial_dir`** and **`bump_dir`** -- The subfolder names for your commercials and station promos (inside your `content_dir`).
- **Monday through Sunday** -- Every standard channel needs all seven days defined. We'll fill these in next. Empty `{}` means off-air for that day.

Everything else has sensible defaults -- 30-minute time blocks, commercials spread throughout shows, and so on. You can customize all of that later.

## Build Your Schedule

Now for the fun part -- deciding what plays and when. Each day gets a list of hours, and each hour gets a tag that matches one of your content folders.

Hours use 24-hour format and need to be in quotes:

- `"7"` = 7:00 AM
- `"12"` = noon
- `"20"` = 8:00 PM

Any hour you don't list is off-air. Here's a channel with Monday and Tuesday filled in:

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

The `"tags"` value is the name of a subfolder in your content directory. If you have `catalog/classic_content/sitcoms/`, you'd use `"tags": "sitcoms"` -- and FieldStation42 picks a random video from that folder each time.

### Reuse Schedules with Day Templates

Typing out the same schedule seven times gets old fast. Templates let you define a schedule once and reuse it:

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

Define your templates in `day_templates`, then assign each day to a template by name. You can create as many templates as you need -- a different one for each day of the week if you want.

## More Scheduling Options

### Multiple Shows Per Hour

You can split an hour between different tags by passing a list:

```json
"18": {"tags": ["news", "sitcoms"]}
```

This splits the 6 PM hour into two 30-minute blocks -- news first, then a sitcom. Three tags would split it into three 20-minute blocks, and so on. If a show runs longer than its block, the next tag gets skipped.

### Clip Shows

If you have folders full of short clips (music videos, comedy sketches, etc.), you can tell FieldStation42 to string them together to fill an hour:

```json
{
  "station_conf": {
    "content_dir": "catalog/music",
    "clip_shows": ["music_videos", "comedy_shorts"]
  }
}
```

Then schedule them like any other tag: `"14": {"tags": "music_videos"}`. The scheduler fills the time with random clips, inserting commercials between them.

You can customize the target duration (default is 60 minutes) and add opener/closer clips:

```json
"clip_shows": [
  {"tags": "music_videos", "duration": 30},
  {"tags": "comedy_shorts", "start_clip": "openers/comedy", "end_clip": "closers/comedy"}
]
```

### Sign-Off Event

For that authentic broadcast feel, you can schedule a sign-off -- a special video (like a national anthem) followed by an off-air pattern:

```json
{
  "sign_off_video": "runtime/signoff.mp4",
  "off_air_video": "runtime/off_air_pattern.mp4",
  "monday": {
    "3": {"event": "signoff"}
  }
}
```

At 3:00 AM, the sign-off video plays, then the off-air pattern loops until the next scheduled hour.

## Example Configurations

Here's a full working config you can copy and customize. Save it as something like `confs/retrotv.json`:

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

FieldStation42 also ships with several example configs in `confs/examples/` that you can copy to `confs/` and customize:

- **`indie42.json`** -- Basic traditional network
- **`movie_channel.json`** -- Movie-focused channel
- **`loop_channel.json`** -- Simple looping channel
- **`guide.json`** -- Program guide setup

## Configuration Reference

Here's a quick reference for all common settings. You've already seen most of these -- this table is handy when you're tweaking your config later.

| Setting | What It Does | Example Values | Default |
|---------|--------------|----------------|---------|
| `network_name` | **Required.** Display name for your channel | `"HBO"`, `"Music TV"` | -- |
| `channel_number` | **Required.** Channel number (must be unique) | `5`, `42`, `100` | -- |
| `content_dir` | Where your videos are stored | `"catalog/my_videos"` | -- |
| `schedule_increment` | Minutes for show blocks (0 = continuous) | `30`, `60`, `0` | `30` |
| `break_strategy` | Where commercials play: `"standard"` (spread throughout), `"end"` (all at end), `"center"` (one mid-break) | `"standard"` | `"standard"` |
| `commercial_free` | No commercials (bumps only) | `true`, `false` | `false` |
| `commercial_dir` | Subfolder for commercials (inside `content_dir`) | `"commercial"` | -- |
| `bump_dir` | Subfolder for station promos (inside `content_dir`) | `"bump"` | -- |
| `break_duration` | Seconds of commercials per break | `120` | `120` |
| `hidden` | Hide channel from the guide | `true`, `false` | `false` |
| `standby_image` | Image shown during technical issues | `"runtime/standby.png"` | -- |
| `off_air_video` | Looping video when off-air | `"runtime/off_air.mp4"` | -- |

Only `network_name` and `channel_number` are required. Everything else has sensible defaults.

## File Checklist

Before moving on:

- [ ] Config file saved in `confs/` and ends with `.json`
- [ ] `content_dir` folder exists and has video files in subfolders
- [ ] `commercial` folder has short ad clips (if using scheduled time blocks)
- [ ] `bump` folder has station ID clips (if using scheduled time blocks)
