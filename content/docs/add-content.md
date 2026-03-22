Title: Add Station Content
Slug: docs/add-content
Summary: Organize your video files so FieldStation42 can build channel schedules from them.

FieldStation42 needs video files to build your channels. This step is all about putting those files in the right place so the system can find them.

## Where Your Videos Go

During installation, a `catalog` folder was created inside your FieldStation42 directory. This is your media library. Each channel you create gets its own folder inside `catalog`:

```
FieldStation42/                 <- Main installation folder
└── catalog/                    <- Your media library
    ├── classic_tv/             <- Content for one channel
    ├── music_videos/           <- Content for another channel
    └── movie_channel/          <- Content for yet another channel
```

To create your first channel, just make a new folder inside `catalog`. You can name it whatever you like. Lowercase with underscores works best:

```bash
mkdir catalog/retro_tv
```

## Organize Videos into Categories

Inside your channel folder, create subfolders for each type of content. These folder names become **tags** that you'll use later when building your schedule.

```
catalog/retro_tv/
├── sitcoms/                    <- Tag: "sitcoms"
│   ├── show1_ep1.mp4
│   ├── show1_ep2.mp4
│   └── show2_ep1.mp4
├── movies/                     <- Tag: "movies"
│   ├── movie1.mp4
│   └── movie2.mp4
├── cartoons/                   <- Tag: "cartoons"
│   ├── cartoon1.mp4
│   └── cartoon2.mp4
├── commercial/                 <- Short ad clips (15-60 sec)
│   ├── ad1.mp4
│   ├── ad2.mp4
│   └── ad3.mp4
└── bump/                       <- Station ID clips (2-60 sec)
    ├── promo1.mp4
    ├── promo2.mp4
    └── promo3.mp4
```

The idea is simple: when you schedule the 8 PM hour as `"tags": "sitcoms"`, FieldStation42 picks a random video from your `sitcoms` folder. Name your folders whatever makes sense for your content: `horror`, `comedy`, `westerns`, `80s_shows`, whatever you want.

A few things to keep in mind:

- Folder names are **case-sensitive**, so `Movies` and `movies` are different
- Videos go in the subfolders, not directly in the channel folder
- Supported formats: mp4, mpg, mpeg, avi, mov, mkv, ts, m4v, webm, wmv

The two special folders, `commercial` and `bump`, hold short clips that play between shows, just like real TV. You'll need both if you're building a traditional channel with scheduled time blocks. If you're building a simple looping or continuous play channel, you can skip them.

### Organizing by Series

You can nest folders inside your categories to keep things tidy. FieldStation42 scans subfolders automatically:

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

Using `"tags": "sitcoms"` pulls randomly from all the shows. If you want just one series, use `"tags": "sitcoms/cheers"` to narrow it down.

## Going Further

Once you have the basics in place, there's a lot more you can do with your content library:

**[Bumps and Commercials](/docs/guides/bumps-and-commercials/)**: Bumps are short station promos ("You're watching Retro TV!") and commercials fill time between shows. This guide covers best practices, how many you need, and advanced features like pre/post break bumps.

**[Scheduling Hints](/docs/guides/scheduling-hints/)**: Want Halloween specials that only air in October? Morning commercials that only play before 10am? Just name your subfolders the right way and FieldStation42 handles the rest.

**[Media Management](/docs/guides/media-management/)**: Your videos don't have to live inside the `catalog` folder. If your collection is on an external drive or network storage, this guide shows you how to link it all together.

## Quick Reference Checklist

Before moving on:

- [ ] Channel folder created in `catalog/`
- [ ] Videos sorted into category subfolders
- [ ] `commercial/` folder has short ad clips (if using scheduled time blocks)
- [ ] `bump/` folder has station ID clips (if using scheduled time blocks)
- [ ] Video files are in supported formats (mp4, mov, mkv, etc.)

## Next Step

Your content is ready. Now head to [Step 3: Configure Stations](/docs/configure-stations/) to tell FieldStation42 what to play and when.
