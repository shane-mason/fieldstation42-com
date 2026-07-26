Title: Now-Playing Video Overlays
Slug: docs/reference/video-overlays
Summary: On-screen now-playing overlays for video channels, drawing artist, title, album, and year from NFO sidecar files during playback.

When a video with overlay-eligible metadata starts playing, FieldStation42 spawns an overlay process that draws the metadata in the lower-left corner. By default that is white text with a black outline and no background box.

The metadata itself comes from [NFO sidecar files](/docs/reference/nfo-metadata/), which is where the file formats and placement rules live. This page covers what gets drawn, when it appears, and how to restyle it.

## What Gets an Overlay

Only two of the NFO types draw an overlay:

| NFO type | Draws an overlay |
|----------|------------------|
| Music video (`<musicvideo>`) | Yes |
| Plain text | Yes |
| Movie, episode, anything else | No |

The other types are still parsed and cached. Their metadata feeds the program guide and the [Pay-Per-View](/docs/reference/ppv/) listing instead.

Audio files get a separate now-playing overlay with its own look, driven by embedded tags rather than a sidecar. That one is covered in [Recipe 8 of the Channel Recipes guide](/docs/guides/channel-recipes/#recipe-8-radio-music-channel-audio-with-now-playing-overlay).

## Fields and Display Order

For a music video NFO, the overlay draws these fields in order:

| Field | Display Line | Notes |
|-------|-------------|-------|
| `artist` | 1 (large, bold) | |
| `title` | 2 | |
| `album` | 3 | |
| `year` | 4 | Falls back to the `<premiered>` year if absent |

Missing and empty fields are skipped rather than drawn blank, so a music video with no album listed closes the gap and draws the year on line 3.

For a plain text NFO the lines are drawn as written, up to 5 of them. Either way the first line gets the large bold treatment and the rest use the body style.

## Overlay Timing

| Condition | Behaviour |
|-----------|-----------|
| `play_duration > 20s` | Show for first 10s, hide, show again for last 10s |
| `play_duration ≤ 20s` | Show for full duration |
| PPV / looping playback | Show permanently |

The 10-second default is defined by `DEFAULT_SHOW_SECONDS` in `fs42/nfo_agent.py`.

When you tune into a channel partway through a clip, the timing works from the runtime that is actually left, not the full length of the file, so the closing appearance still lands at the end of the clip.

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

| Value | Lines Displayed |
|-------|-----------------|
| `"normal"` (default) | Every line available |
| `"minimal"` | The first two lines only |

For a music video, `"minimal"` means artist and title. For a plain text NFO it means the first two lines of the file.

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
| `overlay_title_size` | `30` | Font size in pixels for the first line |
| `overlay_body_size` | `20` | Font size in pixels for the remaining lines |
| `overlay_title_weight` | `"bold"` | `"bold"` or `"normal"` |
| `overlay_body_weight` | `"normal"` | `"bold"` or `"normal"` |

Sizes are given for a 1080p display and scale with screen height, so the overlay stays proportional on other resolutions.

### Fade Animation

`overlay_fade_duration_ms` sets the fade-in and fade-out duration in milliseconds when the overlay appears and disappears (default: `600`).

## Commercials and Channel Changes

The overlay is cleared when:

- A commercial or bump starts playing
- The channel is changed
- The next video starts, whether or not it has an NFO of its own. The old overlay always closes before a new one opens.

## See Also

- [NFO Sidecar Metadata](/docs/reference/nfo-metadata/) - file formats, placement, and the NFO types that do not draw an overlay
- [Pay-Per-View](/docs/reference/ppv/) - PPV also reads NFO files for movie metadata
- `fs42/nfo_agent.py` - NFO parsing and overlay rendering