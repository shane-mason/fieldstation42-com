Title: Autobump System
Slug: docs/reference/autobump
Summary: Create customizable station identification bumps with multiple visual styles, background music, and programming information.

Create customizable station identification bumps with multiple visual styles, background music, and programming information.

## Quick Start

```
bump.html?title=MTV&subtitle=Music Television&variation=retro&bg_music=logo2.mp3
```

## Parameters

| Parameter | Description | Examples |
|-----------|-------------|----------|
| `title` | **Required.** Station name | `"MTV"`, `"CNN"`, `"ESPN"` |
| `subtitle` | Station tagline | `"Music Television"`, `"Breaking News"` |
| `detail1`, `detail2`, `detail3` | Custom info lines | `"Channel 4"`, `"Broadcasting 24/7"` |
| `variation` | Visual style | `"modern"`, `"retro"`, `"corporate"`, `"terminal"` |
| `bg_color` | Background color (hex) | `"#ff0000"`, `"#1a1a2e"` |
| `fg_color` | Text color (hex) | `"#ffffff"`, `"#000000"` |
| `bg` | Background image URL | `"background.jpg"` |
| `css` | Custom CSS file | `"custom.css"` |
| `next_network` | Show upcoming programs | `"nbc"`, `"mtv"`, `"espn"` |
| `duration` | Auto-hide after seconds | `7`, `10`, `0` (never) |
| `bg_music` | Background music file or URL | `"logo2.mp3"`, `"https://..."` |
| `bg_video` | WebM video file or URL as background | `"intro.webm"`, `"https://..."` |
| `bg_video_audio` | Play the video's native audio (default: `true`; auto-muted when `bg_music` is set) | `true`, `false` |
| `bg_video_loop_count` | Number of times the video loops; bump duration is calculated from this (default: `1`) | `1`, `3` |
| `text_position` | Position of the text block | `"left"`, `"right"`, `"center"`, `"top-left"`, `"top-right"`, `"top-center"`, `"bottom-left"`, `"bottom-right"`, `"bottom-center"` |
| `text_delay` | Seconds before text appears (default: `0`) | `2`, `3.5` |
| `text_fade_in` | Seconds for text to fade in (default: `0`) | `0.5`, `1` |
| `text_fade_out` | Seconds for text to fade out (default: `0`) | `0.5`, `1` |
| `text_hide_before_end` | Seconds before end to hide text (default: `0`) | `1`, `2` |
| `strategy` | Autobump position | `start`, `end`, `both` |

## Visual Styles

### Modern (Default)

Clean, futuristic design with blue gradients

```
bump.html?title=TECH TV&subtitle=Future Forward&variation=modern
```

### Retro

80s synthwave aesthetic with neon colors

```
bump.html?title=MTV&subtitle=Music Television&variation=retro
```

### Corporate

Professional look with light colors

```
bump.html?title=CNN&subtitle=Breaking News&variation=corporate
```

### Terminal

Monospace terminal theme with green text

```
bump.html?title=HACKER TV&subtitle=System Online&variation=terminal
```

## Background Music

FieldStation42 includes 7 background music tracks: `logo0.mp3` through `logo6.mp3`

```
# Using built-in music
bump.html?title=MTV&variation=retro&bg_music=logo2.mp3

# Using custom music
bump.html?title=RADIO FM&bg_music=https://example.com/theme.mp3
```

**Features:**

- Auto-loops during display
- 30% volume by default
- Fades out when bump ends
- Supports MP3, WAV, OGG, M4A

**Add your own music:**

1. Copy files to `fs42/fs42_server/static/bump/music/`
2. Use filename in `bg_music` parameter

## Video Background

Use a WebM video file as the bump background instead of a static color or image. Store video files in `fs42/fs42_server/static/bump/video/` and reference by filename, or use a full URL.

```
bump.html?title=MTV&variation=retro&bg_video=intro.webm&bg_video_loop_count=2
```

**Audio behavior:**

- By default, the video's native audio plays (`bg_video_audio=true`)
- If `bg_music` is also set, the video audio mutes automatically and the music track plays instead
- Set `bg_video_audio=false` to silence the video regardless

**Duration calculation:**

The bump duration is computed as: video duration x `bg_video_loop_count`. If the video duration cannot be detected, a 7-second fallback is used.

```
# Loop 3 times, then end
bump.html?title=ESPN&bg_video=highlight_reel.webm&bg_video_loop_count=3
```

Video backgrounds also work during fill-break autobumps. Text timing controls (see below) are applied per loop so overlays stay synchronized.

**Add your own videos:**

1. Copy WebM files to `fs42/fs42_server/static/bump/video/`
2. Use the filename in the `bg_video` parameter

## Text Layout and Timing

These controls apply to both video and non-video autobumps.

### Text Position

Place the text block anywhere on screen using `text_position`:

| Value | Location |
|-------|----------|
| `center` (default) | Horizontally and vertically centered |
| `left` | Left edge, vertically centered |
| `right` | Right edge, vertically centered |
| `top-left` | Top-left corner |
| `top-center` | Top edge, horizontally centered |
| `top-right` | Top-right corner |
| `bottom-left` | Bottom-left corner |
| `bottom-center` | Bottom edge, horizontally centered |
| `bottom-right` | Bottom-right corner |

For video autobumps, position is relative to the rendered video frame, not the full viewport.

```
bump.html?title=HBO&subtitle=Premium Entertainment&text_position=bottom-left
```

### Text Timing

Control when text appears and disappears:

```
# Text fades in after 2 seconds, fades out over 1 second, hides 2 seconds before end
bump.html?title=NBC&bg_video=nbc_bumper.webm&text_delay=2&text_fade_in=0.5&text_fade_out=1&text_hide_before_end=2
```

For video autobumps, `text_delay` and `text_hide_before_end` reset each loop so timing stays consistent across multiple plays.

## Programming Integration

Show upcoming shows from FieldStation42 schedule:

```
bump.html?title=HBO&subtitle=Premium Entertainment&next_network=hbo
```

Displays next 3 upcoming shows as: `"2:30 PM - Show Title"`

## Filling Breaks with Autobumps

By default, commercial breaks are filled with whatever bumps and commercials are in the rotation. The `fill_break` option lets autobumps take over entire breaks instead, showing a "next up" bumper with a countdown timer in the corner.

Set `fill_break` in your autobump configuration:

```json
{
    "title": "FIELDSTATION42",
    "variation": "retro",
    "fill_break": 1.0
}
```

`fill_break` is a probability from `0.0` to `1.0`:

| Value | Behavior |
|-------|----------|
| `1.0` | Every break is filled with autobumps |
| `0.5` | 50% of breaks use autobumps; the rest use regular bumps and commercials |
| `0.0` (default) | Autobumps are placed normally, breaks are not filled |

When a break is filled, FS42 generates an autobump that runs for the full break duration. The bump displays the "next up" program information and a countdown timer in the corner so viewers know when the show resumes.

## Examples

### Basic Station ID

```
bump.html?title=NBC&subtitle=Must See TV&detail1=Channel 4&detail2=nbctv.com
```

### With Music and Programming

```
bump.html?title=MTV&subtitle=Music Television&variation=retro&next_network=mtv&bg_music=logo2.mp3&duration=7
```

### Custom Colors

```
bump.html?title=ESPN&subtitle=The Worldwide Leader&bg_color=%23ff0000&fg_color=%23ffffff
```

## JavaScript API

For dynamic control:

```javascript
configureBump({
    title: 'DISCOVERY',
    subtitle: 'Explore Your World',
    variation: 'modern',
    bgMusic: 'logo1.mp3',
    duration: 5
});
```

## JSON Configuration

For autobump system integration:

```json
{
    "title": "FIELDSTATION42",
    "subtitle": "Your Retro Broadcast Experience",
    "variation": "retro",
    "bg_music": "logo2.mp3",
    "duration": 7,
    "next_network": "fieldstation42"
}
```

With video background and text timing:

```json
{
    "title": "HBO",
    "subtitle": "It's Not TV",
    "bg_video": "hbo_bumper.webm",
    "bg_video_loop_count": 2,
    "text_position": "bottom-left",
    "text_delay": 1.5,
    "text_fade_in": 0.5,
    "text_fade_out": 0.5,
    "text_hide_before_end": 1
}
```

## Color Encoding for URLs

Hex colors must be URL-encoded:

- `#ff0000` (red) becomes `%23ff0000`
- `#ffffff` (white) becomes `%23ffffff`

## Advanced Customization

### Custom CSS Override

Create a CSS file and reference it:

```
bump.html?title=LOCAL NEWS&css=custom-styles.css
```

**Common customizations:**

```css
/* Change fonts */
.bump-container .main-title {
    font-family: 'Impact', sans-serif !important;
    font-size: 8rem !important;
}

/* Custom colors and effects */
.bump-container {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
}

.bump-container .content-area {
    border: 5px solid #ffffff;
    border-radius: 20px;
    backdrop-filter: blur(10px);
}
```

### Available CSS Selectors

- `.bump-container` - Main container
- `.main-title` - Station name
- `.subtitle` - Tagline
- `.detail-line` - Info lines
- `.variation-retro`, `.variation-modern`, etc. - Style-specific

## Troubleshooting

**No programming data showing?**

- Verify network name exists in FieldStation42
- Check FieldStation42 server is running

**Music not playing?**

- Check file exists in `music/` folder
- Verify file format (MP3, WAV, OGG, M4A)
- Browser autoplay policies may require user interaction

**Colors not working?**

- URL-encode hex values: `#ff0000` -> `%23ff0000`
- Use `!important` in custom CSS if needed

## File Structure

```
fs42/fs42_server/static/bump/
├── music/    # Background music files (MP3, WAV, OGG, M4A)
└── video/    # Background video files (WebM)
```
