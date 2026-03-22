Title: Scheduling Hints
Slug: docs/guides/scheduling-hints
Summary: Use special subfolder names to control when content plays by month, quarter, date range, time of day, or day of week.

FieldStation42 can automatically figure out when certain content should play based on the names of your subfolders. Name a folder `October` and the videos inside it only play during October. Name one `morning` and those clips only show up in the morning. No configuration changes needed.

## Monthly Content

Name a subfolder after a month and its contents only play during that month:

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

Use the full month name (January, February, March, etc.). Abbreviations won't work.

## Quarterly Content

Use `Q1`, `Q2`, `Q3`, or `Q4` to restrict content to a three-month window:

```
catalog/retro_tv/
└── commercials/
    └── Q4/                     <- Only plays Oct through Dec
        ├── holiday_sale.mp4
        └── winter_promo.mp4
```

The quarters break down like this:

- Q1 = January through March
- Q2 = April through June
- Q3 = July through September
- Q4 = October through December

## Date Range Content

For more specific timing, name a folder with a date range. This works even across year boundaries:

```
catalog/retro_tv/
└── sitcoms/
    └── December 1 - December 25/   <- Only plays Dec 1 through 25
        ├── xmas_ep1.mp4
        └── xmas_ep2.mp4
```

Another example:

```
November 15 - April 10/         <- Plays Nov 15 through Apr 10
```

This is perfect for holiday seasons, sweeps periods, or any time you want content to appear for a specific stretch.

## Time-of-Day Content

Name subfolders after parts of the day to control what plays when. This is especially useful for commercials and bumps:

```
catalog/retro_tv/
└── commercial/
    ├── morning/                <- Only plays 6am to 10am
    │   ├── breakfast_ad.mp4
    │   └── coffee_ad.mp4
    ├── daytime/                <- Only plays 10am to 5pm
    │   └── soap_ad.mp4
    ├── prime/                  <- Only plays 5pm to 11pm
    │   └── beer_ad.mp4
    ├── late/                   <- Only plays 11pm to 2am
    │   └── late_night_ad.mp4
    └── overnight/              <- Only plays 2am to 6am
        └── insomnia_ad.mp4
```

The default time ranges are:

| Name | Hours |
|------|-------|
| `morning` | 6am to 10am |
| `daytime` | 10am to 5pm |
| `prime` | 5pm to 11pm |
| `late` | 11pm to 2am |
| `overnight` | 2am to 6am |

You can change these times by editing `conf/main_config.json` (the change applies to all channels).

## Day-of-Week Content

Name a subfolder after a day of the week and its content only plays on that day. For example, a folder named `friday` would only contribute videos on Fridays.

Use all lowercase: `monday`, `tuesday`, `wednesday`, etc.

## Putting It All Together

Here's how a channel might look when you combine several types of scheduling hints:

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
        │   ├── morning/              <- 6am to 10am only
        │   │   └── breakfast_ad.mp4
        │   ├── daytime/              <- 10am to 5pm only
        │   │   └── general_ad.mp4
        │   └── prime/                <- 5pm to 11pm only
        │       └── dinner_ad.mp4
        └── bump/
            ├── pre/                  <- Start of breaks
            │   └── brb.mp4
            ├── post/                 <- End of breaks
            │   └── welcome_back.mp4
            └── general_promo.mp4
```

The regular cartoons and sitcoms play all year. Halloween specials appear in October, Christmas specials in December, and winter episodes run from mid-November through early April. Meanwhile, the commercials rotate by time of day automatically.

All of this happens just from the folder names. You don't need to touch your station config at all.
