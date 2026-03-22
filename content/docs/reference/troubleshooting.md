Title: Troubleshooting
Slug: docs/reference/troubleshooting
Summary: Common problems and solutions for FieldStation42 setup and operation.

## Content Issues

### "Content directory not found"

**Problem:** FieldStation42 can't find your channel folder.

**Solutions:**

1. Check the `content_dir` path in your config file
2. Verify the folder actually exists: `ls catalog/your_channel_name`
3. If using a symbolic link, check if it's broken: `ls -la catalog/`
4. Paths are case-sensitive: `Classic_TV` is not the same as `classic_tv`

### "No videos found in catalog"

**Problem:** Catalog builder finds the folder but no videos.

**Solutions:**

1. Make sure videos are in **subfolders**, not directly in the channel folder
2. Check file extensions are supported (mp4, mov, mkv, etc.)
3. Verify file permissions: `ls -la catalog/your_channel/sitcoms/`
4. Run rebuild to see detailed output: `python3 station_42.py --rebuild_catalog`

### Symbolic link issues

**Problem:** Link points to the wrong location or doesn't work.

**Solutions:**

1. Check if link exists: `ls -la catalog/`
2. Verify target exists: `ls /path/to/actual/videos`
3. Remove broken link: `rm catalog/broken_link`
4. Create new link with absolute path: `ln -s /full/path/to/videos catalog/new_link`

### Videos found but won't play

**Problem:** Catalog builds successfully but videos don't play during streaming.

**Solutions:**

1. Test file directly: `ffmpeg -i catalog/channel/sitcoms/video.mp4`
2. Check file corruption: Try playing in VLC or another player
3. Verify file duration is > 0 seconds
4. Some exotic codecs may not be supported - try re-encoding

### Rebuilding takes too long

**Problem:** Catalog rebuild scans thousands of files and takes ages.

**Solutions:**

1. FieldStation42 caches file information to speed up rebuilds
2. First build is always slowest (measuring all video durations)
3. Subsequent rebuilds are faster (only checks new/changed files)
4. Consider organizing into multiple smaller channels instead of one huge channel

## Configuration Issues

### "Failed to load station configuration"

- Your JSON has a syntax error
- Copy/paste into https://jsonlint.com/ to find the problem
- Common causes: trailing comma, missing quote, comment in file

### "Content directory not found"

- Check your `content_dir` path is correct
- Paths use forward slashes `/` even on Windows
- Path is relative to FieldStation42 root folder

### "No videos scheduled"

- Make sure your tag names match your subfolder names exactly (case-sensitive)
- Check that hour numbers are strings: `"7"` not `7`
- Verify your day names are lowercase: `"monday"` not `"Monday"`

### Station shows nothing but off-air pattern

- Check that you have scheduled hours for the current time
- Remember: hour `"0"` = midnight, `"13"` = 1 PM, `"20"` = 8 PM
- Hours not in your schedule = off-air

## Scheduling Issues

### Sequences not playing in order

Usually a file naming issue. Check how your files sort:

```bash
ls -1 catalog/your_content/your_show/
```

Watch out for names without zero-padding. `episode10.mp4` sorts before `episode2.mp4` alphabetically. Use `episode_01.mp4`, `episode_02.mp4`, etc.

Also check that the sequence name is spelled consistently across all slots that use it.

### Marathon never triggers

A 20% chance means about 1 in 5 days. You might just need to wait. For testing, set `"chance": 1.0` to make it always happen. Remember that schedules are built in advance, so check future days to see if a marathon was generated.

### Slot override not working

Double-check the spelling of your override name. `"overrides": "kids_blok"` won't match `"kids_block"`. Also make sure the override is defined in the `slot_overrides` section (not somewhere else in the config).

### Schedule overruns or gaps

This usually means your videos are longer than the `schedule_increment`, or you're using an increment that doesn't divide evenly into 60. Stick to 5, 10, 15, 20, 30, or 60. If timing isn't critical, set `schedule_increment: 0` for continuous play.
