Title: Advanced Scheduling Options
Slug: docs/guides/advanced-scheduling
Summary: Sequences, marathons, slot overrides, and fine-grained schedule timing for power users.

This guide builds on the [Station Configuration Guide](/docs/configure-stations/) and covers advanced scheduling features for power users. If you haven't read the basic guide yet, start there first.

**What you'll learn here:**

- Playing shows in sequential order (sequences)
- Creating random multi-episode events (marathons)
- Reusing configuration blocks (slot overrides)
- Per-slot customization (bumps, commercials, effects)
- Fine-tuning schedule timing

NOTE: While this is an extensive document, it still doesn't cover all the configuration options available. For a more detailed view, please see [STATION_CONFIG_README.md](https://github.com/shane-mason/FieldStation42/blob/main/docs/STATION_CONFIG_README.md)

---

## Table of Contents

1. [Playing Shows in Order (Sequences)](#playing-shows-in-order-sequences)
2. [Random Marathon Events](#random-marathon-events)
3. [Customizing Individual Time Slots](#customizing-individual-time-slots)
4. [Reusable Configuration Blocks](#reusable-configuration-blocks-slot-overrides)
5. [Fine-Tuning Schedule Timing](#fine-tuning-schedule-timing)
6. [Advanced Day Templates](#advanced-day-templates)
7. [Auto-Bumps](#automatic-bumps)
8. [Complete Advanced Example](#complete-advanced-example)

---

## Playing Shows in Order (Sequences)

By default, FieldStation42 picks a **random** video from a folder each time. Sequences let you play episodes **in order** instead.

### Basic Sequence

To play shows sequentially, add a `sequence` name to your time slot:

```json
"monday": {
  "20": {
    "tags": "star_trek",
    "sequence": "trek_sequential"
  }
}
```

*This is a snippet showing a single time slot.*

**How it works:**

- Videos in `catalog/your_content/star_trek/` are sorted alphabetically
- Each day at 8 PM, the next episode plays
- When the sequence reaches the last episode, it loops back to the first
- The sequence position is saved, so it remembers where it left off

**File naming tip:** Name your files so they sort correctly:

```
star_trek/
├── S01E01 - The Cage.mp4
├── S01E02 - Where No Man Has Gone Before.mp4
├── S01E03 - The Corbomite Maneuver.mp4
...
```

### Multiple Sequences of the Same Show

You can run **different sequences** of the same show on different days or times by using different sequence names:

```json
"monday": {
  "17": {
    "tags": "star_trek",
    "sequence": "afternoon_trek"
  },
  "20": {
    "tags": "star_trek",
    "sequence": "primetime_trek"
  }
}
```

*This is a snippet showing two time slots with different sequences.*

Each sequence name tracks its position independently. The afternoon showing and primetime showing will be on different episodes.

### Sequence Start and End Points

Play only **part of a series** by setting start and end percentages (0.0 to 1.0):

```json
"weekday_day": {
  "17": {
    "tags": "xfiles",
    "sequence": "daily_xfiles",
    "sequence_start": 0.0,
    "sequence_end": 0.75
  }
},
"friday_prime": {
  "21": {
    "tags": "xfiles",
    "sequence": "primetime_xfiles",
    "sequence_start": 0.75,
    "sequence_end": 1.0
  }
}
```

*This is a snippet showing sequence templates.*

**What this does:**

- **Daily at 5 PM:** Plays episodes from the first 75% of X-Files (older episodes)
- **Friday at 9 PM:** Plays episodes from the final 25% of X-Files (newer episodes)

**Understanding percentages:**

- `0.0` = first episode
- `0.5` = halfway through the series
- `1.0` = last episode
- If you have 100 episodes:
  - `0.0` to `0.75` = episodes 1-75
  - `0.75` to `1.0` = episodes 76-100

**Use cases:**

- Play classic seasons during the day, recent seasons at night
- Create a "Best Of" sequence with selected episodes
- Run multiple airings at different points in a long series

### Sequences with Nested Folders

Sequences work with **nested folder structures**. All videos are collected recursively:

```
star_trek/
├── season_1/
│   ├── ep01.mp4
│   └── ep02.mp4
├── season_2/
│   ├── ep01.mp4
│   └── ep02.mp4
```

A sequence on `"tags": "star_trek"` will find all episodes in all subfolders and sort them alphabetically by their full path.

### Important Notes

- Sequence names can be anything: `"my_sequence"`, `"primetime"`, `"weekday_show"`
- Sequences are tracked **per station** - each channel has its own sequence state
- If you change the `sequence_start` or `sequence_end` values, the sequence resets
- Sequences always loop when they reach the end

**For more details:** See the [Playing Series in Sequence](/docs/guides/series-in-sequence/) guide.

---

## Random Marathon Events

Marathons let you randomly replace a time slot with **multiple consecutive episodes** of the same show.

### Basic Marathon

Add a `marathon` object with two properties:

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

*This is a snippet showing a single time slot with marathon.*

**How it works:**

- **chance**: Probability of marathon (0.0-1.0)
  - `0.2` = 20% chance = about 1 in 5 Fridays
  - `0.1` = 10% chance = about 1 in 10 Fridays
  - `0.5` = 50% chance = about half the time
- **count**: How many consecutive hours to take over
  - `4` = marathon takes over 4 hours (8 PM - midnight in this example)

**What happens:**

- On most Fridays: Normal schedule plays (one random Twilight Zone episode at 8 PM)
- On marathon Fridays: 4 consecutive Twilight Zone episodes play from 8 PM to midnight
- The marathon **overrides** whatever was scheduled in hours 21, 22, and 23

### Marathons with Sequences

Combine marathons with sequences to play episodes **in order** during the marathon:

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

*This is a snippet showing a marathon with sequential episodes.*

**Result:** About 1 in 7 Saturdays, a 6-hour X-Files marathon plays from noon to 6 PM, with episodes in sequential order.

### Marathon with Sequence Ranges

For special events, combine sequence ranges with marathons:

```json
"holiday_schedule": {
  "18": {
    "tags": "christmas_specials",
    "sequence": "xmas_marathon",
    "sequence_start": 0.0,
    "sequence_end": 1.0,
    "marathon": {
      "chance": 1.0,
      "count": 8
    }
  }
}
```

*This is a snippet showing a guaranteed marathon on specific days.*

**Using `chance: 1.0`** means the marathon **always** happens - useful for holiday programming or special events.

### Planning Around Marathons

**Important:** Marathons override whatever is scheduled in the following hours. Plan accordingly:

```json
"saturday": {
  "8": {
    "tags": "cartoons",
    "marathon": {"chance": 0.25, "count": 6}
  },
  "9": {"tags": "cartoons"},
  "10": {"tags": "cartoons"},
  "11": {"tags": "cartoons"},
  "12": {"tags": "cartoons"},
  "13": {"tags": "cartoons"},
  "14": {"tags": "movies"}
}
```

*This is a snippet showing marathon override range.*

When the marathon triggers, hours 9-13 are replaced with the marathon content. Hour 14 (2 PM) and beyond are unaffected.

### Marathon Strategy Tips

- **Low chance, long count** for rare mega-events: `{"chance": 0.05, "count": 12}` = rare all-day marathon
- **Higher chance, short count** for frequent mini-marathons: `{"chance": 0.3, "count": 3}` = frequent 3-hour events
- Use marathons on **weekends** to create variety without complex scheduling
- Combine with sequences for shows that are better watched in order

---

## Customizing Individual Time Slots

Time slots can override station-wide settings to create special programming blocks with unique behavior.

### Custom Bumps for Specific Shows

Play **specific bump videos** at the start or end of a time slot:

```json
"20": {
  "tags": "adult_swim",
  "start_bump": "caps/as_start.mp4",
  "end_bump": "caps/as_end.mp4"
}
```

*This is a snippet showing a single time slot with custom bumps.*

**How it works:**

- **start_bump**: Plays before the show starts (like a title card)
- **end_bump**: Plays after the show ends (like an outro)
- Paths are relative to your `content_dir`
- If `start_bump` or `end_bump` are directories, a random video from those directory will be selected.

**Important:** Store these bumps in a **separate folder** (like `caps/`) that's not used as a tag, otherwise they might play randomly during other programming.

### Wrapping a Multi-Hour Block

Wrap an entire programming block with bumps:

```json
"20": {
  "tags": "adult_swim",
  "start_bump": "caps/as_start.mp4"
},
"21": {"tags": "adult_swim"},
"22": {"tags": "adult_swim"},
"23": {
  "tags": "adult_swim",
  "end_bump": "caps/as_end.mp4"
}
```

*This is a snippet showing a multi-hour block with start and end bumps.*

**Result:** Opening bump at 8 PM, 4 hours of Adult Swim content, closing bump at midnight.

### Custom Commercial/Bump Directories Per Slot

Use **different commercials or bumps** for specific programming blocks:

```json
"saturday": {
  "8": {
    "tags": "saturday_cartoons",
    "commercial_dir": "kids_commercials",
    "bump_dir": "saturday_morning_bumps"
  }
}
```

*This is a snippet showing custom directories for a time slot.*

**Use cases:**

- Kids commercials during children's programming
- Themed bumps for special programming blocks (holiday, sports, etc.)
- Different ad content for different target audiences

**Important:** These directories are still relative to your `content_dir`:

```
catalog/my_content/
├── saturday_cartoons/
├── kids_commercials/
├── saturday_morning_bumps/
```

### Custom Break Strategy Per Slot

Override where commercials are placed for individual shows:

```json
"21": {
  "tags": "classic_movies",
  "break_strategy": "center"
}
```

*This is a snippet showing custom break placement.*

**Options:**

- `"standard"`: Commercials spread throughout (station default)
- `"end"`: All commercials at the end (good for short shows)
- `"center"`: One big break in the middle (good for movies with intermission)

### Random Tag Selection

If you have **multiple tags** in a slot, normally they split the hour. Use `random_tags` to pick one randomly instead:

```json
"22": {
  "tags": ["drama/show1", "drama/show2", "drama/show3"],
  "random_tags": true
}
```

*This is a snippet showing random tag selection.*

**Without `random_tags`:**

- Uses first tag for first half-hour
- Uses second tag for second half-hour

**With `random_tags: true`:**

- Picks one tag randomly
- Uses it for the full hour

### Per-Slot Schedule Increment

Change the time block size for a specific hour:

```json
"15": {
  "tags": "short_shows",
  "schedule_increment": 15
}
```

*This is a snippet showing custom increment for a time slot.*

**Result:** 3 PM has 15-minute blocks instead of the station's default (usually 30).

**Important:**

- Choose values that divide evenly into 60: `5, 10, 15, 20, 30, 60`
- Make sure your videos are **shorter** than the increment
- Using odd values like `7` or `13` will cause schedule problems

### Video Scramble Effects Per Slot

Add visual effects to specific content (for "premium" or "scrambled" channels):

```json
"21": {
  "tags": "premium_content",
  "video_scramble_fx": "color_inversion"
}
```

*This is a snippet showing scramble effects on a time slot.*

**Available effects:** `horizontal_line`, `diagonal_lines`, `static_overlay`, `pixel_block`, `color_inversion`, `severe_noise`, `wavy`, `random_block`, `chunky_scramble` and `spicy`

See [STATION_CONFIG_README.md](https://github.com/shane-mason/FieldStation42/blob/main/docs/STATION_CONFIG_README.md#video-effects) for detailed descriptions of each effect.

**Disable scramble for a slot** (even if set station-wide):

```json
"9": {
  "tags": "free_preview",
  "video_scramble_fx": false
}
```

---

## Reusable Configuration Blocks (Slot Overrides)

As you add more customizations per slot, your config can get repetitive. **Slot overrides** let you define a configuration block once and reuse it.

### Creating Slot Overrides

Define reusable blocks in the `slot_overrides` section:

```json
{
  "station_conf": {
    "network_name": "My Channel",
    "channel_number": 5,

    "slot_overrides": {
      "adult_swim_block": {
        "start_bump": "caps/as_start.mp4",
        "end_bump": "caps/as_end.mp4",
        "bump_dir": "as_bumps",
        "commercial_dir": "as_commercials",
        "break_strategy": "end",
        "schedule_increment": 15
      },
      "kids_block": {
        "commercial_dir": "kids_commercials",
        "bump_dir": "kids_bumps",
        "break_strategy": "standard"
      }
    }
  }
}
```

*This is a partial config snippet showing the slot_overrides section.*

### Using Slot Overrides

Reference them in any time slot with the `overrides` property:

```json
"saturday": {
  "8": {
    "tags": "cartoons",
    "overrides": "kids_block"
  },
  "22": {
    "tags": "adult_swim",
    "overrides": "adult_swim_block"
  },
  "23": {
    "tags": "adult_swim",
    "overrides": "adult_swim_block"
  }
}
```

*This is a snippet showing override usage in a schedule.*

**Result:** All the properties defined in `kids_block` and `adult_swim_block` are automatically inserted into those time slots.

### What Can Go in Slot Overrides?

You can put **any time slot property** except `tags`:

✅ **Can include:**

- `start_bump`, `end_bump`
- `bump_dir`, `commercial_dir`
- `break_strategy`
- `schedule_increment`
- `sequence`, `sequence_start`, `sequence_end`
- `marathon`
- `random_tags`
- `video_scramble_fx`

❌ **Cannot include:**

- `tags` (must be set directly on the time slot)

### Combining Overrides with Individual Properties

You can use an override **and** add individual properties. Individual properties take precedence:

```json
"23": {
  "tags": "adult_swim",
  "overrides": "adult_swim_block",
  "marathon": {"chance": 0.2, "count": 4}
}
```

*This is a snippet showing override with additional property.*

**Result:** Gets all settings from `adult_swim_block` **plus** adds a 20% chance of a 4-hour marathon.

### Real-World Example: Programming Blocks

This is how you might set up several distinct programming blocks:

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

*This is a complete, valid configuration demonstrating slot overrides.*

---

## Fine-Tuning Schedule Timing

### Understanding Schedule Increments

The `schedule_increment` setting controls how shows fit into time blocks. This is set station-wide but can be overridden per slot.

**How it works:**

| Show Length | `schedule_increment: 30` | `schedule_increment: 5` | `schedule_increment: 0` |
|-------------|--------------------------|-------------------------|-------------------------|
| 22 min      | Buffered to 30 min       | Buffered to 25 min      | Plays as 22 min         |
| 47 min      | Buffered to 60 min       | Buffered to 50 min      | Plays as 47 min         |
| 78 min      | Buffered to 90 min       | Buffered to 80 min      | Plays as 78 min         |

**Buffering** means the show plays, then bumps/commercials fill the remaining time until the next increment.

### Choosing the Right Increment

**Traditional TV (30 minutes):**

```json
"schedule_increment": 30
```

- Shows fit into 30, 60, 90, 120 minute blocks
- Good for classic sitcoms (22-24 min) and dramas (44-48 min)
- Most predictable schedule

**Movie Channel (5 minutes):**

```json
"schedule_increment": 5
```

- Tighter schedule with less padding
- Movies end closer to their actual runtime
- Good for commercial-light channels

**Continuous Play (no increment):**

```json
"schedule_increment": 0
```

- Shows play back-to-back with no buffering
- No time-block alignment
- Good for commercial-free channels or playlist-style channels

### Per-Slot Timing

You can mix increments for different programming:

```json
"day_templates": {
  "weekday": {
    "6": {
      "tags": "news",
      "schedule_increment": 60
    },
    "9": {
      "tags": "sitcoms",
      "schedule_increment": 30
    },
    "12": {
      "tags": "movies",
      "schedule_increment": 5
    },
    "20": {
      "tags": "binge_block",
      "schedule_increment": 0
    }
  }
}
```

*This is a snippet showing different increments for different time slots.*

**Result:**

- Morning news: 60-minute blocks (full hour-long shows)
- Mid-morning: 30-minute blocks (half-hour sitcoms)
- Midday movies: 5-minute blocks (minimal buffering)
- Evening binge: Continuous play (no breaks between shows)

---

## Advanced Day Templates

You already learned basic day templates in the [Station Configuration Guide](/docs/configure-stations/). Here are advanced techniques.

### Mixing Templates with Custom Schedules

You can use a template **and** override specific hours:

```json
{
  "day_templates": {
    "weekday": {
      "9": {"tags": "sitcoms"},
      "12": {"tags": "movies"},
      "20": {"tags": "drama"}
    }
  },

  "monday": "weekday",
  "tuesday": "weekday",
  "wednesday": {
    "9": {"tags": "sitcoms"},
    "12": {"tags": "movies"},
    "14": {"tags": "special_event"},
    "20": {"tags": "drama"}
  }
}
```

*This is a partial config snippet.*

**Unfortunately, this doesn't work.** Once you define hours for a day, you must define **all hours** for that day. Templates are an all-or-nothing replacement.

**Workaround:** Create a separate template for special days:

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

*This is a partial config snippet showing template variation.*

### Multiple Templates for Organization

Create as many templates as needed for different schedule types:

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

*This is a snippet showing the day_templates section.*

Then assign them as needed:

```json
"monday": "standard_weekday",
"tuesday": "standard_weekday",
"wednesday": "standard_weekday",
"thursday": "sports_day",
"friday": "standard_weekday",
"saturday": "standard_weekend",
"sunday": "holiday"
```

### Templates with Slot Overrides

Combine templates with slot overrides for maximum reusability:

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

*This is a partial config snippet.*

**Result:** All weekdays get the same schedule, and consistent slot settings are applied via overrides.

---

## Automatic Bumps

Autobumps let you use system generated bumps for commercial breaks. They come in two different varieties: station identification and 'up next' formats.

```json
"autobump": {
  "title": "NBC TV",
  "subtitle": "Classic Television",
  "variation": "retro",
  "detail1": "Line 1 of details",
  "detail2": "Line 2 of details",
  "detail3": "Line 3 of details",
  "bg_music": "logo1.mp3",
  "strategy": "both"
}
```

Strategy: when to play bumps.

- `start` - play a station identification autogenerated bump at the start of the break but use regular bumps for the end of break
- `end` - play 'up next' bumps at the end of the break, but use regular bumps at the start.
- `both` - play station id bump at the start of the break and 'up next' bump at the end.

Variations: sets the theme. Can be one of `"modern"`, `"retro"`, `"corporate"` or `"terminal"`

You can test auto-bumps using URLs like the ones below:

```
http://localhost:4242/static/bump/bump.html?next_network=PublicDomainTV
```

## Complete Advanced Example

Here's a full configuration using many advanced features:

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
        "6": {
          "tags": "news",
          "overrides": "morning_news"
        },
        "9": {
          "tags": "sitcoms",
          "sequence": "morning_sitcom_seq"
        },
        "12": {
          "tags": "movies",
          "schedule_increment": 5
        },
        "16": {
          "tags": "cartoons",
          "overrides": "kids_block"
        },
        "17": {
          "tags": "xfiles",
          "sequence": "xfiles_daily",
          "sequence_start": 0.0,
          "sequence_end": 0.75
        },
        "20": {
          "tags": "drama",
          "overrides": "primetime",
          "sequence": "primetime_drama_seq"
        },
        "21": {
          "tags": "drama",
          "overrides": "primetime",
          "sequence": "primetime_drama_seq"
        },
        "22": {
          "tags": "adult_swim",
          "overrides": "adult_swim"
        },
        "23": {
          "tags": "adult_swim",
          "overrides": "adult_swim"
        }
      },
      "weekend": {
        "8": {
          "tags": "saturday_cartoons",
          "overrides": "kids_block",
          "marathon": {
            "chance": 0.25,
            "count": 6
          }
        },
        "14": {
          "tags": "movies",
          "schedule_increment": 5
        },
        "18": {
          "tags": "movies",
          "schedule_increment": 5
        },
        "21": {
          "tags": "xfiles",
          "sequence": "xfiles_weekend",
          "sequence_start": 0.75,
          "sequence_end": 1.0,
          "marathon": {
            "chance": 0.15,
            "count": 4
          }
        }
      },
      "friday_special": {
        "6": {
          "tags": "news",
          "overrides": "morning_news"
        },
        "9": {
          "tags": "sitcoms",
          "sequence": "morning_sitcom_seq"
        },
        "12": {
          "tags": "movies",
          "schedule_increment": 5
        },
        "16": {
          "tags": "cartoons",
          "overrides": "kids_block"
        },
        "20": {
          "tags": "comedy",
          "overrides": "primetime"
        },
        "21": {
          "tags": "scifi",
          "overrides": "primetime",
          "sequence": "scifi_friday_seq"
        },
        "22": {
          "tags": "scifi",
          "overrides": "primetime",
          "sequence": "scifi_friday_seq"
        },
        "23": {
          "tags": "horror",
          "start_bump": "caps/horror_start.mp4",
          "marathon": {
            "chance": 0.3,
            "count": 5
          }
        }
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

**Weekdays (Monday-Thursday):**

- 6 AM: News hour with 60-minute blocks, centered commercials
- 9 AM: Sequential sitcom playback
- 12 PM: Movies with 5-minute schedule increments (tight timing)
- 4 PM: Kids block with kid-friendly commercials/bumps
- 5 PM: X-Files sequential (older episodes, first 75% of series)
- 8-9 PM: Primetime drama in sequence with premium commercials
- 10-11 PM: Adult Swim block with custom bumps and end-loaded commercials

**Friday:**

- Same morning/afternoon as weekdays
- 8 PM: Comedy hour
- 9-10 PM: Sci-Fi Friday in sequence
- 11 PM: Horror movies with 30% chance of 5-hour marathon

**Weekends:**

- 8 AM: Saturday cartoons with 25% chance of 6-hour marathon
- 2 PM & 6 PM: Movies with tight timing
- 9 PM: X-Files sequential (newer episodes, final 25% of series) with 15% chance of 4-hour marathon

**Features used:**

- 3 day templates (weekday, weekend, friday_special)
- 4 slot override blocks (morning_news, kids_block, adult_swim, primetime)
- 5 different sequences (morning sitcoms, daily X-Files, weekend X-Files, primetime drama, sci-fi Friday)
- Sequence ranges (75%/25% split for X-Files)
- Marathons on cartoons, Friday horror, and weekend X-Files
- Per-slot schedule increments (60 min for news, 5 min for movies)
- Custom bumps for Adult Swim block and Friday horror
- Custom commercial/bump directories for different programming

---

## Tips for Managing Complex Configurations

### 1. Start Simple, Add Complexity Gradually

Don't try to use every feature at once. Start with:

1. Basic schedule with tags
2. Add day templates
3. Add one or two slot overrides
4. Add sequences where needed
5. Add marathons for variety

### 2. Use Descriptive Names

Good names make your config easier to maintain:

✅ **Good:**

```json
"slot_overrides": {
  "saturday_morning_kids": { ... },
  "primetime_drama_block": { ... },
  "late_night_adult_swim": { ... }
}
```

❌ **Bad:**

```json
"slot_overrides": {
  "override1": { ... },
  "block_a": { ... },
  "config_b": { ... }
}
```

### 3. Group Related Settings

Keep related slot overrides and templates together:

```json
"slot_overrides": {
  "kids_weekday": { ... },
  "kids_weekend": { ... },
  "kids_holiday": { ... },

  "news_morning": { ... },
  "news_evening": { ... },

  "primetime_drama": { ... },
  "primetime_comedy": { ... }
}
```

### 4. Document with File Structure

Keep a folder structure that matches your config:

```
catalog/advanced_content/
├── news/                    <- "tags": "news"
├── sitcoms/                 <- "tags": "sitcoms"
├── movies/                  <- "tags": "movies"
├── kids_commercials/        <- kids_block override
├── kids_bumps/              <- kids_block override
├── as_bumps/                <- adult_swim override
├── as_commercials/          <- adult_swim override
├── caps/                    <- start_bump/end_bump files
│   ├── as_start.mp4
│   ├── as_end.mp4
│   └── horror_start.mp4
```

### 5. Test One Feature at a Time

When adding a new feature:

1. Add it to one time slot
2. Run the station and verify it works
3. Expand to other slots once confirmed

### 6. Keep a Backup

Before making major changes, save a copy:

```
confs/
├── mychannel.json               <- current working version
├── mychannel_backup.json        <- backup before changes
└── mychannel_experimental.json  <- testing new features
```

---

## Troubleshooting Advanced Features

### Sequences Not Playing in Order

**Problem:** Episodes play randomly even though you set a sequence.

**Causes:**

- Sequence name is misspelled or inconsistent
- Files aren't named to sort correctly alphabetically
- Multiple slots use same sequence name (they'll share position - this might be intentional)

**Solution:**

```bash
# Check how your files sort
ls -1 catalog/your_content/your_show/
```

If they don't sort in the right order, rename them:

```
Bad:
  episode1.mp4, episode2.mp4, episode10.mp4  <- 10 comes before 2!

Good:
  episode_01.mp4, episode_02.mp4, episode_10.mp4
  S01E01.mp4, S01E02.mp4, S01E10.mp4
```

### Marathon Never Triggers

**Problem:** You set `"chance": 0.2` but never see marathons.

**Causes:**

- 20% chance = 1 in 5 days on average - might just be unlucky
- Schedule rebuilds reset the random seed

**Solution:**

- Increase chance for testing: `"chance": 1.0` (always happens)
- Check logs to see if marathons triggered but you missed them
- Remember: schedules are built in advance, so check future dates

### Slot Override Not Working

**Problem:** Settings in your slot override aren't being applied.

**Causes:**

- Misspelled override name: `"overrides": "kids_blok"` vs `"kids_block"`
- Override defined in wrong section (should be in `slot_overrides`)
- Individual slot property is overriding the override

**Solution:**

```json
"slot_overrides": {
  "kids_block": { ... }
},

"monday": {
  "16": {
    "tags": "cartoons",
    "overrides": "kids_block"
  }
}
```

### Schedule Overruns or Gaps

**Problem:** Shows don't fit cleanly into time blocks, causing scheduling issues.

**Causes:**

- Videos longer than `schedule_increment`
- Odd schedule increment values (7, 13, etc.)
- Per-slot increment doesn't divide into 60

**Solution:**

- Use standard increments: 5, 10, 15, 20, 30, 60
- Make sure videos are **shorter** than the increment
- Set `schedule_increment: 0` for continuous play if timing isn't critical
