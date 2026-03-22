Title: Generate Schedules
Slug: docs/generate-schedules
Summary: Build the catalog and generate broadcast schedules for your FieldStation42 channels.

FieldStation42 generates and plays schedules just like traditional TV. Before you can build a schedule though, FS42 needs to know what videos are available by building a catalog by scanning the station's `content_dir` and mapping files to tags in the configuration. Schedules are built from each station's catalog.

## 1. Build the Catalog

After configuring your stations, build the catalog. Always activate the virtual environment first:

```bash
source env/bin/activate
```

Then build the catalog with:

```bash
python3 station_42.py --rebuild_catalog
```

Or use the short option:

```bash
python3 station_42.py -r
```

### Using the Web GUI

You can also use the web interface to build, view and manage catalogs. Just run FieldStation42 with the `--server` option to start the web server:

```
python3 station_42.py --server
```

Then visit `http://localhost:4242/` in your web browser (replace localhost with the IP address if FS42 is running on a different machine than the web browser).

The web GUI will let you rebuild selected catalogs, as well as view catalog summary information and entries.

## 2. Generate Schedules

Channels need schedules to run, and that's where FieldStation42's LiquidScheduler comes into play.

### Flexible, Fluid Scheduling

LiquidScheduler gives you full control over schedule increments using the `schedule_increment=N` setting (N = minutes). Schedules will always end on these increments. For example:

- Traditional networks use 30-minute blocks (shows are 30, 60, 90, or 120 minutes, etc.)
- Movie channels may use 5-minute increments
- Some channels may have no buffering, breaks, or station IDs at all

### Schedule Management Commands

The main tool for managing schedules is `station_42.py`. (Remember to activate the virtual environment first!)

- **Show schedule start/end times:**
  ```bash
  python3 station_42.py -s
  # or
  python3 station_42.py --schedule
  ```

- **Add one day to the schedule:**
  ```bash
  python3 station_42.py -d
  # or
  python3 station_42.py --add_day
  ```

- **Add one week to the schedule:**
  ```bash
  python3 station_42.py -w
  # or
  python3 station_42.py --add_week
  ```

- **Add one month to the schedule:**
  ```bash
  python3 station_42.py -m
  # or
  python3 station_42.py --add_month
  ```

- **Delete all schedules:**
  ```bash
  python3 station_42.py -x
  # or
  python3 station_42.py --delete_schedules
  ```

Each command loads the station's catalog and configuration hints to build or update the schedule, which is then written to the system database.

### Using the Web GUI

You can also use the web interface to build, view and manage schedules. Use the same method as described above to log in to the web interface.

The schedule page will let you reset schedules, add time, and view schedules.

## Updating Content

> **Note:** The catalog is not rebuilt automatically every time you run `station_42.py` (to save time on large collections). If you add or update content, rebuild the catalog with:
>
> ```bash
> python3 station_42.py --rebuild_catalog
> ```

### When to Rebuild the Catalog

**Rebuild the catalog when:**

- You add new videos to your folders
- You remove or move videos
- You create new category folders
- You change subfolder organization
- This is your first time setting up a channel

### What Happens During a Rebuild

1. FieldStation42 scans all channel folders in `catalog/`
2. Finds all video files in each category
3. Measures the duration of each video
4. Updates the catalog database
5. Shows a summary of what was found

**Example output:**

```
Starting catalog build for Retro TV
Checking for media with tag=sitcoms in content folder
--Found 45 videos in sitcoms folder
Checking for media with tag=movies in content folder
--Found 12 videos in movies folder
Checking for media with tag=commercial in content folder
--Found 25 videos in commercial folder
Catalog build complete. Added 82 clips to catalog.
```

### Rebuilding Multiple Channels

If you have multiple station configurations, each one gets rebuilt when you run `--rebuild_catalog`. The builder scans all `content_dir` paths referenced in your config files.
