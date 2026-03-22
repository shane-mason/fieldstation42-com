Title: Scheduling Hints
Slug: docs/guides/scheduling-hints
Summary: Use special subfolder names to control when content plays - by month, quarter, date range, time of day, or day of week.

FieldStation42 recognizes certain subfolder names as **scheduling hints** that control when content plays. By naming your subfolders strategically, you can make content appear only during specific times without any configuration changes.

## Monthly Content

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

## Quarterly Content

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

## Date Range Content

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

## Time-of-Day Content

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

## Day-of-Week Content

Content in subfolders named after a day of the week (monday, tuesday, wednesday etc) will only be played on that day.

Note: days are all lowercase

## Example: Advanced Channel with Scheduling Hints

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