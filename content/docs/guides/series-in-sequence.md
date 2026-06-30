Title: Playing Series in Sequence
Slug: docs/guides/series-in-sequence
Summary: Play episodes in order using named sequences, with support for multiple independent progressions, start and end points, and multi-tag slots.

By default, FieldStation42 picks a random video from a folder each time a show is scheduled. Sequences change that: they play episodes in order, picking up where they left off each time. If you've got a series you want to watch from beginning to end, this is how you do it.

## Setting Up a Sequence

Add a `sequence` name to any time slot in your station config:

```json
"monday": {
  "20": {
    "tags": "star_trek",
    "sequence": "trek_sequential"
  }
}
```

Videos in the `star_trek` folder are sorted alphabetically, and each day at 8 PM the next episode plays. When it reaches the end, it loops back to the beginning. The position is saved between runs.

Name your files so they sort correctly:

```
star_trek/
├── S01E01 - The Cage.mp4
├── S01E02 - Where No Man Has Gone Before.mp4
├── S01E03 - The Corbomite Maneuver.mp4
...
```

Sequences also work with nested folders (like season subfolders). All videos are collected recursively and sorted by full path, so a structure like `star_trek/Season 1/S01E01.mp4` works fine.

The sequence name can be anything you want. It's just a label that FieldStation42 uses to track the position.

## Multiple Sequences of the Same Show

Use different sequence names to run independent progressions of the same show:

```json
"monday": {
  "17": {
    "tags": "star_trek",
    "sequence": "afternoon_trek"
  },
  "20": {
    "tags": "star_trek",
    "sequence": "primetime_trek"
  }
}
```

The afternoon and primetime showings track their positions separately, so they'll be on different episodes. This is great for simulating the way real TV networks would air a show in syndication at one time and new episodes at another.

Internally, the sequence key is `<TAG>-<SEQUENCE_NAME>`, so `star_trek-afternoon_trek` and `star_trek-primetime_trek` are tracked independently. Even if two different shows share the same sequence name, they won't interfere with each other:

```json
"21": {"tags": "friends", "sequence": "prime"},
"22": {"tags": "seinfeld", "sequence": "prime"}
```

Both `friends-prime` and `seinfeld-prime` are tracked separately.

## Sequence Start and End Points

You can play only part of a series by setting start and end percentages (0.0 to 1.0):

```json
"weekday_day": {
  "17": {
    "tags": "xfiles",
    "sequence": "daily_xfiles",
    "sequence_start": 0.0,
    "sequence_end": 0.75
  }
},
"friday_prime": {
  "21": {
    "tags": "xfiles",
    "sequence": "primetime_xfiles",
    "sequence_start": 0.75,
    "sequence_end": 1.0
  }
}
```

This plays the first 75% of X-Files episodes (the older seasons) during the weekday 5 PM slot, and the final 25% (newer seasons) on Friday at 9 PM. If you have 100 episodes, that's episodes 1 through 75 and 76 through 100.

This is great for playing classic seasons during the day and recent seasons at primetime, or splitting a long series across different time slots.

When a sequence reaches its end point, it loops back to its start point (not the beginning of the series).

### Random Start Position

Setting `sequence_start` to a negative number (such as `-1`) tells FieldStation42 to pick a random starting episode on the first run through the series. Once it reaches `sequence_end`, it loops back to episode one and continues normally from there.

```json
"20": {
  "tags": "star_trek",
  "sequence": "trek_nightly",
  "sequence_start": -1,
  "sequence_end": 1.0
}
```

This is useful when you're setting up a sequence for a long-running series and don't want every viewer to start from the pilot. The first night drops into a random episode mid-run; after that the series cycles from the beginning as usual.

## Scanning and Rebuilding Sequences

After you add or change sequences in your config, scan them:

```bash
python3 station_42.py --scan_sequences
```

To delete and rescan all sequences from scratch:

```bash
python3 station_42.py --rebuild_sequences
```

If you get errors during scanning, try rebuilding your catalog first with `--rebuild_catalog`.

## Random Show Rotation

The `random_show` strategy sits between fully random play and a fixed sequence. Instead of picking a random episode each time a slot comes up, it picks a random **show**, plays that show's episodes in order until they run out, then picks a different show at random and starts again.

To use it, add `"sequence_strategy": "random_show"` alongside a `sequence` name on any time slot:

```json
"20": {
  "tags": "sitcoms",
  "sequence": "evening_sitcoms",
  "sequence_strategy": "random_show"
}
```

### How the Folder Structure Works

The `random_show` strategy looks at the immediate subdirectories under your tag folder and treats each one as a show. Season folders inside a show directory are detected automatically and their episodes are collected in order.

```
catalog/classic/
└── sitcoms/
    ├── Cheers/
    │   ├── S01E01.mp4
    │   └── S01E02.mp4
    ├── Seinfeld/
    │   ├── Season 1/
    │   │   ├── S01E01.mp4
    │   │   └── S01E02.mp4
    │   └── Season 2/
    │       └── S02E01.mp4
    └── Friends/
        ├── S01E01.mp4
        └── S01E02.mp4
```

One show is chosen at random and played in episode order. When the last episode of that show airs, another show from the same folder is chosen at random and takes over.

### Using random_show with Tag Arrays

When you use a tag array to split an hour across multiple shows, each slot position needs its own independent tracking so they can be on different shows. Add a `sequence_id_array` with one name per tag to give each slot position a stable identity:

```json
"15": {
  "tags": ["sitcoms", "sitcoms"],
  "sequence": "the_block",
  "sequence_id_array": ["block_a", "block_b"],
  "sequence_strategy": "random_show",
  "schedule_increment": 30
}
```

Without `sequence_id_array`, both half-hours would share the same tracking and always be on the same show. With it, each slot position independently picks and advances through its own show.

Tags in the array don't have to be identical. This two-hour block runs any sitcom in the first hour and restricts the second hour to 1990s shows only, while both hours belong to the same named sequence:

```json
"15": {
  "tags": ["sitcoms", "sitcoms"],
  "sequence": "the_block",
  "sequence_id_array": ["block_a", "block_b"],
  "sequence_strategy": "random_show",
  "schedule_increment": 30
},
"16": {
  "tags": ["sitcoms/1990s", "sitcoms/1990s"],
  "sequence": "the_block",
  "sequence_id_array": ["block_c", "block_d"],
  "sequence_strategy": "random_show",
  "schedule_increment": 30
}
```

A resulting schedule might look like this:

```
15:00 - Friends (playing S01E03)
15:30 - Perfect Strangers (playing S02E01)
16:00 - Frasier (playing S01E07)
16:30 - Seinfeld (playing S03E02)
```

When Friends finishes its run, the `block_a` slot picks a new show from `sitcoms/` and starts from episode one.

### State and Rebuilding

The active show selection for each slot is stored in the database and survives restarts. Rebuilding sequences with `--rebuild_sequences` resets these selections along with the episode positions.

---

## Random Play (No Sequence)

If you don't add a `sequence` to a time slot, episodes play randomly. This doesn't affect any existing sequences for that show:

```json
"21": {"tags": "xfiles"}
```

Random slots and sequenced slots can coexist for the same show without interfering with each other.

## Things to Know

- Sequence names can be anything you want
- Each channel tracks its sequences independently
- Changing `sequence_start` or `sequence_end` resets the sequence position
- Sequences always loop when they reach their end point
- Catalog rebuilds do not affect sequence positions
- When a schedule is deleted, the sequence rewinds to the correct point
- Store only series episodes in the tag folder (keep other content elsewhere so it doesn't get mixed into the sequence)
- Subfolders (like season folders) are supported and sorted by full path

## Content Storage Tips

Keep your sequence folders clean. If you have a `star_trek` folder that feeds a sequence, every video in that folder (and its subfolders) becomes part of the sequence. Stray files like trailers or bonus content will get mixed in.

A good structure:

```
catalog/my_channel/
├── star_trek/
│   ├── Season 1/
│   │   ├── S01E01 - The Cage.mp4
│   │   ├── S01E02 - Where No Man Has Gone Before.mp4
│   ├── Season 2/
│   │   ├── S02E01 - Amok Time.mp4
```

The key is consistent naming with zero-padded numbers so files sort correctly. `Episode10.mp4` sorts before `Episode2.mp4` alphabetically, so use `Episode02.mp4` and `Episode10.mp4` instead.
