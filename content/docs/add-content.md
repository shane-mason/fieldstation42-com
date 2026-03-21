Title: Add Station Content
Slug: docs/add-content
Summary: Organize your video files into the catalog folder structure that FieldStation42 uses to build channel schedules.

FieldStation42 stores all media in a `catalog` folder that acts as a central library for TV channels. This guide covers organizing, structuring, and managing content.

## Core Directory Structure

The basic setup follows this pattern:

```
FieldStation42/
└── catalog/
    └── channel_name/
        ├── category_folder/
        ├── commercial/
        └── bump/
```

Each channel lives in its own subfolder within `catalog`, with content organized into category subfolders.

## Organizing Content

**Primary Content Folders**

Create subfolders for your programming types (sitcoms, movies, cartoons, etc.). FieldStation42 uses subfolders as categories that the scheduler references as tags in configuration files.

**Special Folders**

- **commercial/**: 15-60 second ad clips for time-block scheduling
- **bump/**: 2-60 second station identification and interstitial content

These are optional for continuous-play channels but essential for standard networks using time-block scheduling.

## Advanced Organization with Scheduling Hints

FieldStation42 recognizes special subfolder names:

**Temporal Restrictions:**

- Month names (October, December): Content plays only during that month
- Q1-Q4: Quarterly restrictions
- Date ranges (e.g., "November 15 - April 10"): Specific time periods
- Day names (monday, tuesday): Day-of-week restrictions

**Time-of-Day Folders:**

```
commercial/
├── morning/      (6am-10am)
├── daytime/      (10am-5pm)
├── prime/        (5pm-11pm)
├── late/         (11pm-2am)
└── overnight/    (2am-6am)
```

**Special Bump Subfolders:**

- **pre/**: Plays at start of commercial breaks
- **post/**: Plays at end of commercial breaks

## Working with External Storage

For large media libraries on separate drives, use symbolic links instead of copying files:

```bash
ln -s /path/to/your/videos catalog/channel_name
```

Example:

```bash
ln -s /media/external/classic_tv catalog/retro_channel
```

Verify the link works: `ls -la catalog/` should show the arrow indicator.

## Building the Catalog

Run this command when adding new content or modifying folder structure:

```bash
python3 station_42.py --rebuild_catalog
```

This process:

1. Scans all channel folders
2. Identifies video files in supported formats (mp4, mov, mkv, avi, mpg, etc.)
3. Measures video durations
4. Updates the catalog database

The rebuild is not automatic. Run it each time you add or reorganize videos.

## Complete Structure Example

```
catalog/classic_tv/
├── sitcoms/
│   ├── show1_s01e01.mp4
│   └── show2_s01e01.mp4
├── dramas/
│   └── drama1_ep1.mp4
├── commercial/
│   ├── morning/
│   │   └── breakfast_ad.mp4
│   └── prime/
│       └── evening_ad.mp4
└── bump/
    ├── pre/
    │   └── brb.mp4
    └── post/
        └── welcome_back.mp4
```

## Troubleshooting

- **"Content directory not found"**: Verify the path in your config matches the actual folder name (case-sensitive).
- **"No videos found"**: Ensure videos are in subfolders, not directly in the channel folder. Check file extensions are supported.
- **Symbolic link issues**: Test with `ls /path/to/actual/videos` to confirm the target exists.