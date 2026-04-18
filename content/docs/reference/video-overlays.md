Title: Music Video NFO Overlays
Slug: docs/reference/video-overlays
Summary: Now-playing overlays for music video channels, displaying artist, title, album, and year from NFO sidecar files during playback.

Supports both Kodi's `<musicvideo>` XML format and a simple plain text fallback.

When a video starts playing, FS42 looks for a `.nfo` file with the same base name in the same directory. If found, it spawns an overlay process showing the metadata in the lower-left corner -- white text with a black outline, no background box.

By default the overlay shows for the **first 10 seconds** and the **last 10 seconds** of the video. It stays hidden in between. For very short clips (under 20 seconds total) it shows for the full duration.

## NFO File Format

### Kodi XML (recommended)

FS42 reads the standard Kodi `<musicvideo>` format, compatible with Kodi, Jellyfin, and Emby. If you need a tool to generate them, [nfo-maker-thingy](https://github.com/shane-mason/nfo-maker-thingy) was written specifically for music video files.

```xml
<?xml version='1.0' encoding='utf-8'?>
<musicvideo>
  <title>No Rain</title>
  <artist>Blind Melon</artist>
  <album>Live at the Palace</album>
  <year>1993</year>
</musicvideo>
```

Fields used, in display order:

| Field | Display Line | Notes |
|-------|-------------|-------|
| `<artist>` | 1 (large, bold) | |
| `<title>` | 2 | |
| `<album>` | 3 | |
| `<year>` | 4 | Falls back to `<premiered>` year if absent |

Other fields (`<genre>`, `<musicbrainzartistid>`, etc.) are ignored.

### Plain Text Fallback

If no XML is detected, FS42 reads up to 5 lines of plain text, one field per line.

Example `Blind_Melon_No_Rain.nfo`:
```
Blind Melon
No Rain
Live at the Palace
1993
```

## File Placement

NFO files must live alongside the video with the same base name:

```
catalog/music/music_mix/Blind_Melon_No_Rain.mp4
catalog/music/music_mix/Blind_Melon_No_Rain.nfo
```

Videos without a matching NFO play normally with no overlay.

## Overlay Timing

| Condition | Behaviour |
|-----------|-----------|
| `play_duration > 20s` | Show for first 10s, hide, show again for last 10s |
| `play_duration ≤ 20s` | Show for full duration |
| PPV / looping playback | Show permanently |

The 10-second default is defined by `DEFAULT_SHOW_SECONDS` in `fs42/nfo_agent.py`.

## Configuration

All overlay appearance settings are controlled by an `overlay_conf` object in `main_config.json`. Every field is optional -- defaults are used for anything you omit.

```json
{
  "overlay_conf": {
    "overlay_type": "normal",
    "overlay_effect": "outline",
    "overlay_offset_px": 2,
    "overlay_font_path": null,
    "overlay_text_color": [255, 255, 255, 255],
    "overlay_shadow_color": [0, 0, 0, 255],
    "overlay_title_size": 30,
    "overlay_body_size": 20,
    "overlay_title_weight": "bold",
    "overlay_body_weight": "normal",
    "overlay_fade_duration_ms": 600
  }
}
```

### Display Type

`overlay_type` controls how much information is shown:

| Value | Fields Displayed |
|-------|-----------------|
| `"normal"` (default) | Artist, title, album, year |
| `"minimal"` | Artist and title only |

### Visual Effect

`overlay_effect` controls the text rendering style:

| Value | Description |
|-------|-------------|
| `"outline"` (default) | Text with a solid outline |
| `"drop_shadow"` | Graduated shadow built from layered offset copies |

`overlay_offset_px` sets the pixel distance for the outline or shadow (default: `2`).

### Font

`overlay_font_path` accepts an absolute path to a TrueType (`.ttf`) font file. If omitted or the file is not found, Arial is used as a fallback.

### Colors

Colors are RGBA arrays with values 0--255:

| Field | Default | Description |
|-------|---------|-------------|
| `overlay_text_color` | `[255, 255, 255, 255]` | Main text color |
| `overlay_shadow_color` | `[0, 0, 0, 255]` | Outline or shadow color |

### Text Size and Weight

| Field | Default | Description |
|-------|---------|-------------|
| `overlay_title_size` | `30` | Font size in pixels for the artist line |
| `overlay_body_size` | `20` | Font size in pixels for title, album, and year |
| `overlay_title_weight` | `"bold"` | `"bold"` or `"normal"` |
| `overlay_body_weight` | `"normal"` | `"bold"` or `"normal"` |

### Fade Animation

`overlay_fade_duration_ms` sets the fade-in and fade-out duration in milliseconds when the overlay appears and disappears (default: `600`).

## Commercials and Channel Changes

The overlay is cleared when:
- A commercial or bump starts playing
- The channel is changed
- The next video starts (the old overlay closes before the new one opens)

## See Also

- `fs42/nfo_agent.py` -- NFO parsing and overlay logic
- [Pay-Per-View](/docs/reference/ppv/) -- PPV also reads NFO files for movie metadata