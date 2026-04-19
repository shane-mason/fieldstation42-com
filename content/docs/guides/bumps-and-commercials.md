Title: Bumps and Commercials
Slug: docs/guides/bumps-and-commercials
Summary: Everything you need to know about bumps and commercials, from basic setup to per-slot customization and auto-generated bumps.

Bumps and commercials are the short clips that make your channel feel like real TV. Bumps identify your station ("You're watching Retro TV!"), while commercials fill the gaps between shows. Together, they turn a playlist into something that feels like a broadcast.

## When You Need Them

Bumps and commercials are used by **standard networks** with time-block scheduling (the default channel type). You don't need them for:

- Continuous play channels (`schedule_increment: 0`)
- Loop channels
- Streaming or web channels

If you set `"commercial_free": true`, you only need bumps (no commercials). FieldStation42 will use bumps to fill the time between shows instead.

## Bumps

Bumps are short station promos: "You're watching Retro TV", "We'll be right back", "Coming up next." They play between shows and during commercial breaks.

**Tips for good bumps:**

- Keep them short, 2 to 60 seconds (shorter is better)
- Aim for at least 5 to 10 different bumps so they don't get repetitive
- Station IDs, "coming up next" messages, and interstitials all work great

## Commercials

Commercials are ad-style clips that pad shows to fit your time blocks. A 22-minute sitcom in a 30-minute block needs about 8 minutes of filler, and that's where commercials come in.

**Tips for good commercials:**

- Keep them between 15 and 60 seconds each
- Aim for at least 20 to 30 different commercials
- The more variety you have, the better the scheduler can fit content into time blocks

## Folder Setup

By default, FieldStation42 looks for folders named `commercial` and `bump` inside your channel's `content_dir`. You can change these names with the `"commercial_dir"` and `"bump_dir"` settings in your station config.

### Pre and Post Bump Subfolders

You can control exactly what plays at the start and end of every commercial break by adding `pre/` and `post/` subfolders inside your bump folder:

```
catalog/retro_tv/
└── bump/
    ├── pre/                    <- Always plays at START of commercial breaks
    │   ├── well_be_right_back.mp4
    │   └── after_these_messages.mp4
    ├── post/                   <- Always plays at END of commercial breaks
    │   ├── welcome_back.mp4
    │   └── and_now_back_to.mp4
    └── general_bump.mp4        <- Used if pre/post aren't specified
```

If `pre/` exists, the first clip in every break comes from there. If `post/` exists, the last clip does. If either folder is missing, regular bumps are used instead.

## Custom Bumps for Specific Shows

You can give individual time slots their own bumps using `start_bump` and `end_bump`. This is great for branded programming blocks:

```json
"20": {
  "tags": "adult_swim",
  "start_bump": "caps/as_start.mp4",
  "end_bump": "caps/as_end.mp4"
}
```

`start_bump` plays before the show starts (like a title card) and `end_bump` plays after it ends (like an outro). Paths are relative to your `content_dir`. If you point to a directory instead of a file, a random video from that directory will be selected.

Store these in a separate folder (like `caps/`) so they don't accidentally play during other programming.

### Wrapping a Multi-Hour Block

You can use start and end bumps to wrap an entire programming block. Just put `start_bump` on the first hour and `end_bump` on the last:

```json
"20": {
  "tags": "adult_swim",
  "start_bump": "caps/as_start.mp4"
},
"21": {"tags": "adult_swim"},
"22": {"tags": "adult_swim"},
"23": {
  "tags": "adult_swim",
  "end_bump": "caps/as_end.mp4"
}
```

This gives you an opening bump at 8 PM, four hours of Adult Swim content, and a closing bump at midnight.

## Custom Commercial and Bump Directories Per Slot

Different programming blocks can use different commercials and bumps. Kids shows can get kid-friendly ads, primetime can get premium spots:

```json
"saturday": {
  "8": {
    "tags": "saturday_cartoons",
    "commercial_dir": "kids_commercials",
    "bump_dir": "saturday_morning_bumps"
  }
}
```

These directory names are still relative to your `content_dir`, so your folder structure would look like:

```
catalog/my_content/
├── saturday_cartoons/
├── kids_commercials/
├── saturday_morning_bumps/
```

Some ideas for when this is useful:

- Kid-friendly commercials during children's programming
- Themed bumps for holiday or sports blocks
- Different ad content for different time slots or audiences

## Break Strategy Per Slot

You can override where commercials are placed for individual time slots, even if the rest of your channel uses a different strategy:

```json
"21": {
  "tags": "classic_movies",
  "break_strategy": "center"
}
```

The options are:

- `"standard"`: Commercials spread throughout the show (the default)
- `"end"`: All commercials at the end, between shows
- `"center"`: One big break in the middle (great for movies with an intermission feel)

## Automatic Bumps

If you don't want to create bump videos from scratch, FieldStation42 can generate them for you. Autobumps come in two styles: station identification ("You're watching Classic TV") and "up next" previews.

Add an `autobump` section to your station config:

```json
"autobump": {
  "title": "NBC TV",
  "subtitle": "Classic Television",
  "variation": "retro",
  "detail1": "Line 1 of details",
  "detail2": "Line 2 of details",
  "detail3": "Line 3 of details",
  "bg_music": "logo1.mp3",
  "strategy": "both"
}
```

**Strategy** controls when auto-generated bumps play:

- `"start"`: Station ID bump at the start of breaks, regular bumps at the end
- `"end"`: "Up next" bump at the end of breaks, regular bumps at the start
- `"both"`: Station ID at the start, "up next" at the end

**Variation** sets the visual theme: `"modern"`, `"retro"`, `"corporate"`, or `"terminal"`.

You can preview what your autobumps look like while the player is running by visiting:

```
http://localhost:4242/static/bump/bump.html?next_network=PublicDomainTV
```

### Filling Entire Breaks with Autobumps

By default, autobumps slot in at the start or end of breaks alongside regular bumps and commercials. With `fill_break`, autobumps can take over entire breaks instead -- showing a "next up" bumper with a countdown timer in the corner for the full break duration.

```json
"autobump": {
  "title": "NBC TV",
  "variation": "retro",
  "strategy": "end",
  "fill_break": 1.0
}
```

`fill_break` is a probability from `0.0` to `1.0`:

| Value | Behavior |
|-------|----------|
| `1.0` | Every break is filled with autobumps |
| `0.5` | 50% of breaks use autobumps; the rest use regular bumps and commercials |
| `0.0` (default) | Autobumps slot in normally, breaks are not filled |

This works well for channels where you want a clean "next up" presentation rather than a mix of bumps and spots. See the [Autobump reference](/docs/reference/autobump/) for the full list of configuration options.
