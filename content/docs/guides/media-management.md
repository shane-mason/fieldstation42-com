Title: Media Management
Slug: docs/guides/media-management
Summary: Tips for managing large media libraries with symbolic links, external drives, and network storage.

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

### Multi-Channel Setup with Symbolic Links

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
