Title: Channel Recipes
Slug: docs/guides/channel-recipes
Summary: Copy-paste configuration recipes for common FieldStation42 channel types, from traditional networks to weather channels and pay-per-view.

FieldStation42 supports a lot of different channel types. This guide gives you ready-to-use recipes for the most common ones. Find the one that matches what you want, copy the config, and adjust it to fit your setup.

- [Recipe 1: Traditional Network Television](#recipe-1-traditional-network-television)
- [Recipe 2: Movie Channel / Public Broadcasting](#recipe-2-movie-channel--public-broadcasting)
- [Recipe 3: No Breaks](#recipe-3-no-breaks)
- [Recipe 4: Looping Channels](#recipe-4-looping-channels)
- [Recipe 5: The Guide Channel](#recipe-5-the-guide-channel)
- [Recipe 6: Streaming Channels (IPTV)](#recipe-6-streaming-channels-iptv)
- [Recipe 7: Web Channel](#recipe-7-web-channel)
- [Recipe 8: Radio Channel](#recipe-8-radio-music-channel-audio-with-now-playing-overlay)
- [Recipe 9: WeatherStar Channel](#recipe-9-weatherstar-channel)
- [Recipe 10: Pay-Per-View (PPV)](#recipe-10-pay-per-view-ppv)

---

## Recipe 1: Traditional Network Television

The classic TV experience: shows run on a schedule with commercials and bumps between them.

```json
{
  "network_type": "standard",
  "schedule_increment": 30,
  "break_strategy": "standard",
  "commercial_free": false
}
```

| Option | What it does |
|--------|-------------|
| `network_type` | `"standard"` (the default), `"loop"`, or `"guide"` |
| `schedule_increment` | How shows line up to time blocks (30 = half-hour slots) |
| `break_strategy` | `"standard"` = breaks throughout, `"end"` = breaks only between shows |
| `commercial_free` | `false` = commercials and bumps, `true` = bumps only |

These are the defaults, so if you don't set them explicitly you'll get this behavior automatically.

---

## Recipe 2: Movie Channel / Public Broadcasting

No commercials, just short bumps between features. Think HBO or PBS.

```json
{
  "network_type": "standard",
  "schedule_increment": 5,
  "break_strategy": "end",
  "commercial_free": true
}
```

- `schedule_increment: 5` keeps movies from getting padded with long breaks (a 92-minute movie fits into a 95-minute slot instead of 120)
- `break_strategy: "end"` puts all the bumps between shows, not during them
- `commercial_free: true` means only bumps play, no commercials

---

## Recipe 3: No Breaks

No commercials, no bumps, just content playing back-to-back. Good for a C-SPAN vibe or public access style.

```json
{
  "network_type": "standard",
  "schedule_increment": 0,
  "commercial_free": true
}
```

Setting `schedule_increment` to 0 means shows play continuously with no time-block alignment and no breaks at all.

---

## Recipe 4: Looping Channels

Plays everything in a folder in order, looping forever. Great for bulletin boards, background ambiance, or screensaver-style channels.

```json
{
  "station_conf": {
    "network_name": "MyLoop",
    "network_type": "loop",
    "channel_number": 2,
    "content_dir": "catalog/loop"
  }
}
```

Files in `content_dir` play in alphabetical order. When it reaches the end, it starts over. Loop channels ignore all break, commercial, and schedule settings.

There's an example config you can copy as a starting point:

```bash
cp confs/examples/loop.json confs/
```

---

## Recipe 5: The Guide Channel

A scrolling TV guide that shows what's on each channel, just like the cable guide channels from the 90s.

> The guide channel is still in development and may change.

```json
{
  "station_conf": {
    "network_name": "Guide",
    "network_type": "guide",
    "channel_number": 3,
    "play_sound": true,
    "sound_to_play": "runtime/path/file.mp3",
    "scroll_speed": 1.0
  }
}
```

For `sound_to_play`, you can point to a single MP3 file, a directory of MP3s (they'll shuffle and loop), or a list of files.

There's an example config to start from:

```bash
cp confs/examples/guide.json confs/
```

### Customizing the Appearance

The guide channel has a lot of visual options. Here are the defaults you can override:

```json
{
  "fullscreen": false,
  "width": 720,
  "height": 480,
  "window_decorations": false,
  "top_bg": "blue3",
  "bottom_bg": "blue4",
  "pad": 10,
  "messages": ["Hello FieldStation42\nGuide preview", "Cheers!\nFrom us to you!", "FieldStation42 Guide\nOn cable mode."],
  "message_rotation_rate": 10,
  "message_fg": "white",
  "message_font_family": "Arial",
  "message_font_size": 25,
  "images": [],
  "network_font_family": "Arial",
  "network_font_size": 12,
  "network_width_divisor": 6,
  "schedule_font_family": "Arial",
  "schedule_font_size": 12,
  "schedule_highlight_fg": "yellow",
  "schedule_fg": "white",
  "schedule_border_width": 4,
  "schedule_border_relief": "raised",
  "footer_messages": ["You are watching FieldStation42", "Now with cable mode."],
  "footer_height": 50,
  "schedule_row_count": 3,
  "top_section_ratio": 0.5,
  "target_row_height": 60,
  "min_row_height": 45,
  "max_row_height": 75,
  "normalize_title": true
}
```

Setting `fullscreen: true` ignores width and height. Setting `window_decorations: true` gives you a normal window (useful for debugging layout).

### Messages and Images

The upper section of the guide has two parts: images on the left and messages on the right. Both rotate on a timer set by `message_rotation_rate` (in seconds). If you use both images and messages, match the number of each so they stay in sync.

```json
{
  "station_conf": {
    "network_name": "Guide",
    "network_type": "guide",
    "channel_number": 3,
    "content_dir": "catalog/indie42_catalog/commercial/December",
    "messages": ["FieldStation42\nCable Entertainment", "Cheers!\nFrom us to you!", "FieldStation42 Guide\nOn cable mode."],
    "images": ["runtime/guide/image0.png", "runtime/guide/image1.png", "runtime/guide/image2.png"]
  }
}
```

Make sure all image paths exist, or the guide may fail to start.

---

## Recipe 6: Streaming Channels (IPTV)

Plays live video streams and web streams. You give it a list of streams with durations and titles, and it cycles through them in order.

```json
{"station_conf" : {
    "network_name" : "Streamy",
    "network_type" : "streaming",
    "channel_number": 10,
    "network_long_name": "My Streamy Channel",
    "streams": [
        {"url": "https://content.jwplatform.com/manifests/vM7nH0Kl.m3u8", "duration": 30, "title": "Tears of Steel"},
        {"url": "https://dn720306.ca.archive.org/0/items/publici_cast_cherwell_644527/publici_cast_cherwell_644527.mp4", "duration": 30, "title": "City Council"}
    ]
}}
```

---

## Recipe 7: Web Channel

Turns any web page into a TV channel using a built-in browser component. You point it at a URL and that page becomes your channel.

### Diagnostic Channel Example

FieldStation42 includes a built-in diagnostics page that shows system information like memory and CPU usage. Here's how to make it a channel:

```json
{"station_conf" : {
    "network_name" : "diagnostic",
    "network_type" : "web",
    "channel_number": 7,
    "web_url": "http://localhost:4242/static/diagnostics.html"
}}
```

You can preview what the channel will look like by visiting the `web_url` in your browser while the player is running.

### Dependencies for Web Channels

Web channels need some extra dependencies. Make sure you've run the installer to pick up PySide dependencies. On Raspberry Pi running Bookworm, you'll also need to run `install/web_reqs.sh` as sudo:

```bash
sudo bash install/web_reqs.sh
```

That script installs `libwebp7`, `minizip`, and `libtiff5-dev` along with the necessary symlinks.

On some Linux distributions (recent Ubuntu and Mint, for example), you may also need:

```bash
sudo apt-get install libxcb-cursor0
```

---

## Recipe 8: Radio Music Channel (Audio with Now Playing Overlay)

A radio station that shows track information during playback, similar to digital radio displays. It displays a "Now Playing" overlay in the lower left corner with the title, artist, and album. Album art is shown automatically by the player.

Under the hood, it's just a standard network with `media_filter` set to `"audio"` so it only picks up audio files:

```json
{
  "network_name": "Music42",
  "network_type": "standard",
  "media_filter": "audio",
  "content_dir": "catalog/music42/",
  "commercial_dir": "commercials",
  "bump_dir": "bumps"
}
```

Everything else works like a regular channel: commercials and bumps, tags for scheduling time slots, all of it. If you want to mix audio and video on the same channel, set `media_filter` to `"mixed"`.

The overlay pulls track info from ID3 tags and displays it over a semi-transparent gradient. For files without metadata, the filename is used as the title. The overlay scales automatically for different screen resolutions.

---

## Recipe 9: WeatherStar Channel

A weather channel using the [WeatherStar 4000+](https://github.com/netbymatt/ws4kp) project (or the [international version](https://github.com/mwood77/ws4kp-international)). This uses the web channel type to display the WeatherStar interface.

### Install WeatherStar with Docker

The easiest way to run WeatherStar is through Docker. If you use [Dockge](https://github.com/louislam/dockge) for managing containers, create a new stack with this config:

```yaml
version: '3.8'
services:
  weatherstar4000:
    image: ghcr.io/netbymatt/ws4kp
    container_name: ws4kp
    ports:
      - "9090:8080"
    environment:
      - WSQS_latLonQuery=Seattle WA USA
    restart: unless-stopped
```

The default port is `8080:8080`, but since 8080 is often already in use, this example maps it to 9090 instead.

### Configure the URL

After deploying, visit the WeatherStar page in your browser. Pick the display options you want using the checkboxes and settings, then click **Copy Permalink**. You'll get a long URL like:

```
http://<IP_ADDRESS>:9090/index.html?hazards-checkbox=true&current-weather-checkbox=true&...
```

Add these parameters to the end of the URL to make it work as a channel:

```
&kiosk=true&settings-mediaPlaying-boolean=true
```

### Create the Channel

```json
{"station_conf" : {
    "network_name" : "WeatherTV",
    "network_type" : "web",
    "channel_number": 14,
    "web_url": "http://<IP_ADDRESS>:9090/<LONG_URL_PARAMS>&kiosk=true&settings-mediaPlaying-boolean=true"
}}
```

Replace the URL with the permalink you copied, plus the kiosk and media parameters.

---

## Recipe 10: Pay-Per-View (PPV)

A video-on-demand interface where you browse movies with page up/down and press ENTER to play. It shows a slideshow with posters, titles, and descriptions. Optimized for CRT displays.

### Setup

Create a config file like `confs/ppv_movies.json`:

```json
{
  "station_conf": {
    "network_name": "Movie Library",
    "channel_number": 42,
    "network_type": "web",
    "content_dir": "catalog/ppv",
    "web_url": "http://<IP_ADDRESS_OR_HOST>:4242/static/ppv/ppv.html"
  }
}
```

Drop your movie files directly into `catalog/ppv/` (or whatever `content_dir` you set). Supported formats: `.mp4`, `.avi`, `.mkv`, `.mov`, `.wmv`, `.flv`, `.webm`, `.m4v`.

### Movie Metadata

The PPV channel looks for metadata in two places: local NFO files first, then the TMDB API as a fallback. You can manually curate some titles with NFO files and let TMDB handle the rest.

For better TMDB matching, include the year in your filename: `The Matrix (1999).mp4`.

### TMDB Setup (Optional)

Get a free API key at [themoviedb.org](https://www.themoviedb.org/signup) (Settings, then API, then Request an API Key).

Add it to `confs/main_config.json`:

```json
{
  "tmdb_api_key": "your_api_key_here"
}
```

Without a TMDB key, you'll need NFO files for each movie to get posters and descriptions.

For testing, you can access the PPV interface at `http://localhost:4242/static/ppv/ppv.html?channel=42`.

See the [PPV README](https://github.com/shane-mason/FieldStation42/tree/main/fs42/fs42_server/static/ppv) for more details.
