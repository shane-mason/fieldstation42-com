Title: Channel Recipes
Slug: docs/guides/channel-recipes
Summary: Copy-paste configuration recipes for common FieldStation42 channel types, from traditional networks to weather channels and pay-per-view.

FieldStation42 is powerful and flexible, but that can make configuration a bit complex. This guide provides easy-to-follow "recipes" for common channel behaviors - just copy, tweak, and go!

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

## 📺 Recipe 1: Traditional Network Television

**Characteristics:**

- Rigid schedules (shows end on the hour/half-hour)
- Commercials and bumps between/within shows

**Config Example:**

```json
{
  "network_type": "standard",
  "schedule_increment": 30,
  "break_strategy": "standard",
  "commercial_free": false
}
```

| Option | Description |
|--------|-------------|
| `network_type` | "standard" (default), "loop", or "guide" |
| `schedule_increment` | Show end times (e.g., 30 = on the hour/half-hour) |
| `break_strategy` | `standard` = breaks throughout, `end` = breaks only at end |
| `commercial_free` | `false` = commercials + bumps, `true` = bumps only |

*If omitted, these defaults are used.*

---

## 🎬 Recipe 2: Movie Channel / Public Broadcasting

No commercials, just a few bumps between features (like HBO, PBS)

**Config Example:**

```json
{
  "network_type": "standard",
  "schedule_increment": 5,
  "break_strategy": "end",
  "commercial_free": true
}
```

- `schedule_increment: 5` = shows start at 5 minute increments
- `break_strategy: end` = all breaks at end (between shows, not during)
- `commercial_free: true` = only bumps

---

## 🚫 Recipe 3: No Breaks

No commercials or bumps (e.g., C-SPAN, public access)

**Config Example:**

```json
{
  "network_type": "standard",
  "schedule_increment": 0,
  "commercial_free": true
}
```

- `schedule_increment: 0` = no breaks at all

---

## 🔁 Recipe 4: Looping Channels

Channel loops over a set of content in order (like bulletin boards)

**Config Example:**

```json
{
  "network_type": "loop"
}
```

- Looping channels ignore other break/commercial settings

**Quick Start:**

```sh
cp confs/examples/loop.json confs/
```

**Minimal Loop Channel Config:**

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

- Files in `content_dir` are played in alpha-numeric order.

---

## 🗺️ Recipe 5: The Guide Channel

> **Note:** The guide channel is still in development and may change.

**Quick Start:**

```sh
cp confs/examples/guide.json confs/
```

**Minimal Guide Channel Config:**

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

- If `sound_to_play` is a directory, it will search the directory for mp3 files and make a random playlist and loop forever
- If `sound_to_play` is a list of files, it will play them in random order and loop forever

### Guide Channel Appearance Options

Override any of these in your config:

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

- `fullscreen: true` ignores width/height
- `window_decorations: true` = normal window (good for debugging)

#### Messages & Images

- Images: upper left; Messages: upper right; both rotate at `message_rotation_rate` seconds
- Match number of images/messages to keep them aligned

**Example with custom messages/images:**

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

> ⚠️ Make sure all paths exist, or the build/guide may fail to start.

---

## Recipe 6: Streaming Channels (IPTV)

This is a channel type that will let you play live video streams and web streams. Provided a list of streams, each with a duration and title, it will cycle through each in order.

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

## 🌐 Recipe 7: Web Channel

This is a channel type that uses a web browser component to display a web page - essentially turning any URL into a TV station. To show how this works, we'll make a diagnostics channel based on the FieldStation42 built-in `static/diagnostics.html` that displays system information like memory and cpu usage.

### 📊 Diagnostic Channel example

The following configuration will create a diagnostics channel:

```json
{"station_conf" : {
    "network_name" : "diagnostic",
    "network_type" : "web",
    "channel_number": 7,
    "web_url": "http://localhost:4242/static/diagnostics.html"
}}
```

To see what the channel will look like, you can visit the `web_url` in your web browser while the player is running.

NOTE: To use web channels, you will need to ensure that you have run the installer to pick up pyside dependencies. For Raspberry Pi, you will also need to run the script located at `install/web_reqs.sh` as sudo, which executes the following:

```
apt-get install libwebp7
ln -s /usr/lib/aarch64-linux-gnu/libwebp.so.7 /usr/lib/aarch64-linux-gnu/libwebp.so.6
apt-get install minizip
apt-get install libtiff5-dev
ln -s /usr/lib/aarch64-linux-gnu/libtiff.so.6 /usr/lib/aarch64-linux-gnu/libtiff.so.5
```

Note: Some Linux distributions may require additional dependencies. The following have been required on recent Ubuntu/Mint installs:

```
sudo apt-get install libxcb-cursor0
```

---

## 📻 Recipe 8: Radio Music Channel (Audio with Now Playing Overlay)

Create a radio station that displays track information during playback, similar to digital radio displays.

Features:

- Displays "Now Playing" overlay in lower left corner showing Title, Artist, and Album
- Album art automatically shown by MPV player
- Overlay automatically scales for different screen resolutions (CRT to 4K)

Configuration is just a standard network that has `media_filter` set to audio so that it only looks for audio files.

```json
{
  "network_name": "Music42",
  "network_type": "standard",
  "media_filter": "audio",
  "content_dir": "catalog/music42/",
  "commercial_dir": "commercials",
  "bump_dir": "bumps"
  ...
}
```

Otherwise, it works exactly like a standard station with commercials and bumps (station identifications) and tags to schedule time slots. If you want to mix audio and video, set `media_filter` to `mixed`. The overlay extracts metadata from ID3 tags and displays it with a semi-transparent gradient background. For tracks without metadata, the filename is used as the title.

---

## 🌤️ Recipe 9: WeatherStar Channel

To implement the weather channel, we will use `"network_type": "web"` configuration where we point the `web_url` to point to a WeatherStar installation. For this example, we will use [WeatherStar 4000+](https://github.com/netbymatt/ws4kp), but the [international version](https://github.com/mwood77/ws4kp-international) will work as well.

### Install WeatherStar Docker

The easiest way to manage docker components is using [dockge](https://github.com/louislam/dockge). After installing portainer, go to stacks, create a new stack and enter the following:

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

Note on ports: the default is `8080:8080`, but since 8080 is often already taken on busy server, I changed it to 9090 by setting port mapping to `9090:8080`

### Configuring the URL

After deploying, visit the site in your web browser. Select all the options you want in your display in the check boxes and configuration. Then select `Copy Permalink` which will give you something like this:

```
http://<IP_ADDRESS_HERE>:9090/index.html?hazards-checkbox=true&current-weather-checkbox=true&...
```

To make the URL open in kiosk mode and to make it start autoplaying music, you will need to add the following to the end of the URL:

```
&kiosk=true&settings-mediaPlaying-boolean=true
```

### Configuring the Weather Channel

Configure the channel to use a `network_type` of `web` and set the `web_url` parameter to be the URL to your WeatherStar4K installation.

```json
{"station_conf" : {
    "network_name" : "WeatherTV",
    "network_type" : "web",
    "channel_number": 14,
    "web_url": "http://<IP_ADDRESS>:9090/<LONG_URL_PARAMS>&kiosk=true&settings-mediaPlaying-boolean=true"
}}
```

---

## 💳 Recipe 10: Pay-Per-View (PPV)

Video-on-demand interface for FieldStation42. Browse movies with page up/down keys, hit ENTER to play. Shows a slideshow with posters, titles, and descriptions.

Metadata handling: checks for local NFO files first, falls back to TMDB API if missing. You can manually curate some content and automate the rest. Optimized for CRT displays.

### Setup

Create a station config file like `confs/ppv_movies.json`:

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

Drop your movie files directly in `catalog/ppv/` (or whatever `content_dir` you used). Supported: `.mp4`, `.avi`, `.mkv`, `.mov`, `.wmv`, `.flv`, `.webm`, `.m4v`

For better TMDB matching, put the year in the filename: `The Matrix (1999).mp4`

### TMDB Setup (optional)

Get a free API key at https://www.themoviedb.org/signup (Settings → API → Request an API Key)

Add it to `confs/main_config.json`:

```json
{
  "tmdb_api_key": "your_api_key_here"
}
```

Without TMDB, you'll need to create NFO files manually.

For testing, you can access at `http://localhost:4242/static/ppv/ppv.html?channel=42`

See the [PPV README](https://github.com/shane-mason/FieldStation42/tree/main/fs42/fs42_server/static/ppv) for more details.
