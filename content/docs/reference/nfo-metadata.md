Title: NFO Sidecar Metadata
Slug: docs/reference/nfo-metadata
Summary: Enrich your library with Kodi-format .nfo sidecar files, feeding titles, artists, plots, and episode numbers to the program guide, Pay-Per-View, and now-playing overlays.

FieldStation42 reads Kodi-format `.nfo` sidecar files to add real metadata to your media. Every Kodi NFO type is parsed at catalog build time and cached, then handed to whatever needs it: the program guide, the Pay-Per-View listing, and the [now-playing overlay](/docs/reference/video-overlays/).

If all you want is an overlay on a music video channel, the [NFO File Format](#nfo-file-format) section below is all you need. The rest of this page covers the other NFO types and where their metadata ends up.

## Supported Types

| NFO type | Root tag | What the metadata feeds |
|----------|----------|-------------------------|
| Music video | `<musicvideo>` | Guide, PPV, now-playing overlay |
| Plain text | non-XML | Guide, PPV, now-playing overlay |
| Movie | `<movie>` | Guide, PPV |
| Episode | `<episodedetails>` | Guide, PPV |
| Any other Kodi tag | any | Guide, PPV (title plus common fields) |

Only music video and plain text NFOs draw an on-screen overlay during playback. The other types are there to describe your library, not to appear over it.

Those four cover everything worth writing. FieldStation42 reads per-file sidecars only, so Kodi's series-level `tvshow.nfo` is never picked up and there is no reason to create one. If your library already has `<tvshow>` files scattered through it, they do no harm.

Where "Guide" appears above, it means the grid-mode custom guide themes (90s and 00s), which show a program description under each title. That is on by default and controlled by the `use_meta` URL parameter. See [Program Descriptions](/docs/guides/guide-channels/#program-descriptions) in the Guide Channels guide.

Audio files carry the same metadata, read from their embedded ID3, Vorbis, or MP4 tags instead of a sidecar, so a music `.mp3` and a music video `.mp4` end up with the same shape. Audio has its own now-playing overlay, covered in [Recipe 8 of the Channel Recipes guide](/docs/guides/channel-recipes/#recipe-8-radio-music-channel-audio-with-now-playing-overlay).

## File Placement

An NFO file lives alongside its media with the same base name:

```
catalog/music/music_mix/Blind_Melon_No_Rain.mp4
catalog/music/music_mix/Blind_Melon_No_Rain.nfo

catalog/sitcomx/friends/Friends-S03E20.mp4
catalog/sitcomx/friends/Friends-S03E20.nfo
```

Media without a matching NFO plays normally with no metadata.

## NFO File Format

### Kodi XML (recommended)

FieldStation42 reads the standard Kodi NFO formats, the same ones Kodi, Jellyfin, and Emby use, so there is a good chance your existing tools already generate them. The root tag selects the type.

If you would rather not write these by hand, [nfo-maker-thingy](https://github.com/shane-mason/nfo-maker-thingy) generates them from your filenames. See [Generating NFO Files](#generating-nfo-files) below.

**Music video**, using `<musicvideo>`:

```xml
<?xml version='1.0' encoding='utf-8'?>
<musicvideo>
  <title>No Rain</title>
  <artist>Blind Melon</artist>
  <album>Live at the Palace</album>
  <year>1993</year>
</musicvideo>
```

**Movie**, using `<movie>`:

```xml
<?xml version='1.0' encoding='utf-8'?>
<movie>
  <title>The Thing</title>
  <year>1982</year>
  <plot>A research team in Antarctica is hunted by a shape-shifting alien.</plot>
  <genre>Horror</genre>
</movie>
```

**Episode**, using `<episodedetails>`:

```xml
<?xml version='1.0' encoding='utf-8'?>
<episodedetails>
  <title>The One with the Dollhouse</title>
  <showtitle>Friends</showtitle>
  <season>3</season>
  <episode>20</episode>
  <aired>1997-04-03</aired>
  <plot>Monica inherits a valuable dollhouse from her aunt.</plot>
</episodedetails>
```

Any other Kodi root tag is accepted too, including `<tvshow>`. FieldStation42 keeps its `<title>` plus whichever of `<year>`, `<plot>`, and `<genre>` are present. A `<title>` is required for these: without one, the file is ignored. This is tolerance for libraries that already carry other Kodi files, not a format to reach for.

Where a type has a `<year>` but the file only carries `<premiered>`, the year is taken from the premiere date.

### Plain Text Fallback

If the file is not XML, FieldStation42 reads up to 5 non-empty lines, one field per line. This is handy for a quick overlay without authoring XML.

Example `Blind_Melon_No_Rain.nfo`:

```
Blind Melon
No Rain
Live at the Palace
1993
```

Line order matters, because consumers map plain text lines by position. See [How Fields Are Displayed](#how-fields-are-displayed) below.

## Generating NFO Files

[nfo-maker-thingy](https://github.com/shane-mason/nfo-maker-thingy) writes Kodi NFO files for you by parsing your filenames and looking the results up online. It handles music videos, movies, and TV episodes.

It needs Python 3.10 or newer and the `requests` library:

```bash
pip install requests
```

Music video lookups use MusicBrainz and need no credentials. Movie and episode lookups use TMDB, so put your own v3 key in the `TMDB_API_KEY` constant at the top of `nfothingy.py` before running those. Free keys come from [themoviedb.org/settings/api](https://www.themoviedb.org/settings/api). It is the same kind of key [Pay-Per-View](/docs/reference/ppv/) uses, though PPV reads it from `main_config.json` rather than from a constant in a script.

The media type is the first argument, followed by the files to process:

```bash
python nfothingy.py musicvideo *.mp4
python nfothingy.py movie *.mkv
python nfothingy.py episode *.mkv
```

Each file gets an `.nfo` beside it with the same base name, which is exactly the layout described above. Existing NFO files are left alone unless you pass `--overwrite`.

### Filename Patterns

Because the lookup starts from the filename, the tool needs to recognize what it is looking at:

| Media type | Expected filename | Example |
|------------|-------------------|---------|
| `musicvideo` | `Artist - Title.ext` | `Blind Melon - No Rain.mp4` |
| `movie` | `Title (Year).ext` | `The Thing (1982).mkv` |
| `episode` | `Show - S01E02 - Title.ext` | `Friends - S03E20 - The One with the Dollhouse.mkv` |

**Music videos** split on the first hyphen that has whitespace on at least one side, so `Artist - Title` and `Artist -Title` both work but `Artist-Title` does not. Common noise like `[Official Video]` is stripped before the lookup. A filename with no such hyphen still produces an NFO, but with the whole name as the title and no artist, which leaves the overlay without its first line.

**Movies** prefer a year in parentheses or square brackets. Failing that, the first standalone four-digit year token is used, skipping the leading token so that titles like `2001 A Space Odyssey` are not mistaken for a year. Either way the year has to be in the 1900s or 2000s.

**Episodes** accept `S01E02` with spaces, dots, underscores, or hyphens as separators, which covers both `Show - S01E02 - Title.ext` and `Show.S01E02.ext`. The `Show 1x02.ext` form works as well.

The tool writes `<musicvideo>`, `<movie>`, and `<episodedetails>` files, which covers every XML type FieldStation42 has a use for.

## How It Works

Sidecars are parsed at **catalog build time**, normalized into a JSON object, and stored in the `meta` column of the `file_meta` table, the same place audio tags are cached. At runtime the metadata is read from the database rather than from disk, so playback and the guide never re-parse a file.

Because sidecars are tiny and get hand-edited far more often than the media beside them, they are re-read on **every catalog build** and refreshed if they changed. There is no need to rebuild from scratch after editing one.

> **Note:** Pay-Per-View is the exception. PPV content is not cataloged, so PPV parses NFO sidecars directly from disk each time it builds its listing. Edits there show up on the next page load with no catalog build at all.

## How Fields Are Displayed

Consumers that present three lines of text, Pay-Per-View most notably, ask for a title, an info line, and a description. Each NFO type maps onto those three slots differently:

| NFO type | Title | Info line | Description |
|----------|-------|-----------|-------------|
| Music video | `title` | `artist` | `album` |
| Episode | `title` | `show_title` | `plot` |
| Movie, and any other type | `title` | `year` | `plot` |
| Plain text | line 1 | line 2 | line 3 |

The now-playing overlay uses a longer mapping of its own, described in [Now-Playing Video Overlays](/docs/reference/video-overlays/).

## Normalized Metadata Shape

Parsed NFO and audio tag metadata is stored as a JSON object with a `type` discriminator. The fields are a superset: irrelevant ones are absent, as are any that were empty in the source file.

```json
{ "type": "music",     "title": "...", "artist": "...", "album": "...", "year": "...", "genre": "..." }
{ "type": "movie",     "title": "...", "year": "...", "plot": "...", "genre": "..." }
{ "type": "episode",   "title": "...", "show_title": "...", "season": 4, "episode": 5, "aired": "...", "plot": "..." }
{ "type": "plaintext", "title": "...", "lines": ["...", "..."] }
```

This is also what comes back from the server API. Schedule blocks built around a single feature carry the object as a `meta` field. Blocks holding multiple pieces of content, such as clip shows and loops, and off-air blocks have no single feature to describe, so they carry no `meta` and consumers fall back to the block title. The [Server API reference](/docs/reference/web-console/) has the endpoints.

> **Note:** Catalogs built before metadata was normalized stored the year under `date` and carried no `type` at all. Those rows still work, since `date` is mapped to `year` on read and the type is assumed to be `music`. Everything newly written uses `year`.

## See Also

- [Now-Playing Video Overlays](/docs/reference/video-overlays/) - the on-screen display for music video and plain text NFOs
- [Pay-Per-View](/docs/reference/ppv/) - the video-on-demand listing, which reads NFO files straight from disk
- [Server API](/docs/reference/web-console/) - schedule endpoints that return cached metadata
- `fs42/nfo_agent.py` - NFO parsing and field mapping
- `fs42/metadata_io.py` - runtime accessor that reads cached metadata from the database
- `fs42/media_processor.py` - build-time extraction, embedded tags for audio and NFO for video