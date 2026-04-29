Title: Advanced Scheduling Options
Slug: docs/guides/advanced-scheduling
Summary: Marathons, slot overrides, schedule timing, and advanced day templates.

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

Available video effects: `horizontal_line`, `diagonal_lines`, `static_overlay`, `pixel_block`, `color_inversion`, `severe_noise`, `wavy`, `random_block`, `chunky_scramble`, `spicy`, and `special_sauce`.

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

### Basic Usage

`date_overrides` is an object where each key is a date written as `"Month Day"` and each value is either a `day_template` name or an inline hour-slot definition. Reuse an existing template:

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

### How It Resolves

When the scheduler is building a day, it checks `date_overrides` first. If today's date has an entry, the scheduler uses that override for any hour defined in it. Hours not defined in the override fall back to the normal weekday schedule. If no date matches, scheduling works exactly as it did before.

In short: exact date matches win, and the weekday schedule is always the fallback.

### When to Use It

`date_overrides` shines for:

- **Holiday programming.** Christmas Day, Thanksgiving, July 4th, New Year's Eve.
- **One-off events.** A wrestling pay-per-view, the Super Bowl, a season finale block.
- **Anniversary specials.** A channel's birthday, the anniversary of a beloved show.
- **Surprise takeovers.** April Fools' Day stunts, themed marathons, fundraising blocks.

For seasonal programming that spans a range of dates, look at `active_rules` with `date_range` instead. That swaps in a whole alternate config file for the duration of the range. Use `date_overrides` when you only need to change one specific day.

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
