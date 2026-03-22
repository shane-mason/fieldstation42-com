Title: Media Management
Slug: docs/guides/media-management
Summary: Tips for managing large media libraries with symbolic links, external drives, and network storage.

If your video collection lives on an external hard drive, network storage, or another partition, you don't need to copy everything into the `catalog` folder. Symbolic links let you keep your files wherever they are and still have FieldStation42 see them.

## What is a Symbolic Link?

A symbolic link is like a shortcut. It looks like a folder, but it actually points to another location. When FieldStation42 looks inside `catalog/my_channel`, the link redirects it to wherever your videos actually live.

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

## Creating a Symbolic Link

From your FieldStation42 folder, run:

```bash
ln -s /path/to/your/videos catalog/my_channel
```

For example, if your videos are at `/media/external/classic_tv` and you want them available as `catalog/classic_tv`:

```bash
ln -s /media/external/classic_tv catalog/classic_tv
```

Here's what each part means:

- `ln -s` = create a symbolic link
- `/media/external/classic_tv` = where your videos actually are (the source)
- `catalog/classic_tv` = what FieldStation42 will see (the link name)

Use **full paths** (starting with `/`) for the source location. Relative paths can break if you run FieldStation42 from a different directory.

## Checking If a Link Works

After creating the link, verify it:

```bash
ls -la catalog/
```

You should see something like:

```
lrwxrwxrwx  1 user user   30 Oct 19 catalog/my_channel -> /media/external/my_videos
```

The `->` shows it's a link pointing to another location. If the link is red or the target doesn't exist, check that the source path is correct.

## Multiple Channels from Different Drives

You can link content from multiple drives into your catalog. Each channel can point to a different location:

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

The commands to set this up:

```bash
ln -s /media/disk1/classic_sitcoms catalog/retro_channel
ln -s /media/disk1/horror_movies catalog/horror_channel
ln -s /media/disk1/music_videos catalog/music_channel
ln -s /media/disk2/western_films catalog/western_channel
```

## Linking Commercials and Bumps Separately

You can also use symbolic links for just the commercials or bumps inside a channel. This is handy when your show content and your ad content live in different places:

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

The top-level channel folder is a link to where the shows are, and the `commercial/` and `bump/` folders inside it are separate links to where the ads live. FieldStation42 follows all the links transparently.
