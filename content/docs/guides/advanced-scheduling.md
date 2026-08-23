Title: Advanced Scheduling Options
Slug: docs/guides/advanced-scheduling
Summary: Marathons, slot overrides, schedule timing, advanced day templates, and date and week schedule overrides.

This guide builds on the [Configure Stations](/docs/configure-stations/) step in the Getting Started section. If you haven't worked through that yet, start there first.

For the full technical specification of every configuration option, see [STATION_CONFIG_README.md](https://github.com/shane-mason/FieldStation42/blob/main/docs/STATION_CONFIG_README.md).

## Playing Shows in Order (Sequences)

By default, FieldStation42 picks a random video each time a show is scheduled. If you'd rather play episodes in order, add a `sequence` to any time slot:

```json
"20": {
  "tags": "star_trek",
  "sequence": "trek_nightly"
}
```

Each time this slot comes up, it plays the next episode in alphabetical order and remembers where it left off. You can run multiple independent sequences of the same show, split a series across time slots, and more.

The sequence name can be anything you choose (`"trek_nightly"`, `"sequence_1"`, `"my_queue"`), it just needs to be unique to that sequence. FieldStation42 tracks progress using the combination of the sequence name and the `tags` value, so two different shows can share a sequence name without interfering with each other. Any slot that uses the same name and tag pair will be treated as part of the same sequence.

For the full details, see the [Series in Sequence](/docs/guides/series-in-sequence/) guide.

## Random Marathon Events

Marathons randomly replace a time slot with multiple consecutive episodes of the same show. They add variety and surprise to your schedule.

### Basic Marathon

```json
"friday": {
  "20": {
    "tags": "twilight_zone",
    "marathon": {
      "chance": 0.2,
      "count": 4
    }
  }
}
```

`chance` is the probability (0.0 to 1.0) that a marathon happens on any given day. `count` is how many consecutive hours it takes over.

In this example, there's a 20% chance (about 1 in 5 Fridays) of a 4-hour Twilight Zone marathon from 8 PM to midnight. When it triggers, whatever was scheduled in hours 21, 22, and 23 gets replaced. On normal Fridays, just one random episode plays at 8 PM as usual.

### Marathons with Sequences

Combine marathons with sequences to play marathon episodes in order:

```json
"saturday": {
  "12": {
    "tags": "xfiles",
    "sequence": "xfiles_marathon_seq",
    "marathon": {
      "chance": 0.15,
      "count": 6
    }
  }
}
```

About 1 in 7 Saturdays, a 6-hour X-Files marathon plays from noon to 6 PM with episodes in sequential order. See the [Series in Sequence](/docs/guides/series-in-sequence/) guide for more on how sequences work.

Set `"chance": 1.0` to make a marathon always happen. This is useful for holiday programming or special event days.

### Seasonal Marathons

Use the `hint` field to restrict a marathon to a specific time of year or day of week. The hint accepts the same values as [scheduling hints](/docs/guides/scheduling-hints/):

```json
"saturday": {
  "12": {
    "tags": "horror",
    "marathon": {
      "chance": 1,
      "count": 6,
      "hint": "October 15 - October 31"
    }
  }
}
```

This marathon only triggers during October. Outside that window it behaves like a normal slot.

You can use any of the hint formats:

- **Month name:** `"hint": "October"` -- restricts to that calendar month
- **Quarter:** `"hint": "Q4"` -- restricts to Q1/Q2/Q3/Q4
- **Date range:** `"hint": "October 15 - October 31"` -- restricts to an explicit range, including across year boundaries
- **Day of week:** `"hint": "friday"` -- restricts to a specific day (use lowercase)
- **Week number:** `"hint": "week number 44"` -- restricts to a single ISO week, numbered 1 through 53
- **Custom holiday:** `"hint": "thanksgiving"` -- restricts to a date you name in the `custom_holidays` block of your main config

Note that an unrecognized hint string is ignored rather than treated as an error, which leaves the marathon running on its `chance` value with no date restriction at all. A misspelled holiday name is the usual cause, and a warning naming the unmatched string is written to the log.

See [Scheduling Hints](/docs/guides/scheduling-hints/) for the full details on each format.

### Planning Around Marathons

Marathons override whatever is scheduled in the following hours. If you have a marathon with `"count": 6` starting at hour 8, it replaces hours 8 through 13. Hour 14 and beyond are unaffected.

Some rules of thumb:

- **Low chance, long count** for rare events: `{"chance": 0.05, "count": 12}` creates a rare all-day marathon
- **Higher chance, short count** for frequent variety: `{"chance": 0.3, "count": 3}` creates frequent 3-hour events
- Weekends are a natural fit for marathons since viewers are more likely to tune in for extended periods

## Per-Slot Customization

Individual time slots can override your station-wide settings. This lets you create distinct programming blocks with different behavior.

### Random Tag Selection

Normally, multiple tags in a slot split the hour between them. If you'd rather pick one tag randomly for the full hour, use `random_tags`:

```json
"22": {
  "tags": ["drama/show1", "drama/show2", "drama/show3"],
  "random_tags": true
}
```

Without `random_tags`, this would split the hour into three 20-minute blocks. With it, one show is picked at random and gets the full hour.

### Per-Slot Schedule Increment

You can change the time block size for a specific hour:

```json
"15": {
  "tags": "short_shows",
  "schedule_increment": 15
}
```

This gives the 3 PM hour 15-minute blocks instead of the station's default. Pick values that divide evenly into 60 (5, 10, 15, 20, 30, or 60). Odd values like 7 or 13 will cause problems.

### Video and Audio Scramble Effects

Add visual effects to specific content, great for simulating "premium" scrambled channels:

```json
"21": {
  "tags": "premium_content",
  "video_scramble_fx": "color_inversion"
}
```

Available video effects:

- `horizontal_line`
- `diagonal_lines`
- `static_overlay`
- `pixel_block`
- `color_inversion`
- `severe_noise`
- `wavy`
- `random_block`
- `chunky_scramble`
- `spicy`
- `special_sauce`
- `glitchtastic`

You can also scramble audio with `audio_scramble_fx`. The `special_sauce` audio effect pairs with the matching video effect to produce an authentic scrambled cable look and sound:

```json
"21": {
  "tags": "premium_content",
  "video_scramble_fx": "special_sauce",
  "audio_scramble_fx": "special_sauce"
}
```

Video and audio effects can be set independently; you don't have to use them together.

To disable either effect for a specific slot (even if it's set station-wide):

```json
"9": {
  "tags": "free_preview",
  "video_scramble_fx": false,
  "audio_scramble_fx": false
}
```

New presets are defined in `fs42/station_player.py` as mpv filters and then referenced by name from a station config. See [STATION_CONFIG_README.md](https://github.com/shane-mason/FieldStation42/blob/main/docs/STATION_CONFIG_README.md#video-effects) for descriptions of each effect.

## Reusable Configuration Blocks (Slot Overrides)

Once you start customizing individual time slots, your config can get repetitive. Slot overrides let you define a block of settings once and reuse it across your schedule.

### Creating and Using Overrides

Define your reusable blocks in `slot_overrides`, then reference them with `"overrides"` in any time slot:

```json
{
  "station_conf": {
    "network_name": "My Channel",
    "channel_number": 5,

    "slot_overrides": {
      "kids_block": {
        "schedule_increment": 15,
        "break_strategy": "standard"
      },
      "primetime": {
        "schedule_increment": 60
      }
    },

    "saturday": {
      "8": {
        "tags": "cartoons",
        "overrides": "kids_block"
      },
      "20": {
        "tags": "drama",
        "overrides": "primetime"
      }
    }
  }
}
```

All the properties from the named override are applied to the time slot. You can put any slot property in an override except `tags` (those must be set directly on the time slot).

Properties you set directly on the time slot take precedence over the override, so you can use an override as a base and customize from there:

```json
"23": {
  "tags": "adult_swim",
  "overrides": "adult_swim_block",
  "marathon": {"chance": 0.2, "count": 4}
}
```

This gets all the settings from `adult_swim_block` plus adds a marathon.

### Overrides for Bumps and Commercials

Slot overrides are especially useful for customizing bumps and commercials across programming blocks. You can include `bump_dir`, `commercial_dir`, `start_bump`, `end_bump`, and `break_strategy` in your overrides:

```json
"slot_overrides": {
  "kids_block": {
    "commercial_dir": "kids_commercials",
    "bump_dir": "kids_bumps",
    "break_strategy": "standard"
  },
  "late_night": {
    "start_bump": "caps/latenight_start.mp4",
    "end_bump": "caps/latenight_end.mp4",
    "bump_dir": "latenight_bumps",
    "break_strategy": "end"
  }
}
```

For details on how these settings work, see the [Bumps and Commercials](/docs/guides/bumps-and-commercials/) guide.

### Example: Programming Blocks

Here's a more complete example showing how overrides and templates work together:

```json
{
  "station_conf": {
    "network_name": "Variety Network",
    "channel_number": 10,
    "content_dir": "catalog/variety",

    "slot_overrides": {
      "morning_news": {
        "commercial_dir": "news_commercials",
        "break_strategy": "center",
        "schedule_increment": 60
      },
      "kids_block": {
        "commercial_dir": "kids_commercials",
        "bump_dir": "kids_bumps",
        "break_strategy": "standard"
      },
      "primetime_drama": {
        "bump_dir": "primetime_bumps",
        "break_strategy": "standard",
        "commercial_dir": "premium_commercials"
      },
      "late_night": {
        "start_bump": "caps/latenight_start.mp4",
        "end_bump": "caps/latenight_end.mp4",
        "bump_dir": "latenight_bumps",
        "break_strategy": "end"
      }
    },

    "day_templates": {
      "weekday": {
        "6": {"tags": "news", "overrides": "morning_news"},
        "7": {"tags": "news", "overrides": "morning_news"},
        "16": {"tags": "cartoons", "overrides": "kids_block"},
        "20": {"tags": "drama", "overrides": "primetime_drama"},
        "23": {"tags": "comedy", "overrides": "late_night"}
      }
    },

    "monday": "weekday",
    "tuesday": "weekday",
    "wednesday": "weekday",
    "thursday": "weekday",
    "friday": "weekday",
    "saturday": {},
    "sunday": {}
  }
}
```

## Fine-Tuning Schedule Timing

The `schedule_increment` setting controls how shows fit into time blocks. It's set station-wide but can be overridden per slot.

Here's how different increment values affect scheduling:

| Show Length | `schedule_increment: 30` | `schedule_increment: 5` | `schedule_increment: 0` |
|-------------|--------------------------|-------------------------|-------------------------|
| 22 min      | Buffered to 30 min       | Buffered to 25 min      | Plays as 22 min         |
| 47 min      | Buffered to 60 min       | Buffered to 50 min      | Plays as 47 min         |
| 78 min      | Buffered to 90 min       | Buffered to 80 min      | Plays as 78 min         |

"Buffered" means the show plays, then bumps and commercials fill the remaining time until the next increment.

### Choosing the Right Increment

**30 minutes** (the default) works like traditional TV. Shows fit into 30, 60, 90, or 120 minute blocks. Great for classic sitcoms and dramas.

**5 minutes** gives you tighter timing with less padding. Movies end closer to their actual runtime. Good for commercial-light or movie-focused channels.

**0 (continuous)** means shows play back-to-back with no buffering at all. No time-block alignment, no breaks. Good for commercial-free or playlist-style channels.

### Mixing Increments

You can use different increments for different parts of the day:

```json
"day_templates": {
  "weekday": {
    "6": {"tags": "news", "schedule_increment": 60},
    "9": {"tags": "sitcoms", "schedule_increment": 30},
    "12": {"tags": "movies", "schedule_increment": 5},
    "20": {"tags": "binge_block", "schedule_increment": 0}
  }
}
```

Morning news gets full hour-long blocks, sitcoms get half-hours, movies get tight 5-minute timing, and the evening binge block plays continuously with no breaks.

## Advanced Day Templates

The [Configure Stations](/docs/configure-stations/) guide covers the basics of day templates. Here are some more advanced techniques.

### One Day Needs a Different Schedule

Templates are all-or-nothing. You can't use a template and then override just one hour. If Wednesday needs a special event at 2 PM but is otherwise identical to your weekday template, create a separate template:

```json
{
  "day_templates": {
    "weekday": {
      "9": {"tags": "sitcoms"},
      "12": {"tags": "movies"},
      "20": {"tags": "drama"}
    },
    "wednesday_special": {
      "9": {"tags": "sitcoms"},
      "12": {"tags": "movies"},
      "14": {"tags": "special_event"},
      "20": {"tags": "drama"}
    }
  },

  "monday": "weekday",
  "tuesday": "weekday",
  "wednesday": "wednesday_special",
  "thursday": "weekday",
  "friday": "weekday"
}
```

### Many Templates

You can have as many templates as you need. Different schedules for holidays, sports days, special events:

```json
{
  "day_templates": {
    "standard_weekday": {
      "9": {"tags": "sitcoms"},
      "20": {"tags": "drama"}
    },
    "standard_weekend": {
      "10": {"tags": "cartoons"},
      "20": {"tags": "movies"}
    },
    "holiday": {
      "12": {"tags": "holiday_specials", "marathon": {"chance": 1.0, "count": 8}}
    },
    "sports_day": {
      "18": {"tags": "sports"},
      "19": {"tags": "sports"},
      "20": {"tags": "sports"}
    }
  }
}
```

### Templates with Slot Overrides

Templates and slot overrides work together naturally:

```json
{
  "slot_overrides": {
    "news_hour": {
      "commercial_dir": "news_commercials",
      "schedule_increment": 60
    },
    "kids_hour": {
      "commercial_dir": "kids_commercials",
      "bump_dir": "kids_bumps"
    }
  },

  "day_templates": {
    "weekday": {
      "6": {"tags": "news", "overrides": "news_hour"},
      "16": {"tags": "cartoons", "overrides": "kids_hour"},
      "20": {"tags": "drama"}
    }
  },

  "monday": "weekday",
  "tuesday": "weekday",
  "wednesday": "weekday",
  "thursday": "weekday",
  "friday": "weekday"
}
```

All weekdays get the same schedule, with consistent bump and commercial settings applied through overrides.

## Date-Specific Schedule Overrides

Sometimes you want a particular calendar date to look nothing like the regular weekday schedule. A Christmas Day movie marathon, a New Year's Eve countdown, an annual sports special. The `date_overrides` field lets you replace the normal schedule on specific dates without having to juggle templates or rewrite your weekday lineup.

There are two calendar-based override fields, and they work as a pair. `date_overrides` applies **one day** of programming to every date it matches. [`week_overrides`](#week-schedule-overrides) applies **a whole week** of programming across a range of dates, keeping the weekdays distinct from one another. Start with `date_overrides` below, then read the week section to see how they layer.

### Basic Usage

`date_overrides` is an object where each key is either an exact date or a date range, and each value is either a `day_template` name or an inline hour-slot definition. Exact dates use `"Month Day"` format; date ranges use `"Month Day - Month Day"`. Reuse an existing template:

```json
{
  "day_templates": {
    "christmas_day": {
      "0": {"tags": "christmas_movie"},
      "8": {"tags": "christmas_movie"},
      "12": {"tags": "christmas_movie"},
      "20": {"tags": "christmas_movie"}
    }
  },
  "date_overrides": {
    "December 25": "christmas_day"
  }
}
```

Or define the override inline without a template:

```json
"date_overrides": {
  "December 25": {
    "0": {"tags": "christmas_movie"},
    "1": {"tags": "christmas_movie"},
    "2": {"tags": "christmas_movie"},
    "3": {"event": "signoff"}
  }
}
```

The structure of an inline override is identical to a normal weekday, so anything you can put in a weekday slot (tags, sequences, marathons, slot overrides) works here too.

### Partial Overrides

You don't have to redefine the whole day. Only the hours you specify get replaced. Every other hour keeps its normal weekday schedule:

```json
"date_overrides": {
  "April 23": {
    "20": {"tags": "wwf"},
    "21": {"tags": "wcw"}
  }
}
```

On April 23, only 8 PM and 9 PM change. The morning, afternoon, and late-night hours play whatever the regular weekday schedule has scheduled.

### Date Ranges

Instead of a single date, a key can span multiple days:

```json
"date_overrides": {
  "April 23 - April 25": {
    "20": {"tags": "wrestling"},
    "21": {"tags": "wrestling"}
  }
}
```

This applies the same override to April 23, April 24, and April 25. The range is inclusive on both ends.

Ranges wrap around the year boundary, so you can cover holiday runs without splitting them into two entries:

```json
"date_overrides": {
  "December 24 - January 2": "holiday_marathon"
}
```

That override is active from December 24 through January 2 of the following year.

Notice what a range does *not* do: it is weekday-blind. Every date it covers gets the identical hour schedule, so a Monday and a Saturday inside the range look exactly the same. That is precisely what you want for a holiday run, and rarely what you want for a season. When the weekdays need to stay different from one another, reach for `week_overrides`.

### How It Resolves

When the scheduler is building a day, it checks `date_overrides` first. If today's date matches an entry, either exactly or because it falls within a range, the scheduler uses that override for any hour defined in it. Hours not defined in the override fall back to the normal weekday schedule. If no date matches, scheduling works exactly as it did before.

In short: date matches win, and the weekday schedule is always the fallback. The full picture, once week overrides are in play, is in [How Overrides Layer](#how-overrides-layer) below.

Dates are validated when the config is loaded. An impossible date like `"April 31"` raises a Configuration Error immediately rather than silently never matching during scheduling.

### When to Use It

`date_overrides` shines for:

- **Holiday programming.** Christmas Day, Thanksgiving, July 4th, New Year's Eve.
- **One-off events.** A wrestling pay-per-view, the Super Bowl, a season finale block.
- **Anniversary specials.** A channel's birthday, the anniversary of a beloved show.
- **Surprise takeovers.** April Fools' Day stunts, themed marathons, fundraising blocks.

For seasonal programming that needs a completely different config for weeks or months, look at `active_rules` with `date_range` instead. That swaps in a whole alternate config file for the duration of the range. Use `date_overrides` when you want to adjust specific hours on one day or across a short span of dates without replacing your whole configuration.

## Week Schedule Overrides

`week_overrides` swaps in a different **week** of programming for a range of dates, then goes back to normal automatically. Use it for anything seasonal: a summer schedule, sweeps week, a holiday fortnight, a themed marathon week.

Where a `date_overrides` range flattens every date into the same lineup, a week override keeps the weekday structure intact, so Saturday can still look different from Tuesday inside the range.

### Quick Example

Summer programming from June 21 through September 1, with a different weekend:

```json
"week_overrides": {
  "June 21 - September 1": {
    "monday":    {"6": {"tags": "summer_morning"}, "20": {"tags": "summer_movie"}},
    "tuesday":   {"6": {"tags": "summer_morning"}, "20": {"tags": "summer_movie"}},
    "wednesday": {"6": {"tags": "summer_morning"}, "20": {"tags": "summer_movie"}},
    "thursday":  {"6": {"tags": "summer_morning"}, "20": {"tags": "summer_movie"}},
    "friday":    {"6": {"tags": "summer_morning"}, "20": {"tags": "summer_movie"}},
    "saturday":  {"8": {"tags": "cartoons"},       "20": {"tags": "creature_feature"}},
    "sunday":    {"8": {"tags": "cartoons"},       "20": {"tags": "summer_movie"}}
  }
}
```

For those ten weeks the station runs the summer schedule. On September 2 it returns to the normal weekly schedule with no further configuration.

### Date Keys

Keys are a single date or an inclusive date range, using full month names, exactly like `date_overrides`:

```json
"July 4"                      // single date
"June 21 - September 1"       // range
"December 24 - January 2"     // wraps the year boundary
```

The separator is a spaced hyphen (` - `). Years are never part of the key, so a range applies every year. Ranges that wrap from December into January are handled correctly.

If two ranges overlap, **the first one listed in the config file wins**. Order your entries from most specific to least specific if you rely on this.

### Week Schedules

The value for a date key is an object keyed by lowercase day names. Each day is either an object of hour slots, or the name of a day template:

```json
"week_overrides": {
  "November 20 - November 27": {
    "thursday": {"12": {"tags": "parade"}, "16": {"tags": "football"}},
    "friday":   "holiday_shopping"
  }
}
```

Valid day keys are `monday` through `sunday`, lowercase. Anything else, including a capitalized `Monday`, is a configuration error rather than being silently ignored.

Hour keys are strings, `"0"` through `"23"`, exactly as in a normal day schedule. Slots accept all the usual properties (`tags`, `bump_dir`, `commercial_dir`, `sequence`, `marathon`, and so on).

Any tags referenced inside a week override are picked up by the catalog scan, so their content gets indexed like anything else. Sequences declared in override slots are scanned too.

### Partial Weeks and Fallthrough

A week override is a patch over your normal schedule, not a replacement for it, and **precedence is evaluated per hour, not per day**. This matters more than it sounds. Given:

```json
"monday": {"6": {"tags": "morning"}, "20": {"tags": "primetime"}},
"week_overrides": {
  "July 1 - July 7": {
    "monday": {"20": {"tags": "firefly"}}
  }
}
```

On Monday July 6, hour 20 is `firefly`, but hour 6 is still `morning`, inherited from the regular Monday schedule. Likewise, any day you leave out of the week schedule runs entirely normally: omit `sunday` and Sundays are untouched.

If you want an hour to be **off air** during an override week, you cannot simply omit it, because the normal schedule will show through. Define the full day explicitly instead.

### Using Day Templates

Day templates work inside week overrides, which keeps repetitive weeks readable:

```json
"day_templates": {
  "summer_weekday": {
    "6":  {"tags": "summer_morning"},
    "20": {"tags": "summer_movie"}
  },
  "summer_weekend": {
    "8":  {"tags": "cartoons"},
    "20": {"tags": "creature_feature"}
  }
},
"week_overrides": {
  "June 21 - September 1": {
    "monday":    "summer_weekday",
    "tuesday":   "summer_weekday",
    "wednesday": "summer_weekday",
    "thursday":  "summer_weekday",
    "friday":    "summer_weekday",
    "saturday":  "summer_weekend",
    "sunday":    "summer_weekend"
  }
}
```

Templates referenced from a week override are copied, not shared, so they can be safely reused by your regular weekday schedule at the same time.

### Slot Overrides in Week Overrides

Slots inside a week override can reference a `slot_overrides` definition, same as a normal slot:

```json
"slot_overrides": {
  "movie_night": {"break_strategy": "standard", "marathon": true}
},
"week_overrides": {
  "October 25 - October 31": {
    "friday": {"20": {"tags": "horror", "overrides": "movie_night"}}
  }
}
```

The overridable properties are the same set allowed anywhere else, listed in the [Station Configuration Reference](/docs/reference/station-config/#slot-overrides).

### Continued Slots

`continued` works inside a week override, inheriting tags from the previous slot in that same override week:

```json
"week_overrides": {
  "July 1 - July 7": {
    "monday": {
      "20": {"tags": "long_movie"},
      "21": {"continued": true}
    }
  }
}
```

**Limitation:** a `continued` slot can only inherit from another slot *within the same week override*. It cannot inherit across the fallthrough boundary from your regular schedule. This fails:

```json
"monday": {"20": {"tags": "primetime"}},
"week_overrides": {
  "July 1 - July 7": {
    "monday": {"21": {"continued": true}}
  }
}
```

Hour 21 has no preceding tagged slot inside the override, so it raises a configuration error at startup rather than silently producing a slot with no content. Define the tags explicitly, or include the preceding hour in the override.

## How Overrides Layer

Both override types coexist. When the scheduler resolves a given hour, it checks in this order:

1. **`date_overrides`**, an exact-date entry matching today
2. **`week_overrides`**, a week entry whose range contains today, at today's weekday
3. The **regular weekday schedule**
4. Off air, if none of the above define that hour

Narrower beats broader. This is what makes the common case work: run a themed week, then punch a single day through it.

```json
"week_overrides": {
  "July 1 - July 7": {
    "monday":    {"20": {"tags": "firefly"}},
    "tuesday":   {"20": {"tags": "firefly"}},
    "wednesday": {"20": {"tags": "firefly"}},
    "thursday":  {"20": {"tags": "firefly"}},
    "friday":    {"20": {"tags": "firefly"}},
    "saturday":  {"20": {"tags": "firefly"}},
    "sunday":    {"20": {"tags": "firefly"}}
  }
},
"date_overrides": {
  "July 4": {"20": {"tags": "jaws"}}
}
```

Firefly runs at 8 PM all week, except July 4th, which shows Jaws.

### Choosing Between Them

Both fields are keyed by a date or range, so the names are easy to confuse. The difference is the shape of the value, and therefore whether weekday matters.

| | `date_overrides` | `week_overrides` |
|---|---|---|
| Key | date or range | date or range |
| Value | one day of hour slots | seven days of hour slots |
| Weekday-aware inside a range? | No | Yes |
| Precedence | Highest | Middle |

Rule of thumb: **a single special day goes in `date_overrides`. A stretch of time that should still feel like a normal week goes in `week_overrides`.**

Strictly, `week_overrides` can express anything `date_overrides` can (set all seven days identically), but `date_overrides` is far less typing for the single-day case.

### Validation

Configuration problems in either field are reported at startup with the offending entry named. Impossible dates like `"April 31"`, misspelled or capitalized day keys, unknown template and slot override names, and `continued` slots with nothing to inherit from all fail immediately rather than at scheduling time. The full error table is in the [Station Configuration Reference](/docs/reference/station-config/#override-resolution-order).

The JSON schema in `fs42/station_config_schema.json` covers `week_overrides` too, so schema validation catches most structural mistakes before the station starts.

## Complete Example

Here's a full configuration that pulls together marathons, slot overrides, per-slot timing, and day templates:

```json
{
  "station_conf": {
    "network_name": "Advanced TV Network",
    "channel_number": 42,
    "content_dir": "catalog/advanced_content",
    "commercial_dir": "commercial",
    "bump_dir": "bump",

    "schedule_increment": 30,
    "break_strategy": "standard",
    "commercial_free": false,

    "standby_image": "runtime/standby.png",
    "off_air_video": "runtime/off_air.mp4",

    "slot_overrides": {
      "morning_news": {
        "commercial_dir": "news_commercials",
        "break_strategy": "center",
        "schedule_increment": 60
      },
      "kids_block": {
        "commercial_dir": "kids_commercials",
        "bump_dir": "kids_bumps",
        "break_strategy": "standard"
      },
      "adult_swim": {
        "start_bump": "caps/as_start.mp4",
        "end_bump": "caps/as_end.mp4",
        "bump_dir": "as_bumps",
        "commercial_dir": "as_commercials",
        "break_strategy": "end"
      },
      "primetime": {
        "bump_dir": "primetime_bumps",
        "commercial_dir": "primetime_commercials"
      }
    },

    "day_templates": {
      "weekday": {
        "6": {"tags": "news", "overrides": "morning_news"},
        "9": {"tags": "sitcoms", "sequence": "morning_sitcom_seq"},
        "12": {"tags": "movies", "schedule_increment": 5},
        "16": {"tags": "cartoons", "overrides": "kids_block"},
        "17": {"tags": "xfiles", "sequence": "xfiles_daily", "sequence_start": 0.0, "sequence_end": 0.75},
        "20": {"tags": "drama", "overrides": "primetime", "sequence": "primetime_drama_seq"},
        "21": {"tags": "drama", "overrides": "primetime", "sequence": "primetime_drama_seq"},
        "22": {"tags": "adult_swim", "overrides": "adult_swim"},
        "23": {"tags": "adult_swim", "overrides": "adult_swim"}
      },
      "weekend": {
        "8": {"tags": "saturday_cartoons", "overrides": "kids_block", "marathon": {"chance": 0.25, "count": 6}},
        "14": {"tags": "movies", "schedule_increment": 5},
        "18": {"tags": "movies", "schedule_increment": 5},
        "21": {"tags": "xfiles", "sequence": "xfiles_weekend", "sequence_start": 0.75, "sequence_end": 1.0, "marathon": {"chance": 0.15, "count": 4}}
      },
      "friday_special": {
        "6": {"tags": "news", "overrides": "morning_news"},
        "9": {"tags": "sitcoms", "sequence": "morning_sitcom_seq"},
        "12": {"tags": "movies", "schedule_increment": 5},
        "16": {"tags": "cartoons", "overrides": "kids_block"},
        "20": {"tags": "comedy", "overrides": "primetime"},
        "21": {"tags": "scifi", "overrides": "primetime", "sequence": "scifi_friday_seq"},
        "22": {"tags": "scifi", "overrides": "primetime", "sequence": "scifi_friday_seq"},
        "23": {"tags": "horror", "start_bump": "caps/horror_start.mp4", "marathon": {"chance": 0.3, "count": 5}}
      }
    },

    "monday": "weekday",
    "tuesday": "weekday",
    "wednesday": "weekday",
    "thursday": "weekday",
    "friday": "friday_special",
    "saturday": "weekend",
    "sunday": "weekend"
  }
}
```

### What This Configuration Does

**Weekdays (Mon-Thu):** News at 6 AM with centered commercials, sequential sitcoms at 9 AM, movies at noon with tight 5-minute timing, kids block at 4 PM, X-Files daily (older episodes) at 5 PM, primetime drama in sequence at 8 and 9 PM, and Adult Swim with custom bumps at 10 and 11 PM.

**Friday:** Same mornings, but primetime switches to comedy at 8 PM, Sci-Fi Friday in sequence at 9 and 10 PM, and horror movies at 11 PM with a 30% chance of a 5-hour marathon.

**Weekends:** Saturday cartoons at 8 AM with a 25% chance of a 6-hour marathon, movies in the afternoon and evening, and X-Files (newer episodes) at 9 PM with a 15% chance of a 4-hour marathon.

## Tips for Complex Configurations

**Start simple.** Get a basic schedule working with tags, then add day templates, then slot overrides, then sequences and marathons. Don't try everything at once.

**Use descriptive names.** `saturday_morning_kids` is much easier to maintain than `override1`. Same goes for sequence names and templates.

**Group related settings.** Keep kids overrides together, news overrides together, primetime overrides together. It makes your config easier to scan.

**Match your folders to your config.** If you have a `kids_block` override that references `kids_commercials` and `kids_bumps`, make sure those folders exist in your `content_dir`.

**Test one feature at a time.** Add a new feature to one time slot, run the station, verify it works, then expand to other slots.

**Keep backups.** Before making big changes, copy your config file so you can roll back if something breaks.
