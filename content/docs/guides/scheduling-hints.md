Title: Controlling When Content Plays
Slug: docs/guides/scheduling-hints
Summary: Use folder naming or meta_hints configuration to restrict when specific content is eligible to play, by month, date range, time of day, day of week, ISO week number, or a custom holiday you define yourself.

FieldStation42 gives you two tools for controlling when content is eligible to play. The first is folder-based hints: names you give to subfolders that FieldStation42 reads at catalog-build time to determine availability windows. The second is `meta_hints`: a block in your station config that expresses the same rules as JSON, without touching your folder structure.

Both work on the same principle. Content that is outside its availability window is simply not added to the eligible pool when the scheduler runs. No config changes are needed at schedule-build time; you set the rules once and they apply automatically.

The same hint vocabulary also appears in a third place: the `hint` field of a [marathon](/docs/guides/advanced-scheduling/), which decides whether a marathon is allowed to trigger.

## What Works Where

| Hint type      | Folder name                | `meta_hints` field | Marathon `hint`              |
|----------------|----------------------------|--------------------|------------------------------|
| Month          | `October`                  | `month`            | `"October"`                  |
| Quarter        | `Q4`                       | `quarter`          | `"Q4"`                       |
| Date range     | `December 1 - December 25` | `date_range`       | `"December 1 - December 25"` |
| Day of week    | `friday`                   | `day_of_week`      | `"friday"`                   |
| Time of day    | `morning`                  | `day_part`         | —                            |
| Week number    | `week number 20`           | `week_number`      | `"week number 20"`           |
| Custom holiday | `thanksgiving`             | `custom_holiday`   | `"thanksgiving"`             |

Every hint type works everywhere except one: a marathon's slot already fixes the hour, so a time-of-day hint would tell it nothing.

`meta_hints` fields are more forgiving about capitalization than folder names, because naming the field already says which hint you mean. `"month": "october"` and `"day_of_week": "Friday"` both work, while folders named `october/` or `Friday/` match nothing.

---

## Folder-Based Hints

Folder hints are the simplest option. Name a subfolder with a month, quarter, date range, time of day, day of the week, [week number, or custom holiday](#week-numbers-and-custom-holidays), and FieldStation42 restricts that folder's contents to the matching window automatically.

Folder names are matched exactly, and each kind of name expects its own capitalization:

| Folder name    | Casing                                        | Example              |
|----------------|-----------------------------------------------|----------------------|
| Month          | Capitalized                                   | `October`            |
| Day of week    | Lowercase                                     | `friday`             |
| Quarter        | Either                                        | `Q4` or `q4`         |
| Date range     | Either                                        | `December 1 - December 25` |
| Week number    | Either                                        | `week number 20`     |
| Time of day    | As named in your main config                  | `morning`            |
| Custom holiday | As named in your main config                  | `thanksgiving`       |

A folder whose name does not match any pattern is an ordinary folder with no restriction, so a capitalization mistake shows up as content that is always available rather than as an error.

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

An entry accepts these fields and no others:

| Field            | Purpose                                                       |
|------------------|---------------------------------------------------------------|
| `tags`           | Required. The tag or tags the entry applies to.               |
| `month`          | Restrict to a calendar month, such as `October`.               |
| `quarter`        | Restrict to `Q1`, `Q2`, `Q3`, or `Q4`.                         |
| `date_range`     | Restrict to a date window.                                     |
| `day_of_week`    | Restrict to a weekday, such as `friday`.                       |
| `day_part`       | Restrict to a part of the day.                                 |
| `week_number`    | Restrict to an [ISO week](#week-number).                       |
| `custom_holiday` | Restrict to a [holiday](#custom-holidays) named in main config. |
| `exclusive`      | When the entry matches, exclude everything else.               |

An unrecognized field name is rejected when the config loads, naming both the file and the field, so a typo fails at startup rather than quietly leaving content unrestricted.

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

Every entry whose tags cover a piece of content applies to it, and all of them must pass. Entries combine with AND, the same way multiple conditions inside a single entry do.

Tags match by path containment, so an entry on a parent folder also covers everything nested inside it. That is the usual way one file ends up under two entries:

```json
"meta_hints": [
  { "tags": "bumps",      "day_part": "morning"},
  { "tags": "bumps/kids", "date_range": "December 1 - December 25"}
]
```

Content in `bumps/kids` is covered by both entries, so it is eligible only on December mornings. Content elsewhere in `bumps` is covered by the first entry alone and is eligible every morning. Content outside `bumps` is covered by neither entry and is never restricted.

Because entries combine with AND, two entries on the same tag narrow it rather than widen it. A pair like `"day_part": "morning"` and `"day_part": "daytime"` on one tag can never be satisfied, since it asks for an hour that is in both windows at once. To widen a window, use a single entry with a day part that spans the range you want, or define a custom day part in your main config.

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

## Week Numbers and Custom Holidays

Two further hint types cover windows the ones above cannot express: a specific ISO week of the year, and a named date you define yourself. Both work in all three places — as folder names, in `meta_hints`, and in a [marathon](/docs/guides/advanced-scheduling/) `hint`.

### Week Number

A week number restricts content to a single ISO week, numbered 1 through 53.

As a folder name, use the full phrase:

```
catalog/retro_tv/
└── promos/
    └── week number 20/        <- Only plays during ISO week 20
        └── sweeps_promo.mp4
```

In `meta_hints`, use the `week_number` field, which takes the number on its own:

```json
"meta_hints": [
  { "tags": "promos/sweeps", "week_number": 20}
]
```

That field accepts `20`, `"20"`, and `"week number 20"` interchangeably. A marathon `hint` takes the full phrase:

```json
{"tags": "sweeps", "marathon": {"chance": 1.0, "count": 4, "hint": "week number 20"}}
```

The phrase is case-insensitive, so `week number 5`, `Week Number 5`, and `WEEK NUMBER 5` are equivalent, but the wording is fixed — `week 5` does not parse. Values outside 1 to 53 are not recognized.

ISO weeks start on Monday, and week 1 is the week containing the first Thursday of January. The calendar year and the ISO week year therefore disagree at the boundary, which is worth knowing before pinning content to week 1 or week 53:

| Date        | Day      | ISO week |
|-------------|----------|----------|
| 2025-12-29  | Monday   | 1        |
| 2026-01-01  | Thursday | 1        |
| 2026-01-05  | Monday   | 2        |
| 2026-12-28  | Monday   | 53       |

Week 1 content therefore starts playing on December 29 in 2025, not on January 1. Most years have only 52 ISO weeks, so week 53 content never plays at all in those years.

### Custom Holidays

A custom holiday names a recurring date once in your main config so you can refer to it by name everywhere else. Define them in the `custom_holidays` block of `confs/main_config.json`:

```json
{
  "custom_holidays": {
    "thanksgiving": "4th thursday november",
    "christmas": "December 25",
    "memorial_day": "last monday may",
    "station_anniversary": "September 30"
  }
}
```

Holiday values take one of two forms:

| Form            | Pattern                                        | Examples                                   |
|-----------------|------------------------------------------------|--------------------------------------------|
| Fixed date      | `<Month> <day>`                                 | `December 25`, `July 4`                    |
| Ordinal weekday | `<1st\|2nd\|3rd\|4th\|last> <weekday> <month>`  | `4th thursday november`, `last monday may` |

Values are case-insensitive, so `4th Thursday November` and `4th thursday november` both work. Month names must be spelled out in full; abbreviations are not recognized.

A fixed date means exactly that date. `December 25` plays on the 25th whatever weekday it falls on, weekends included. An ordinal holiday always resolves inside its own month — `4th thursday november` is Thursday, November 26 in 2026.

Once defined, use the name as a folder:

```
catalog/retro_tv/
└── specials/
    └── thanksgiving/          <- Only plays on Thanksgiving
        └── parade.mp4
```

in `meta_hints`:

```json
"meta_hints": [
  { "tags": "specials/parades", "custom_holiday": "thanksgiving"}
]
```

or as a marathon hint:

```json
{"tags": "parades", "marathon": {"chance": 1.0, "count": 8, "hint": "thanksgiving"}}
```

The holiday **name** is matched exactly, including case, in all three. A folder named `Thanksgiving` does not match a holiday defined as `thanksgiving`.

Holidays are defined globally rather than per channel, so every channel can use every name — and a folder matching one of those names is treated as a holiday folder in every catalog, not just the channel you had in mind.

A holiday name cannot be one that already means something else. Names like `October`, `Q4`, `friday`, `morning`, `pre`, `week number 20`, or anything shaped like a date range are rejected when main config loads, because folder names and marathon hints match a bare string and such a name would be ambiguous. Ordinary names like `thanksgiving` or `station_anniversary` are never affected.

### When a Hint Is Not Recognized

A mistyped hint leaves content **less** restricted than you intended rather than more, so the three mechanisms report it differently.

**`meta_hints` fails at startup.** An unrecognized field name is rejected when the station config loads, naming both the file and the fields it expected. The field for a custom holiday is `custom_holiday`, so this entry stops the station rather than quietly carrying no condition:

```json
{ "tags": "specials/parades", "holiday": "thanksgiving"}
```

**A marathon hint logs a warning and carries on.** Marathon hints live inside day templates and schedule overrides, so they are not checked when the config loads:

```json
"hint": "thanksigving"
```

That marathon fires on its `chance` value alone, on any day of the year, and says so in the log.

**A folder name that matches nothing is simply an ordinary folder.** That is deliberate, since most folders are not hints — which makes this the one case with no signal at all. If content is available when you expected it to be restricted, check the folder name against the casing table above.

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