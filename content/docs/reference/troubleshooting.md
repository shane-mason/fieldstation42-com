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
