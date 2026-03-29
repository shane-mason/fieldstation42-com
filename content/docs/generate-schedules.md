Title: Generate Schedules
Slug: docs/generate-schedules
Summary: Build the catalog and generate broadcast schedules for your FieldStation42 channels.

Before FieldStation42 can play anything, it needs to do two things: scan your video files into a catalog, and then build a schedule from that catalog. Both are quick one-line commands.

Make sure you've activated the virtual environment first (you should see `(env)` in your terminal prompt):

```bash
source env/bin/activate
```

## Build the Catalog

The catalog is FieldStation42's index of all your videos: what's available, how long each clip is, and which tags they belong to. Build it with:

```bash
python3 station_42.py --rebuild_catalog
```

You'll see output showing each channel being scanned:

```
Starting catalog build for Retro TV
Checking for media with tag=sitcoms in content folder
--Found 45 videos in sitcoms folder
Checking for media with tag=movies in content folder
--Found 12 videos in movies folder
Catalog build complete. Added 82 clips to catalog.
```

If you have multiple channels configured, they all get scanned at once.

The first build can take a little while since it needs to measure the duration of every video. After that, rebuilds are faster because it only checks new or changed files.

## Generate the Schedule

Now build your programming lineup. The most common option is to generate a week at a time:

```bash
python3 station_42.py --add_week
```

That's it! FieldStation42 reads your channel configs and catalog, then builds a schedule for the next seven days.

Here are all the scheduling commands:

| Command | Short | What it does |
|---------|-------|-------------|
| `--schedule` | `-s` | Show current schedule start/end times |
| `--add_day` | `-d` | Add one day to the schedule |
| `--add_week` | `-w` | Add one week to the schedule |
| `--add_month` | `-m` | Add one month to the schedule |
| `--delete_schedules` | `-x` | Delete all schedules and start fresh |

You can run these commands anytime to extend your schedule further into the future.

## Automating Schedule Generation

Running `--add_week` manually works fine, but you can also configure FieldStation42 to extend schedules automatically in the background. The live schedule agent watches all your channels and regenerates them before they expire, so you never have to think about it.

See [Live Schedule Agent](/docs/reference/main-config/#live-schedule-agent) in the Main Config reference for setup details.

## Using the Web Console

If you'd rather not work in the terminal, the built-in web console handles all of this through a browser interface. Start the server:

```bash
python3 station_42.py
```

Then visit `http://localhost:4242/` in your browser. If FieldStation42 is running on a different machine (like a Raspberry Pi), replace `localhost` with that machine's IP address.

From the web console you can rebuild catalogs, view their contents, generate schedules, and see what's coming up on each channel. Everything on this page is also available there.

## When to Rebuild the Catalog

The catalog doesn't update automatically. This saves time when you have large video collections. You'll need to rebuild it when you:

- Add, remove, or move video files
- Create new content folders
- Set up a channel for the first time

Just run `python3 station_42.py --rebuild_catalog` again and your catalog will be up to date.

## Next Step

Everything is built. Head to [Step 5: Watch TV](/docs/watch-tv/) to start the player.
