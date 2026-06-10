Title: On-Screen Display (OSD) Setup
Slug: docs/reference/osd-setup
Summary: Configure the OSD overlay that shows channel number and name when changing channels, including logo selection, temporal hints, and tag-driven behavior.

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

| Field | Type | Description |
|---|---|---|
| `halign` | string | Horizontal position: `"LEFT"`, `"RIGHT"`, or `"CENTER"`. |
| `valign` | string | Vertical position: `"TOP"`, `"BOTTOM"`, or `"CENTER"`. |
| `font_size` | integer | Font size in points. |
| `text_color` | array | RGBA color as `[R, G, B, A]`, each value 0-255. The fourth value is opacity. |
| `format_text` | string | Display template. Available variables: `{channel_number}`, `{network_name}`. |

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