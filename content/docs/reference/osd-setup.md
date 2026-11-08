Title: On-Screen Display (OSD) Setup
Slug: docs/reference/osd-setup
Summary: Configure the OSD overlay that shows channel number and name when changing channels, including logo selection, temporal hints, tag-driven behavior, content rating bugs, the on-screen volume meter, and now-playing info for streaming radio.

FieldStation42 includes an On-Screen Display (OSD) that shows the channel number and name when you change channels. It runs as a separate process alongside `field_player`.

The OSD uses two config files:

- **`osd/osd.json`** -- global display settings: text style, logo defaults, position, and timing
- **`confs/<station>.json`** -- per-station logo settings inside each station's `station_conf`

---

## Running the OSD

1. Change to your FieldStation42 repo directory.
2. Activate your virtual environment.
3. Start the OSD:

```sh
DISPLAY=:0 python3 fs42/osd/main.py
```

The OSD updates automatically when you change channels.

**To run in the background** (useful during testing without tying up a terminal):

```sh
DISPLAY=:0 python3 fs42/osd/main.py 1>/dev/null 2>/dev/null & disown
```

**To launch on boot**, see the [autostart guide](/docs/guides/autostart/) to run it as a service.

---

## Text Display

The OSD text overlay is configured in `osd/osd.json`. The default shows channel number and name in the top-left corner in green:

```json
[
  {
    "halign": "LEFT",
    "valign": "TOP",
    "font_size": 40,
    "text_color": [0, 255, 0, 200],
    "format_text": "{channel_number} - {network_name}"
  }
]
```

| Field         | Type    | Description                                                                               |
|---------------|---------|-------------------------------------------------------------------------------------------|
| `halign`      | string  | Horizontal position: `"LEFT"`, `"RIGHT"`, or `"CENTER"`.                                  |
| `valign`      | string  | Vertical position: `"TOP"`, `"BOTTOM"`, or `"CENTER"`.                                    |
| `font_size`   | integer | Font size in points.                                                                      |
| `font`        | path    | Path to a ttf file, either system or downloaded. If not set, will use the system default. |
| `text_color`  | array   | RGBA color as `[R, G, B, A]`, each value 0-255. The fourth value is opacity.              |
| `format_text` | string  | Display template. Common variables: `{channel_number}`, `{network_name}`, `{title}`. See below for more. |
| `display_time`| float   | Seconds the text stays on screen after it changes. Default `2.0`.                         |
| `socket_file` | path    | Status file the text reads from. Default `runtime/play_status.socket`. Set it to `runtime/stream_metadata.socket` for [streaming radio text](#streaming-radio-metadata). |

When the playing video has an [NFO sidecar](/docs/reference/nfo-metadata/), its fields are available to `format_text` too, for example `{show_title}`, `{season}`, `{episode}`, `{year}`, and `{content_rating}`. `{title}` is always the schedule block's title, never the NFO title. Variables with no value come out empty. To see everything available for the current program, run `cat runtime/play_status.socket` from the FieldStation42 directory.

For the `font` argument, it expects a path to a true type font file (.ttf). This can be either a system font (already installed) 
or one you download from a site like https://fonts.google.com/

More examples are in `osd/examples/` in the repo.

---

## Logo Display

Logos are configured at two levels. `osd.json` sets global defaults; each station's config file enables and customizes logos for that station.

### Quick Start

1. Add a `LogoDisplay` block to `osd/osd.json` (see [Global Settings](#global-settings-osdjson) below).
2. Put a logo file (`.png`, `.jpg`, or `.gif`) into a directory, for example `catalog/NBC/logos/`.
3. Add these fields to that station's `station_conf` in `confs/<station>.json`:

```json
{
  "station_conf": {
    "logo_dir": "logos",
    "show_logo": true,
    "default_logo": "nbc_logo.png"
  }
}
```

When both `content_dir` and `logo_dir` are set, the logo path resolves to `<content_dir>/<logo_dir>`. If only `logo_dir` is set, it resolves from the project root.

### Global Settings (`osd.json`)

The `LogoDisplay` object lives in the same array as the text display config. Here is a complete `osd.json` with both:

```json
[
  {
    "halign": "LEFT",
    "valign": "TOP",
    "font_size": 40,
    "text_color": [0, 255, 0, 200],
    "format_text": "{channel_number} - {network_name}"
  },
  {
    "type": "LogoDisplay",
    "halign": "RIGHT",
    "valign": "BOTTOM",
    "width": 0.112,
    "height": 0.15,
    "x_margin": 0.05,
    "y_margin": 0.05,
    "display_time": 5.0,
    "always_show": false,
    "default_logo": "fs42/osd/FS42.png",
    "default_logo_alpha": 1.0,
    "default_show_logo": true,
    "default_logo_permanent": false
  }
]
```

| Field | Type | Description |
|---|---|---|
| `type` | string | **Required.** Must be `"LogoDisplay"`. |
| `halign` | string | Default horizontal alignment: `"LEFT"`, `"RIGHT"`, or `"CENTER"`. |
| `valign` | string | Default vertical alignment: `"TOP"`, `"BOTTOM"`, or `"CENTER"`. |
| `width` | float | Logo width as a fraction of half the screen width (e.g. `0.1` = 5% of screen). |
| `height` | float | Logo height as a fraction of half the screen height. |
| `x_margin` | float | Horizontal margin as a fraction of half the screen width. |
| `y_margin` | float | Vertical margin as a fraction of half the screen height. |
| `display_time` | float | Seconds to show the logo after a channel change or return to FEATURE content. |
| `always_show` | boolean | If `true`, ignores `display_time` and logo stays visible during all FEATURE content. |
| `default_logo` | string | Path to a global fallback logo file. |
| `default_logo_alpha` | float | Default logo opacity (e.g. `0.8` = 80% opacity). |
| `default_show_logo` | boolean | Whether to display the `default_logo` at all. |
| `default_logo_permanent` | boolean | If `true`, the default logo stays visible during FEATURE content regardless of `display_time`. |

### Per-Station Settings (`confs/<station>.json`)

Each station can define its own logos and override any global display parameter:

```json
{
  "station_conf": {
    "logo_dir": "logos",
    "show_logo": true,
    "default_logo": "station_static.png",
    "logo_permanent": false,
    "multi_logo": "off",

    "logo_display_time": 10.0,
    "logo_halign": "RIGHT",
    "logo_valign": "TOP",
    "logo_width": 0.1,
    "logo_height": 0.12,
    "logo_x_margin": 0.03,
    "logo_y_margin": 0.03,
    "logo_alpha": 0.75
  }
}
```

| Field | Type | Description |
|---|---|---|
| `logo_dir` | string | **Required** for station logos. Directory where this station's logos are stored. |
| `show_logo` | boolean | Whether to show a logo for this station. |
| `default_logo` | string | Filename of this station's default logo. |
| `logo_permanent` | boolean | If `true`, logo stays visible during all FEATURE content (ignores timing). |
| `multi_logo` | string | Logo selection mode. `"off"` or `"single"` uses `default_logo`; `"random"` or `"multi"` randomly picks from all `.png`, `.jpg`, `.gif` files in `logo_dir` each time a logo is shown. |
| `logo_display_time` | float | Overrides `display_time` from `osd.json`. |
| `logo_halign` | string | Overrides `halign` from `osd.json`. |
| `logo_valign` | string | Overrides `valign` from `osd.json`. |
| `logo_width` | float | Overrides `width` from `osd.json`. |
| `logo_height` | float | Overrides `height` from `osd.json`. |
| `logo_x_margin` | float | Overrides `x_margin` from `osd.json`. |
| `logo_y_margin` | float | Overrides `y_margin` from `osd.json`. |
| `logo_alpha` | float | Overrides `default_logo_alpha` from `osd.json`. |

---

## Automatic Logo Selection

Logos can change automatically based on tags, time of year, day of week, or day part -- without any changes to the station config. Create subdirectories under `logo_dir` and the OSD selects the right one based on context.

If none of these subdirectories exist, the OSD falls back to the flat `logo_dir` and behaves exactly as before.

### Selection Hierarchy

The OSD checks for logos in this priority order:

1. **Tag-based** -- `logo_dir/<tag>/` -- tag from `tags`/`tag` in the station's schedule entry
2. **Month + Weekday + DayPart** -- `logo_dir/<Month>/<Weekday>/<day_part>/` -- e.g. `logos/October/Friday/prime/`
3. **Month + Weekday** -- `logo_dir/<Month>/<Weekday>/` -- e.g. `logos/October/Friday/`
4. **Month + DayPart** -- `logo_dir/<Month>/<day_part>/` -- e.g. `logos/October/prime/`
5. **Month only** -- `logo_dir/<Month>/` or a date range like `logo_dir/<Month 1 - Month 31>/`
6. **Weekday + DayPart** -- `logo_dir/<Weekday>/<day_part>/` -- e.g. `logos/Friday/morning/`
7. **Weekday only** -- `logo_dir/<Weekday>/` -- e.g. `logos/Friday/`
8. **DayPart only** -- `logo_dir/<day_part>/` -- e.g. `logos/prime/`
9. **Base directory fallback** -- `logo_dir/`, using `default_logo` if set, otherwise a random file in that directory

When multiple logos exist in the chosen directory, one is selected randomly (or per the `multi_logo` setting).

### Tag-driven Logos

Tags come from the station's existing schedule -- no new fields required. If the current hour is scheduled with a tag, the OSD looks for a matching subdirectory.

Example schedule entry:

```json
"monday": {
  "7":  { "tags": "gameshow" },
  "8":  { "tags": "gameshow" },
  "9":  { "tags": "gameshow" },
  "10": { "tags": "gameshow" }
}
```

Matching logo directory:

```
catalog/GSN/logos/gameshow/
└── gsn_gameshow_logo.png
```

When multiple tags are provided as a list, the first tag is used as the folder name: `["gameshow", "talkshow"]` uses `logos/gameshow/`.

### Day Parts

Day parts are defined in `confs/main_config.json` and referenced by name as subdirectories under `logo_dir`. Spaces in day part names are replaced with underscores.

```json
{
  "day_parts": {
    "morning": {"start_hour": 6,  "end_hour": 10},
    "prime":   {"start_hour": 18, "end_hour": 23},
    "late":    {"start_hour": 23, "end_hour": 2}
  }
}
```

This creates three day parts matching directories `logos/morning/`, `logos/prime/`, and `logos/late/`. When `end_hour` is less than `start_hour` the period wraps around midnight.

If no `day_parts` are defined, that level of the hierarchy is skipped.

See the [main_config.json reference](/docs/reference/main-config/) for full day_parts documentation.

### Example Setups

#### Seasonal logo -- Nickelodeon in October prime time

```
catalog/NICK/logos/October/prime/nick_pumpkin.png
```

#### Tag-driven logo -- special bug during superbowl blocks

```
catalog/CBS/logos/superbowl/CBSfootball.png
```

With schedule entries tagged `"superbowl"`.

#### Friday primetime variant

```
catalog/ABC/logos/Friday/prime/TGIF.png
```

#### December-only logo (or date range)

```
catalog/NBC/logos/December/holiday_nbc_logo.png
catalog/NBC/logos/December 1 - December 31/holiday_nbc_logo.png
```

---

## Rating Display

The rating display shows a content rating bug, like `TV-14` or `PG-13`, in a corner of the screen when a program starts, the way broadcast TV does. Ratings come from your [NFO files](/docs/reference/nfo-metadata/), and you supply the badge images.

### Quick Start

1. Make sure your movies and episodes have NFO sidecars with a rating (see [Where Ratings Come From](#where-ratings-come-from)).
2. Rebuild the catalog so the ratings get read: `python3 station_42.py --rebuild_catalog`.
3. Put one image per rating in `runtime/ratings/`, named after the rating: `TV-PG.png`, `TV-14.png`, `PG-13.jpg`, `R.png`, and so on.
4. Add a `RatingDisplay` block to `osd/osd.json`:

```json
{
  "type": "RatingDisplay",
  "directory": "runtime/ratings",
  "halign": "LEFT",
  "valign": "TOP",
  "x_margin": 0.12,
  "y_margin": 0.22,
  "width": 0.08,
  "height": 0.10,
  "alpha": 1.0,
  "display_time": 12.0,
  "always_show": false
}
```

To check that a rating was picked up, run `cat runtime/play_status.socket` from the FieldStation42 directory while the program plays and look for `content_rating`.

### Where Ratings Come From

The rating is read from the NFO's `<certification>` tag, or from `<mpaa>` if there is no certification. It works for both `<movie>` and `<episodedetails>` NFOs.

An episode NFO without a rating takes it from the show's `tvshow.nfo`, looked for in the episode's own folder and up to two folders above it. That covers the usual Kodi layouts:

```
Lost/tvshow.nfo                        <- rating lives here
Lost/s01e01.mkv                        (episode in the show folder)
Lost/Season 1/s01e02.mkv               (episode in a season folder)
Lost/Season 1/Disc 1/s01e03.mkv        (episode in a disc folder)
```

The episode still needs its own NFO sidecar for this to happen. A rating in the episode's NFO always wins over the show's.

Ratings are cleaned up before they're matched to an image:

| NFO value | Image it looks for |
|---|---|
| `US:TV-14` | `TV-14` |
| `US:PG / US:Rated PG` | `PG` (the part before the slash) |
| `Rated PG-13` | `PG-13` |
| `TV-MA` | `TV-MA` |

The image filename is matched without regard to case, and `.png`, `.jpg`, and `.jpeg` all work. If there's no image for a rating, nothing is shown.

### When It Shows

The bug appears only during feature content, never during commercials or bumps. It shows for `display_time` seconds whenever the program, the channel, or the rating changes. Commercials normally have no rating, so the bug also comes back when a program returns from a break. Set `always_show` to keep it up for the whole program.

### Settings

| Field | Type | Description |
|---|---|---|
| `type` | string | **Required.** Must be `"RatingDisplay"`. |
| `directory` | path | Folder holding the rating images, relative to the FieldStation42 directory. Default `"runtime/ratings"`. |
| `halign` | string | Horizontal position: `"LEFT"`, `"RIGHT"`, or `"CENTER"`. Default `"RIGHT"`. |
| `valign` | string | Vertical position: `"TOP"`, `"BOTTOM"`, or `"CENTER"`. Default `"TOP"`. |
| `width` | float | Image width as a fraction of the screen width. Default `0.08`. |
| `height` | float | Image height as a fraction of the screen height. Default `0.10`. |
| `x_margin` | float | Horizontal margin as a fraction of half the screen width. Default `0.02`. |
| `y_margin` | float | Vertical margin as a fraction of half the screen height. Default `0.22`. |
| `alpha` | float | Opacity, from `0` (invisible) to `1` (solid). Default `1.0`. |
| `display_time` | float | Seconds to show the bug after a change. Default `12.0`. |
| `always_show` | boolean | If `true`, the bug stays up for the whole program. Default `false`. |

The image is stretched to exactly `width` by `height`, so size the box to match your images' shape.

---

## Volume Display

The on-screen volume meter appears for a few seconds whenever the volume is changed (via the remote or the API `/player/volume/up` and `/player/volume/down` endpoints). It draws a simple outlined bar with a filled center proportional to the current volume.

A volume meter is shown automatically even if you don't configure one. A default `VolumeDisplay` is added when none is present in `osd.json`, and it inherits its color from your first `StatusDisplay`. Add an explicit `VolumeDisplay` block only when you want to override the defaults (position, size, color, or timing).

### Global Settings (`osd.json`)

The `VolumeDisplay` object lives in the same array as the text and logo config:

```json
[
  {
    "type": "VolumeDisplay",
    "halign": "CENTER",
    "valign": "BOTTOM",
    "width": 0.4,
    "height": 0.04,
    "x_margin": 0.1,
    "y_margin": 0.25,
    "color": [0, 255, 0, 200],
    "display_time": 5.0,
    "border_thickness": 2.0,
    "padding": 0.008
  }
]
```

| Field | Type | Description |
|---|---|---|
| `type` | string | **Required.** Must be `"VolumeDisplay"`. |
| `halign` | string | Horizontal alignment: `"LEFT"`, `"RIGHT"`, or `"CENTER"`. Default `"CENTER"`. |
| `valign` | string | Vertical alignment: `"TOP"`, `"BOTTOM"`, or `"CENTER"`. Default `"BOTTOM"`. |
| `width` | float | Meter width as a fraction of half the screen width (e.g. `0.4` = 20% of screen). Default `0.4`. |
| `height` | float | Meter height as a fraction of half the screen height. Default `0.04`. |
| `x_margin` | float | Horizontal margin from the aligned edge, as a fraction of half the screen width. Ignored when `halign` is `"CENTER"`. Default `0.1`. |
| `y_margin` | float | Vertical margin from the aligned edge, as a fraction of half the screen height. Ignored when `valign` is `"CENTER"`. Default `0.25`. |
| `color` | array | RGBA color of the outline and fill as `[R, G, B, A]`, each value 0-255. Defaults to the color of the first `StatusDisplay`, or `[0, 255, 0, 200]` if there isn't one. |
| `display_time` | float | Seconds the meter stays on screen after a volume change. Default `5.0`. |
| `border_thickness` | float | Line width of the meter's outline, in pixels. Default `2.0`. |
| `padding` | float | Gap in NDC units between the outline and the filled center. Default `0.008`. |

### Positioning with `valign` and `y_margin`

`y_margin` is the distance from the edge named by `valign`. With `valign: "BOTTOM"` a larger `y_margin` pushes the meter **up**; with `valign: "TOP"` a larger `y_margin` pushes it **down**. When `valign` is `"CENTER"`, `y_margin` is ignored and the meter is centered vertically.

The examples below only change the vertical placement; all other fields keep their defaults.

**Near the top of the screen:**

```json
{
  "type": "VolumeDisplay",
  "valign": "TOP",
  "y_margin": 0.25
}
```

**Middle of the screen:**

```json
{
  "type": "VolumeDisplay",
  "valign": "CENTER"
}
```

**Default (near the bottom):**

```json
{
  "type": "VolumeDisplay",
  "valign": "BOTTOM",
  "y_margin": 0.25
}
```

> **Tip:** On a real CRT/TV, the outermost edges are lost to overscan. If the meter is clipped at the bottom, increase `y_margin` to lift it further into the title-safe area.
---

## Streaming Radio Metadata

On `streaming` channels, the OSD can show what's playing: artist, song, album, show, host, and album or show art. It polls each station for this information and publishes it for the OSD to display. This runs inside the OSD, so there is nothing extra to start, and it stays idle on every channel that isn't playing a stream.

Setup has three parts:

1. Tell FieldStation42 where to get each stream's metadata, in the station config.
2. Add text lines to `osd/osd.json` for the fields you want to show.
3. Optionally, add a `StreamArtworkDisplay` to `osd/osd.json` to show artwork.

### Step 1: Configure the Stream

Metadata is configured per stream, inside the `streams` list of a `streaming` station. There are two ways to get it.

#### From the stream itself (ICY)

Most Shoutcast and Icecast radio streams embed the current track in the audio stream, usually as a single `StreamTitle` like `Artist - Song`. Set `metadata_type` to `"icy"` and use a regular expression to split it into fields:

```json
{
  "station_conf": {
    "network_name": "WSTB",
    "network_type": "streaming",
    "channel_number": 30,
    "streams": [
      {
        "url": "https://streaming.live365.com/a68028",
        "title": "WSTB",
        "duration": 86399,
        "metadata_type": "icy",
        "metadata_config": {
          "interval": 15,
          "track": {
            "source": "StreamTitle",
            "pattern": "^\\s*(?P<artist>.+?)\\s*[-,]\\s*[\"“]?(?P<song>.+?)[\"”]?\\s*$"
          },
          "fields": {
            "artist": ["track.artist"],
            "song": ["track.song"],
            "tagline": ["StreamTitle"]
          }
        }
      }
    ]
  }
}
```

Here `track` is a parsing rule: it takes the raw `StreamTitle` and splits it with the regular expression. Each named group in the pattern becomes a field you can map, prefixed with the rule's name: `track.artist` and `track.song`. You can name a rule anything except the reserved setting names (`interval`, `timeout`, `max_blocks`, `params`, `headers`, `records_key`, `select`, `fields`), and you can have more than one. Backslashes in the pattern have to be doubled, because it's inside JSON.

`fields` then maps each output field to where its value comes from: a rule group like `track.artist`, or a raw ICY value like `StreamTitle`. The raw title is also always published as `stream_title`, which is handy while you work out a pattern.

#### From a JSON API

Some stations publish now-playing information through a web API. Set `metadata_url` to the endpoint, and describe where the fields are in its response:

```json
{
  "station_conf": {
    "network_name": "KEXP",
    "network_type": "streaming",
    "channel_number": 25,
    "streams": [
      {
        "url": "https://kexp.streamguys1.com/kexp160.aac",
        "title": "KEXP Independent Radio",
        "duration": 86399,
        "metadata_url": "https://api.kexp.org/v2/plays/",
        "metadata_config": {
          "interval": 15,
          "params": {"format": "json"},
          "records_key": "results",
          "select": {
            "mode": "first_matching",
            "require_any": ["artist", "song"]
          },
          "fields": {
            "artist": ["artist"],
            "song": ["song"],
            "album": ["album"],
            "artwork": ["image_uri"],
            "follow_up": {
              "url_path": ["show_uri"],
              "show": ["program_name"],
              "host": ["host_names"],
              "tagline": ["tagline"],
              "artwork": ["program_image_uri", "image_uri"]
            }
          }
        }
      }
    ]
  }
}
```

This reads the `results` list from the response, picks the first entry that has an artist or a song (KEXP's list also includes airbreaks, which have neither), and maps its fields. Field paths are relative to that record. They are dot-separated, so `album.name` reads `{"album": {"name": ...}}`, and a number picks from a list, so `artists.0` reads the first entry of an `artists` list.

`follow_up` makes a second request to fill in more fields. Here it takes the URL in the play's `show_uri` and reads the show's name, host, and tagline from that response. Follow-up fields only fill in values the first response didn't have, which is why `artwork` falls back to the show's image when the song has none.

#### Stream settings

These go on the stream entry, next to `url`, `title`, and `duration`:

| Field | Type | Description |
|---|---|---|
| `metadata_type` | string | `"icy"` to read metadata from the stream itself. Leave it out for a JSON API. |
| `metadata_url` | URL | The JSON API endpoint. Not used for ICY. |
| `metadata_config` | object | How to read and map the metadata (below). |

`metadata_config` settings:

| Field | Type | Applies to | Description |
|---|---|---|---|
| `interval` | number | both | Seconds between checks. Default `15`. |
| `fields` | object | both | Output field name to source path. A value can be one path or a list of paths tried in order. |
| `max_blocks` | integer | ICY | How much of the stream to read looking for metadata, in metadata blocks. Default `30`. |
| *(rule name)* | object | ICY | A parsing rule with `source` (the raw ICY value to parse, like `StreamTitle`) and `pattern` (a regular expression with named groups). |
| `timeout` | number | JSON | Seconds to wait for the API. Default `8`. |
| `params` | object | JSON | Query parameters added to `metadata_url`. |
| `headers` | object | JSON | Extra HTTP headers, for example an API key. |
| `records_key` | string | JSON | Path to the record, or list of records, in the response. Default `"$"`, the whole response. |
| `select` | object | JSON | Which record to use: `mode` is `"first"` (default), `"last"`, or `"first_matching"`, which takes the first record where any path in `require_any` has a value. |
| `fields.follow_up` | object | JSON | A second request: `url_path` is the path (or list of paths) to its URL in the selected record, and every other key maps a field from the follow-up response. |

A few details:

- A field that comes back as a list, such as several host names, is joined into one line with commas.
- `follow_up` URLs must use `https` and be on the same host as `metadata_url`. Others are ignored, with a warning in the log.
- The output field named `artwork` is special: it should hold an `https` link to an image (JPEG, PNG, WebP, or GIF, up to 10 MB). It is downloaded and passed to the [artwork display](#step-3-show-artwork). A link to anything else, like a station's homepage, is skipped with a warning.

To see what's being published while a stream plays, run `cat runtime/stream_metadata.socket` from the FieldStation42 directory.

### Step 2: Show the Text

Each line of text is a regular [text display](#text-display) in `osd/osd.json` that reads `runtime/stream_metadata.socket` instead of the usual status file:

```json
{
  "socket_file": "runtime/stream_metadata.socket",
  "halign": "LEFT",
  "valign": "BOTTOM",
  "font_size": 35,
  "x_margin": 0.2,
  "y_margin": 0.29,
  "text_color": [255, 255, 255, 200],
  "format_text": "{artist}",
  "display_time": 3600.0
}
```

`format_text` can use any field you defined under `fields`, plus `{network_name}`, `{channel_number}`, `{stream_url}`, and, for ICY streams, `{stream_title}`. The text stays up for `display_time` seconds after each change, so set it long to keep it on screen while the stream plays.

> **Tip:** Put one field per text line rather than combining them, as in `"{artist} - {song}"`. Fields with no value are blanked, but literal text in the template isn't, so a combined line leaves a stray ` - ` on screen when nothing is playing, including after you switch to a regular channel.

### Step 3: Show Artwork

Add a `StreamArtworkDisplay` block to `osd/osd.json` to show the `artwork` image:

```json
{
  "type": "StreamArtworkDisplay",
  "halign": "CENTER",
  "valign": "CENTER"
}
```

The image is scaled to fit inside the box without stretching, and centered in it.

| Field | Type | Description |
|---|---|---|
| `type` | string | **Required.** Must be `"StreamArtworkDisplay"`. |
| `halign` | string | Horizontal position: `"LEFT"`, `"RIGHT"`, or `"CENTER"`. Default `"CENTER"`. |
| `valign` | string | Vertical position: `"TOP"`, `"BOTTOM"`, or `"CENTER"`. Default `"CENTER"`. |
| `width` | float | Box width as a fraction of the screen width. Default `0.28125`, which with the default height makes a square on a 16:9 screen. |
| `height` | float | Box height as a fraction of the screen height. Default `0.5`. |
| `x_margin` | float | Horizontal margin as a fraction of half the screen width. Default `0.0`. |
| `y_margin` | float | Vertical margin as a fraction of half the screen height. Default `0.0`. |
| `alpha` | float | Opacity, from `0` (invisible) to `1` (solid). Default `1.0`. |

Each station can override these in its `station_conf`, or turn the artwork off:

```json
{
  "station_conf": {
    "show_streamart": true,
    "streamart_width": 0.75,
    "streamart_halign": "CENTER",
    "streamart_valign": "BOTTOM",
    "streamart_y_margin": 0.4,
    "streamart_alpha": 1
  }
}
```

| Field | Type | Description |
|---|---|---|
| `show_streamart` | boolean | Set to `false` to hide artwork on this station. Default `true`. |
| `streamart_width` | float | Overrides `width`. |
| `streamart_height` | float | Overrides `height`. |
| `streamart_halign` | string | Overrides `halign`. |
| `streamart_valign` | string | Overrides `valign`. |
| `streamart_x_margin` | float | Overrides `x_margin`. |
| `streamart_y_margin` | float | Overrides `y_margin`. |
| `streamart_alpha` | float | Overrides `alpha`. |
