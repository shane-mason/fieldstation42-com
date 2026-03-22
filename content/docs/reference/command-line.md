Title: Command Line Guide
Slug: docs/reference/command-line
Summary: Full reference for station_42.py - managing catalogs, building schedules, sequences, chapter markers, and more.

The `station_42.py` script is your all-in-one tool for managing catalogs, channels, and schedules. Run it with no arguments for a simple text-based UI, or use the command line for full power and automation.

---

## (Re)Building Catalogs

To build or rebuild catalogs from your station configurations:

```sh
python3 station_42.py --rebuild_catalog
```

To rebuild specific stations (by network name):

```sh
python3 station_42.py --rebuild_catalog WarpTV MovieTV ClassiclTV
```

> **Note:** Rebuilding a catalog deletes its schedules - you'll need to add time to the schedule after rebuilding.

### Other Helpful Catalog Arguments

- `-p` or `--printcat` - Print the catalog for the specified station
- `-c` or `--check_catalogs` - Run basic checks on the specified stations

---

## Building Schedules

There are three options for adding time to schedules:

| Short | Long | Description |
|-------|------|-------------|
| `-d` | `--add_day` | Adds a day to schedule(s) |
| `-w` | `--add_week` | Adds a week to schedule(s) |
| `-m` | `--add_month` | Adds a month to schedule(s) |

Update all schedules:

```sh
python3 station_42.py --add_day
```

Update specific stations:

```sh
python3 station_42.py --add_week WarpTV
```

---

## Deleting Schedules

Delete all schedules:

```sh
python3 station_42.py --delete_schedules
```

Delete schedules for specific stations:

```sh
python3 station_42.py --delete_schedules WarpTV MovieTV ClassiclTV
```

---

## Scan Sequences

When you add new sequences, scan for them:

```sh
python3 station_42.py --scan_sequences
```

Or scan specific stations:

```sh
python3 station_42.py --scan_sequences WarpTV Indie42
```

---

## Rebuilding Sequences

Restart all sequences:

```sh
python3 station_42.py --rebuild_sequences
```

Or rebuild for specific stations:

```sh
python3 station_42.py --rebuild_sequences WarpTV
```

---

## Chapter Markers for Commercial Breaks

FieldStation42 can use **chapter markers** embedded in your video files to find the best spots for commercials. When available, chapter markers are used to intelligently place commercial breaks at scene transitions instead of at arbitrary times or at the end of content.

### Scanning for Chapter Markers

To scan for chapter markers during catalog rebuild:

```bash
python3 station_42.py --rebuild_catalog --scan_chapters
```

Or scan chapters for specific stations:

```bash
python3 station_42.py --rebuild_catalog WarpTV MovieTV --scan_chapters
```

Tip: Chapter markers are often present in content archived from DVD and can be edited by many software programs.

### How Chapter Markers Work

- Chapter markers are detected using ffprobe and stored in `runtime/fs42_fluid.db`
- During schedule building, the system checks for cached chapter markers
- If chapter markers exist, commercials are inserted at those break points
- If no chapter markers exist, commercials are placed at the end of content
- Chapter data persists between runs for fast schedule building

### Clearing Cached Chapter Markers

To rescan chapter markers for all videos, clear the cache:

```bash
python3 station_42.py --reset_chapters
```

Then rebuild catalogs with `--scan_chapters` to regenerate the cache.

---

## Other Helpful Scheduling Arguments

- `-u` or `--print_schedule` - Print the schedule for the specified station for the current day
- `-s` or `--schedule` - Print a summary of schedule extents for each station
