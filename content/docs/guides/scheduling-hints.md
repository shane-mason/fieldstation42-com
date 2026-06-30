Title: Controlling When Content Plays
Slug: docs/guides/scheduling-hints
Summary: Use folder naming or meta_hints configuration to restrict when specific content is eligible to play, by month, date range, time of day, or day of week.

FieldStation42 gives you two tools for controlling when content is eligible to play. The first is folder-based hints: names you give to subfolders that FieldStation42 reads at catalog-build time to determine availability windows. The second is `meta_hints`: a block in your station config that expresses the same rules as JSON, without touching your folder structure.

Both work on the same principle. Content that is outside its availability window is simply not added to the eligible pool when the scheduler runs. No config changes are needed at schedule-build time; you set the rules once and they apply automatically.

---

## Folder-Based Hints

Folder hints are the simplest option. Name a subfolder with a month, quarter, date range, time of day, or day of the week, and FieldStation42 restricts that folder's contents to the matching window automatically.

### Monthly

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

Use the full month name (January, February, March, etc.). Abbreviations are not recognized.

### Quarterly

Use `Q1`, `Q2`, `Q3`, or `Q4` to restrict content to a three-month window:

```
catalog/retro_tv/
└── commercial/
    └── Q4/                     <- Only plays Oct through Dec
        ├── holiday_sale.mp4
        └── winter_promo.mp4
```

| Name | Months                   |
|------|--------------------------|
| Q1   | January through March    |
| Q2   | April through June       |
| Q3   | July through September   |
| Q4   | October through December |

### Date Range

For more specific windows, name a folder with a date range:

```
catalog/retro_tv/
└── sitcoms/
    └── December 1 - December 25/   <- Only plays Dec 1 through 25
        ├── xmas_ep1.mp4
        └── xmas_ep2.mp4
```

Ranges wrap around the year boundary, so a winter season can be expressed as a single folder name:

```
November 15 - April 10/         <- Plays Nov 15 through Apr 10
```

### Time of Day

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

| Name        | Hours       |
|-------------|-------------|
| `morning`   | 6am to 10am |
| `daytime`   | 10am to 5pm |
| `prime`     | 5pm to 11pm |
| `late`      | 11pm to 2am |
| `overnight` | 2am to 6am  |

You can change these ranges in `confs/main_config.json`. The change applies across all channels. See [Main Config Reference](/docs/reference/main-config/) for details.

### Day of Week

Name a subfolder after a day of the week and its content only plays on that day. Use all lowercase: `monday`, `tuesday`, `wednesday`, `thursday`, `friday`, `saturday`, `sunday`.

### Combining Folder Hints

Folder hints stack by nesting. A `commercial` folder might have a `morning` subfolder, and inside that a `December` subfolder:

```
commercial/
└── morning/
    └── December/
        └── holiday_breakfast_ad.mp4
```

That ad only plays during December mornings. Here is how a fully hinted channel might look:

```
FieldStation42/
└── catalog/
    └── family_channel/
        ├── cartoons/
        │   ├── regular_toons/
        │   ├── October/              <- Halloween specials
        │   └── December/             <- Christmas specials
        ├── sitcoms/
        │   ├── family_friendly/
        │   └── November 15 - April 10/  <- Winter season content
        ├── commercial/
        │   ├── morning/              <- 6am to 10am only
        │   ├── daytime/              <- 10am to 5pm only
        │   └── prime/                <- 5pm to 11pm only
        └── bump/
            ├── pre/
            └── post/
```

The regular and seasonal content coexist in the same tag folders. No schedule changes are needed; the scheduler filters automatically based on the current date and time.

---

## Meta Hints

`meta_hints` lets you express the same availability rules inside your station config instead of in folder names. It is useful when:

- Your folders are already organized by show or type and you don't want to restructure them
- You want all of a channel's rules visible in one place
- You need to apply the same rule to multiple tags without creating matching folders for each

`meta_hints` is a top-level array inside `station_conf`:

```json
{
  "station_conf": {
    "network_name": "Classic TV",
    "channel_number": 4,
    "content_dir": "catalog/classic",
    "meta_hints": [
      { "tags": "holiday/halloween", "date_range": "October 15 - November 1"}
    ]
  }
}
```

Each entry has a `tags` field and one or more conditions. Content in those tags is only eligible during the matching window.

### Date Range

```json
"meta_hints": [
  { "tags": "holiday/halloween", "date_range": "October 15 - November 1"}
]
```

The date range format is the same as for folder names. Ranges wrap around the year boundary:

```json
{ "tags": "holiday/winter", "date_range": "December 1 - January 10"}
```

### Time of Day

```json
"meta_hints": [
  { "tags": "bumps/kids", "day_part": "morning"}
]
```

Day part names match the ones defined in your main config: `morning`, `daytime`, `prime`, `late`, `overnight` by default.

### Combining Conditions

Specify both `date_range` and `day_part` in one entry to require both conditions simultaneously:

```json
"meta_hints": [
  { "tags": "holiday/halloween", "date_range": "October 15 - November 1", "day_part": "late"}
]
```

Halloween content is only eligible during late-night hours within the October window. Outside that date range, or outside late hours, the tag is ignored.

### Multiple Entries

Each entry in the array is evaluated independently. A tag that appears in multiple entries is eligible whenever any of its entries match:

```json
"meta_hints": [
  { "tags": "bumps/kids", "day_part": "morning"},
  { "tags": "bumps/kids", "day_part": "daytime"}
]
```

Kids bumps are now available during both morning and daytime hours.

### Tags as a List

A single entry can apply to multiple tags at once by passing an array:

```json
"meta_hints": [
  { "tags": ["holiday/halloween", "seasons/autumn"], "date_range": "October 15 - November 1"}
]
```

Both folders enter the eligible pool under the same window. This is equivalent to two separate entries, one per tag.

### The exclusive Flag

By default, a matching entry adds its content to the eligible pool alongside anything else that would normally be available. Setting `"exclusive": true` changes that: when the conditions match, only the hinted content is eligible for that content type. Everything else is excluded for that window.

```json
"meta_hints": [
  { "tags": "bumps/kids", "day_part": "morning", "exclusive": true}
]
```

During morning hours, the scheduler pulls bumps exclusively from `bumps/kids`. The general bump pool is set aside until morning ends.

`exclusive` is most useful for themed blocks. A December holiday bump set with `exclusive` ensures nothing from the general bump folder surfaces in December. A late-night block with `exclusive` ensures daytime-style commercials never leak in after hours.

---

## Choosing an Approach

Both approaches restrict eligibility using the same underlying mechanism. The choice comes down to how your content is organized and where you prefer to keep configuration:

|                          | Folder hints                                | `meta_hints`                       |
|--------------------------|---------------------------------------------|------------------------------------|
| Setup                    | Rename or organize folders                  | Edit station config                |
| Best for                 | Content organized by season or time         | Content organized by show or type  |
| Multiple tags            | Each folder gets its own name               | One entry can cover several tags   |
| Rules visible in config  | No                                          | Yes                                |
| Requires catalog rebuild | Yes, when folders change                    | Yes, when tags change              |

The two approaches can be combined freely. A folder hint handles one set of seasonal content; `meta_hints` handles another. The scheduler applies both sets of rules at the same time.

---

## Complete Example

A channel that uses folder hints for its commercial library and `meta_hints` for show content and bumps:

```json
{
  "station_conf": {
    "network_name": "Classic TV",
    "channel_number": 4,
    "content_dir": "catalog/classic",
    "commercial_dir": "commercial",
    "bump_dir": "bump",
    "schedule_increment": 30,

    "meta_hints": [
      { "tags": "holiday/halloween",  "date_range": "October 15 - November 1"},
      { "tags": "holiday/christmas",  "date_range": "December 1 - December 26"},
      { "tags": "bumps/morning",      "day_part": "morning",   "exclusive": true},
      { "tags": "bumps/primetime",    "day_part": "prime",     "exclusive": true},
      { "tags": ["bumps/kids", "commercial/kids"], "day_part": "morning", "date_range": "September 1 - June 15"}
    ],

    "day_templates": {
      "weekday": {
        "7":  {"tags": "cartoons"},
        "12": {"tags": "movies"},
        "20": {"tags": "sitcoms"}
      }
    },

    "monday":    "weekday",
    "tuesday":   "weekday",
    "wednesday": "weekday",
    "thursday":  "weekday",
    "friday":    "weekday",
    "saturday":  "weekday",
    "sunday":    "weekday"
  }
}
```

The `commercial/` folder uses folder-based time-of-day hints internally:

```
catalog/classic/
└── commercial/
    ├── morning/        <- folder hint: 6am to 10am
    ├── prime/          <- folder hint: 5pm to 11pm
    └── general/        <- no hint: available at all times
```

The `meta_hints` block then adds holiday show content during its respective windows, time-specific bumps with `exclusive` so the general bump pool does not bleed in, and school-year kids content during mornings from September through mid-June.