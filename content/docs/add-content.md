Title: Add Station Content
Slug: docs/add-content
Summary: Organize your video files into the catalog folder structure that FieldStation42 uses to build channel schedules.

This guide will help you set up your media library for FieldStation42. Don't worry if you're not familiar with organizing files on a computer - we'll explain everything step by step.

## Understanding the Catalog Directory

FieldStation42 stores all your media in a folder called `catalog` (created automatically during installation). Think of this as your "video library" that all your channels will pull content from.

**Where is it?**

- The `catalog` folder is located inside your main FieldStation42 directory
- Each TV channel you create will have its own subfolder inside `catalog`

**Example file structure:**

```
FieldStation42/                 <- Main installation folder
└── catalog/                    <- Your media library
    ├── classic_tv/             <- Content for one channel
    ├── music_videos/           <- Content for another channel
    └── movie_channel/          <- Content for yet another channel
```

### Creating Your First Channel Folder

Let's say you want to create a channel called "Retro TV". Here's what you do:

**Step 1:** Navigate to your FieldStation42 folder
**Step 2:** Create a new folder inside `catalog` named `retro_tv`

```
FieldStation42/
└── catalog/
    └── retro_tv/               <- Your new channel folder
```

You can name this folder whatever you like (lowercase, no spaces recommended). This folder name will be referenced in your station configuration file as the `content_dir`.

## Organizing Content Inside Your Channel

Once you have a channel folder (like `retro_tv`), you need to organize your videos inside it. FieldStation42 uses **subfolders as categories** (called "tags" in the configuration).

### Basic Structure

```
catalog/retro_tv/
├── sitcoms/                    <- Videos go in category folders
│   ├── show1_ep1.mp4
│   ├── show1_ep2.mp4
│   └── show2_ep1.mp4
├── movies/                     <- Another category
│   ├── movie1.mp4
│   └── movie2.mp4
├── cartoons/                   <- Yet another category
│   ├── cartoon1.mp4
│   └── cartoon2.mp4
├── commercial/                 <- Special folder for ads (15-60 sec clips)
│   ├── ad1.mp4
│   ├── ad2.mp4
│   └── ad3.mp4
└── bump/                       <- Special folder for station IDs (2-60 sec clips)
    ├── promo1.mp4
    ├── promo2.mp4
    └── promo3.mp4
```

### Important Concepts

**Tags (Categories):**

- Each subfolder name becomes a "tag" you can use in your schedule
- If you have a folder named `sitcoms`, you use `"tags": "sitcoms"` in your config
- You can name your folders anything: `horror`, `comedy`, `westerns`, `80s_shows`, etc.
- Folder names are **case-sensitive**: `Movies` and `movies` are different!

**Special Folders for Standard Networks:**

- `commercial/` - Contains 15-60 second ad clips (needed for time-block scheduling unless commercial-free)
- `bump/` - Contains 2-60 second station promos and interstitials (needed for time-block scheduling)

**Note:** The names `commercial` and `bump` are defaults. You can configure different folder names using the `commercial_dir` and `bump_dir` settings in your station configuration file.

**Content Folders:**

- All other folders (sitcoms, movies, etc.) are up to you
- Create as many categories as you need for your programming

### How the Catalog Builder Works

When you run FieldStation42 with the `--rebuild_catalog` option, it:

1. **Scans your channel folder** (e.g., `catalog/retro_tv/`)
2. **Finds all subfolders** (sitcoms, movies, cartoons, etc.)
3. **Looks for video files** in each subfolder
4. **Creates an index** so the scheduler knows what's available
5. **Checks video durations** to properly schedule content

**Supported video formats:** mp4, mpg, mpeg, avi, mov, mkv, ts, m4v, webm, wmv

## About Bumps and Commercials

These short clips make your channel feel like real TV! They're primarily used by **standard network types** that schedule content in time blocks.

### Bumps (Station Promos)

**What are they?**

- Short clips that identify your station
- Examples: "You're watching Retro TV", "We'll be right back"
- Play between shows and during commercial breaks

**When are they needed?**

- For standard networks using time-block scheduling (e.g., 30-minute or 60-minute blocks)
- Not needed for continuous play channels (`schedule_increment: 0`)
- Not needed for loop or streaming network types

**Best practices:**

- Length: 2-60 seconds (shorter is better)
- Variety: Add 5 to 10 different bumps minimum
- Content: Station IDs, "coming up next" messages, interstitials

### Commercials

**What are they?**

- Advertisement clips that fill programming blocks
- Used to pad shows to fit 30-minute or 60-minute time slots

**When are they needed?**

- For standard networks that aren't commercial-free
- If you set `"commercial_free": true`, commercials aren't needed (bumps are used instead)
- Not needed for continuous play channels (`schedule_increment: 0`)

**Best practices:**

- Length: 15-60 seconds
- Variety: Add 20-30 different commercials minimum
- The more variety, the better the scheduler can fit content into time blocks

**Customizing folder names:** The default folder names are `commercial` and `bump`, but you can configure different names using `"commercial_dir"` and `"bump_dir"` settings in your station configuration.

## Advanced Organization: Using Subfolders

FieldStation42 automatically scans subfolders within your category folders. This is useful for organizing large collections.

### Organizing by Series

```
catalog/retro_tv/
└── sitcoms/
    ├── seinfeld/
    │   ├── s01e01.mp4
    │   ├── s01e02.mp4
    │   └── s01e03.mp4
    ├── friends/
    │   ├── s01e01.mp4
    │   └── s01e02.mp4
    └── cheers/
        ├── pilot.mp4
        └── ep02.mp4
```

When you schedule `"tags": "sitcoms"`, the scheduler will randomly pick from **all** videos in the sitcoms folder, including those in subfolders. If you use the tag `sitcoms/cheers` though, it will only select from episodes in that specific folder.

### Special Subfolder Names: Scheduling Hints

FieldStation42 recognizes certain subfolder names as **scheduling hints** that control when content plays.

#### Monthly Content

Name a subfolder after a month to only play it during that month:

```
catalog/retro_tv/
└── cartoons/
    ├── October/                <- Only plays in October
    │   ├── halloween_special1.mp4
    │   └── halloween_special2.mp4
    └── December/               <- Only plays in December
        ├── xmas_special1.mp4
        └── xmas_special2.mp4
```

**Important:** Use full month names (January, February, etc.)

#### Quarterly Content

Use `Q1`, `Q2`, `Q3`, or `Q4` to restrict by quarter:

```
catalog/retro_tv/
└── commercials/
    └── Q4/                     <- Only plays Oct-Dec
        ├── holiday_sale.mp4
        └── winter_promo.mp4
```

**Quarters:**

- Q1 = January - March
- Q2 = April - June
- Q3 = July - September
- Q4 = October - December

#### Date Range Content

Use date ranges for specific time periods (even across year boundaries):

```
catalog/retro_tv/
└── sitcoms/
    └── December 1 - December 25/   <- Only plays Dec 1-25
        ├── xmas_ep1.mp4
        └── xmas_ep2.mp4
```

Another example:

```
November 15 - April 10/         <- Plays Nov 15 through Apr 10
```

#### Time-of-Day Content

Name subfolders to restrict content to certain hours (great for commercials and bumps!):

```
catalog/retro_tv/
└── commercial/
    ├── morning/                <- Only plays 6am-10am
    │   ├── breakfast_ad.mp4
    │   └── coffee_ad.mp4
    ├── daytime/                <- Only plays 10am-5pm
    │   └── soap_ad.mp4
    ├── prime/                  <- Only plays 5pm-11pm
    │   └── beer_ad.mp4
    ├── late/                   <- Only plays 11pm-2am
    │   └── late_night_ad.mp4
    └── overnight/              <- Only plays 2am-6am
        └── insomnia_ad.mp4
```

**Default time ranges:**

- `morning` = 6am-10am
- `daytime` = 10am-5pm
- `prime` = 5pm-11pm
- `late` = 11pm-2am
- `overnight` = 2am-6am

To change these times, edit `conf/main_config.json` (applies to all channels).

#### Day-of-Week Content

Content in subfolders named after a day of the week (monday, tuesday, wednesday etc) will only be played on that day.

Note: days are all lowercase

### Special Bump Subfolders: Pre & Post

The bump folder supports two special subfolders for commercial break control:

```
catalog/retro_tv/
└── bump/
    ├── pre/                    <- Always plays at START of commercial breaks
    │   ├── "we'll be right back.mp4"
    │   └── "after these messages.mp4"
    ├── post/                   <- Always plays at END of commercial breaks
    │   ├── "welcome back.mp4"
    │   └── "and now back to.mp4"
    └── general_bump.mp4        <- Used if pre/post aren't specified
```

**How it works:**

- If `pre/` exists: First clip in every commercial break comes from this folder
- If `post/` exists: Last clip in every commercial break comes from this folder
- If `pre/` or `post/` are missing: Regular bumps are used instead

## Working with Large Media Libraries

### What If My Videos Are on a Different Drive?

You might have your video collection on an external hard drive, network storage, or another partition. Instead of copying everything into the `catalog` folder, you can use **symbolic links** (shortcuts).

#### What is a Symbolic Link?

Think of a symbolic link as a "shortcut" or "alias" that points to another location. When FieldStation42 looks inside `catalog/my_channel`, the symbolic link redirects it to wherever your videos actually live.

**Visual example:**

```
Your actual videos:
/media/external_drive/my_video_collection/
├── sitcoms/
├── movies/
└── commercials/

FieldStation42 catalog:
catalog/
└── my_channel -> /media/external_drive/my_video_collection/
    (this is a link, not a real folder)
```

#### Creating a Symbolic Link (Linux/Mac)

**Step 1:** Open a terminal
**Step 2:** Navigate to your FieldStation42 folder
**Step 3:** Create the link

```bash
ln -s /path/to/your/videos catalog/my_channel
```

**Real example:**

```bash
# If your videos are at /media/external/classic_tv
# And you want them available as catalog/classic_tv
ln -s /media/external/classic_tv catalog/classic_tv
```

**Breaking down the command:**

- `ln -s` = create a symbolic link
- `/media/external/classic_tv` = where your videos actually are (source)
- `catalog/classic_tv` = what FieldStation42 will see (link name)

**Important:** Use **full paths** (starting with `/`) for the source location, not relative paths.

#### Checking If a Link Works

After creating the link, verify it:

```bash
ls -la catalog/
```

You should see something like:

```
lrwxrwxrwx  1 user user   30 Oct 19 catalog/my_channel -> /media/external/my_videos
```

The `->` shows it's a link pointing to another location.

### Example: Multiple Channels with Symbolic Links

```
Your media storage:
/media/disk1/
├── classic_sitcoms/
├── horror_movies/
└── music_videos/

/media/disk2/
└── western_films/

FieldStation42 catalog:
catalog/
├── retro_channel -> /media/disk1/classic_sitcoms/
├── horror_channel -> /media/disk1/horror_movies/
├── music_channel -> /media/disk1/music_videos/
└── western_channel -> /media/disk2/western_films/
```

Commands to create these links:

```bash
ln -s /media/disk1/classic_sitcoms catalog/retro_channel
ln -s /media/disk1/horror_movies catalog/horror_channel
ln -s /media/disk1/music_videos catalog/music_channel
ln -s /media/disk2/western_films catalog/western_channel
```

## Building and Rebuilding the Catalog

### When to Rebuild

The catalog is **not** rebuilt automatically every time you run FieldStation42. This saves time when you have large video collections.

**Rebuild the catalog when:**

- You add new videos to your folders
- You remove or move videos
- You create new category folders
- You change subfolder organization
- This is your first time setting up a channel

### How to Rebuild

Run this command from your FieldStation42 directory:

```bash
python3 station_42.py --rebuild_catalog
```

**What happens:**

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

## Complete Folder Structure Examples

### Example 1: Simple Classic TV Channel (Standard Network)

```
FieldStation42/
└── catalog/
    └── classic_tv/
        ├── sitcoms/
        │   ├── show1_s01e01.mp4
        │   ├── show1_s01e02.mp4
        │   └── show2_s01e01.mp4
        ├── dramas/
        │   ├── drama1_ep1.mp4
        │   └── drama2_ep1.mp4
        ├── news/
        │   ├── news_segment_1.mp4
        │   └── news_segment_2.mp4
        ├── commercial/              <- For time-block scheduling
        │   ├── ad1.mp4
        │   ├── ad2.mp4
        │   └── ad3.mp4
        └── bump/                    <- For time-block scheduling
            ├── station_id.mp4
            ├── be_right_back.mp4
            └── welcome_back.mp4
```

### Example 2: Advanced Channel with Scheduling Hints

```
FieldStation42/
└── catalog/
    └── family_channel/
        ├── cartoons/
        │   ├── regular_toons/
        │   │   ├── cartoon1.mp4
        │   │   └── cartoon2.mp4
        │   ├── October/              <- Halloween specials
        │   │   └── halloween.mp4
        │   └── December/             <- Christmas specials
        │       └── christmas.mp4
        ├── sitcoms/
        │   ├── family_friendly/
        │   │   └── show1_ep1.mp4
        │   └── November 15 - April 10/  <- Winter season
        │       └── winter_episode.mp4
        ├── commercial/
        │   ├── morning/              <- 6am-10am only
        │   │   └── breakfast_ad.mp4
        │   ├── daytime/              <- 10am-5pm only
        │   │   └── general_ad.mp4
        │   └── prime/                <- 5pm-11pm only
        │       └── dinner_ad.mp4
        └── bump/
            ├── pre/                  <- Start of breaks
            │   └── brb.mp4
            ├── post/                 <- End of breaks
            │   └── welcome_back.mp4
            └── general_promo.mp4
```

### Example 3: Multi-Channel Setup with Symbolic Links

```
Actual storage locations:
/mnt/storage1/
├── classic_tv_collection/
│   ├── westerns/
│   ├── sitcoms/
│   └── dramas/
└── ads_and_bumps/
    ├── vintage_commercials/
    └── station_bumps/

/mnt/storage2/
└── movies/
    ├── action/
    ├── comedy/
    └── scifi/

FieldStation42/
└── catalog/
    ├── classic_channel/          -> symbolic link to /mnt/storage1/classic_tv_collection/
    │   ├── westerns/             (actual content via link)
    │   ├── sitcoms/
    │   ├── dramas/
    │   ├── commercial/           -> symbolic link to /mnt/storage1/ads_and_bumps/vintage_commercials/
    │   └── bump/                 -> symbolic link to /mnt/storage1/ads_and_bumps/station_bumps/
    └── movie_channel/            -> symbolic link to /mnt/storage2/movies/
        ├── action/               (actual content via link)
        ├── comedy/
        └── scifi/
```

## Troubleshooting

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

## Quick Reference: File Organization Checklist

Before building your catalog, verify:

- [ ] Channel folder exists in `catalog/`
- [ ] Category subfolders created (sitcoms, movies, etc.)
- [ ] `commercial/` folder exists with 15-60 sec clips (if using time-block scheduling and not commercial-free)
- [ ] `bump/` folder exists with 2-60 sec clips (if using time-block scheduling)
- [ ] Video files are in supported formats (mp4, mov, mkv, etc.)
- [ ] Subfolders use correct naming for scheduling hints (if using)
- [ ] Symbolic links point to correct locations (if using)
- [ ] File permissions allow reading (especially with symbolic links)
- [ ] Ready to run `python3 station_42.py --rebuild_catalog`

**Note:** For loop channels or continuous play channels (`schedule_increment: 0`), you may not need commercial or bump folders at all.