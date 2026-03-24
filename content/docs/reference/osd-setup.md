Title: On-Screen Display (OSD) Setup
Slug: docs/reference/osd-setup
Summary: Configure the OSD overlay that shows channel number and name when changing channels, including logo selection, temporal hints, and tag-driven behavior.

FieldStation42 includes an On-Screen Display (OSD) feature to show the channel number and name when you change channels. (Future versions will integrate this with `field_player` startup, but for now, it runs separately.)

---

## Running the OSD Service

1. Change to your FieldStation42 repo directory.
2. Activate your virtual environment.
3. Start the OSD service:

```sh
DISPLAY=:0 python3 fs42/osd/main.py
```

The OSD will update automatically when you change channels.

---

## Configuration

The OSD is highly configurable - location, font, color, and layout can all be customized. The default config is at `osd/osd.json`:

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

> More examples: see `osd/examples` in the repo.

---

## Startup Configuration

To launch the OSD on boot, see the [autostart guide](/docs/guides/autostart/) to start it as a service.

For testing, you can use the following command to start the OSD server.

```sh
DISPLAY=:0 python3 fs42/osd/main.py 1>/dev/null 2>/dev/null & disown
```

---

## Advanced Configurations

Logos can now change automatically based on:

- the **tag** of the scheduled content (e.g. `gameshow`, `awardshow`)
- the **current month** (e.g. `October`, `December 1-31`)
- the **current weekday** (e.g. `Friday`)
- the **current day_part** (e.g. `morning`, `prime`) as defined in `confs/main_config.json`

If none of these hints are configured, logo behavior remains exactly as before: it falls back to the standard logo directory and selection logic.

---

### Behavior and Hierarchy

Logo selection happens in a well-defined priority order. Given a station with `content_dir` and `logo_dir` configured, the OSD now checks for logos in this hierarchy:

1. **Tag-based folder** - `logo_dir/<tag>/` - Tag is derived from the station's schedule (`tags` / `tag` in the day/hour entry).
2. **Most specific temporal match (Month > Weekday > DayPart)** - `logo_dir/<Month>/<Weekday>/<day_part>/` - Example: `logos/October/Friday/prime/`
3. **Month + Weekday** - `logo_dir/<Month>/<Weekday>/` - Example: `logos/October/Friday/`
4. **Month + DayPart** - `logo_dir/<Month>/<day_part>/` - Example: `logos/October/prime/`
5. **Month-only** - `logo_dir/<Month>/` or a range like `logo_dir/<Month 1 - Month 31>/` - Example: `logos/October/` or `logos/October 1 - October 31/`
6. **Weekday + DayPart (no month)** - `logo_dir/<Weekday>/<day_part>/` - Example: `logos/Friday/morning/`
7. **Weekday-only (no month)** - `logo_dir/<Weekday>/` - Example: `logos/Friday/`
8. **DayPart-only (no month)** - `logo_dir/<day_part>/` - Example: `logos/prime/`
9. **Base directory fallback** - If none of the above exist: `logo_dir/`, respecting `default_logo` if set, otherwise a random logo in that directory.

If multiple logos exist in a chosen directory, they are selected randomly (or according to the existing `multi_logo` behavior, unchanged).

---

### Tag-driven Logos

Tags are derived from the station's existing schedule configuration. No new fields required.

Example schedule:

```json
"monday": {
  "7":  { "tags": "gameshow" },
  "8":  { "tags": "gameshow" },
  "9":  { "tags": "gameshow" },
  "10": { "tags": "gameshow" }
}
```

Example logo directory:

```
catalog/GSN/logos/gameshow/
└── gsn_gameshow_logo.png
```

The OSD will use `logos/gameshow/` whenever the current day/hour matches a `"gameshow"` slot.

If multiple tags are provided as a list, the **first** tag is used as the folder name (e.g. `["gameshow", "talkshow"]` -> `logos/gameshow/`).

---

### Day Parts and `main_config.json`

Day parts are read from `confs/main_config.json`.

- `start_hour` / `end_hour` are integers (0-23).
- Wrap-around windows like `21 -> 2` are supported.

The **day_part name** is used as a directory under `logo_dir`, with spaces replaced by underscores:

- `prime` -> `logos/prime/`
- `late` -> `logos/late/`

**Nested usage examples:**

- December prime-time logo: `logos/December/prime/somelogo.png`
- October Friday morning logo: `logos/October/Friday/morning/mylogo.gif`

If no `day_parts` are defined, that level of the hierarchy is simply skipped.

---

### Backwards Compatibility

If a station only defines `logo_dir` and `show_logo`, and uses a flat logo folder, behavior is unchanged.

`content_dir` and `logo_dir` semantics are preserved:

- If both are present: `base_dir = Path(content_dir) / logo_dir`
- If only `logo_dir`: `base_dir = project_root / logo_dir`

`multi_logo`, `default_logo`, `logo_width`, `logo_height`, `logo_x_margin`, `logo_y_margin`, `logo_alpha`, and all other FS42 logo config fields behave exactly as before.

If no matching temporal or tag directories exist, the original base-directory logic is used.

**In other words: if users do nothing, logos behave exactly as they do today.**

---

### Example Setups

Some concrete examples:

#### 1. Seasonal Nickelodeon logo in October prime time

```
catalog/NICK/logos/October/prime/nick_pumpkin.png
```

#### 2. Special "superbowl" bug for all superbowl blocks

```
catalog/CBS/logos/superbowl/CBSfootball.png
```

With schedule entries tagged `"superbowl"`.

#### 3. Friday primetime variant

```
catalog/ABC/logos/Friday/prime/TGIF.png
```

#### 4. December-only logo

```
catalog/NBC/logos/December/holiday_nbc_logo.png
```

Or date-range:

```
catalog/NBC/logos/December 1 - December 31/holiday_nbc_logo.png
```
