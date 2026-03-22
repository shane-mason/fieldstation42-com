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

### Organizing by Series

FieldStation42 automatically scans subfolders within your category folders. This is useful for organizing large collections:

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

## Bumps and Commercials

Bumps and commercials are short clips that make your channel feel like real TV. Bumps are station promos ("You're watching Retro TV"), while commercials fill time between shows. You'll need both if you're building a standard network with time-block scheduling. See the [Bumps and Commercials guide](/docs/guides/bumps-and-commercials/) for best practices, folder organization, and advanced features like pre/post break bumps.

## Scheduling Hints

FieldStation42 can automatically control when content plays based on subfolder names. Name a folder `October` and those videos only play in October. Name one `morning` and it only plays from 6-10am. You can also use quarters (`Q1`-`Q4`), date ranges, and days of the week. See the [Scheduling Hints guide](/docs/guides/scheduling-hints/) for all the options.

## Media on External Drives

Your videos don't need to live inside the `catalog` folder. If your collection is on an external drive, network storage, or another partition, you can use symbolic links to point FieldStation42 to the right place. See the [Media Management guide](/docs/guides/media-management/) for setup instructions and examples.

## Complete Folder Structure Example

### Simple Classic TV Channel (Standard Network)

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

## Quick Reference: File Organization Checklist

Before building your catalog, verify:

- [ ] Channel folder exists in `catalog/`
- [ ] Category subfolders created (sitcoms, movies, etc.)
- [ ] `commercial/` folder exists with 15-60 sec clips (if using time-block scheduling and not commercial-free)
- [ ] `bump/` folder exists with 2-60 sec clips (if using time-block scheduling)
- [ ] Video files are in supported formats (mp4, mov, mkv, etc.)
- [ ] File permissions allow reading
- [ ] Ready to run `python3 station_42.py --rebuild_catalog`

**Note:** For loop channels or continuous play channels (`schedule_increment: 0`), you may not need commercial or bump folders at all.
