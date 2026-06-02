Title: Adult Swim Style Blocks
Slug: docs/guides/adult-swim-blocks
Summary: Build a channel that runs daytime cartoons and shifts to a distinct late-night identity at 9 PM, with its own bumps, tighter timing, and a signon and signoff.

The Adult Swim model is a classic TV pattern: a children's network by day that changes into something completely different after dark. Different tone, different bumps, tighter timing, and a clear on/off moment that marks the transition.

This guide walks through how to build that in FieldStation42, using Toon TV as the example. The same approach works for any channel that needs to shift identity at a specific time of night.

<div class="callout callout-tip">
This guide builds on <a href="/docs/guides/advanced-scheduling/">Advanced Scheduling</a> (slot overrides) and <a href="/docs/guides/bumps-and-commercials/">Bumps and Commercials</a> (bump directories and signon/signoff clips). It helps to be familiar with both before continuing.
</div>

<div class="callout callout-warning">
This guide is provided for educational purposes to demonstrate FieldStation42's configuration patterns. Only use media you own or have the rights to play.
</div>

## What We're Building

A single channel config that:

- Plays daytime cartoons from 7 AM to 9 PM on the station's normal 30-minute schedule
- Switches to a late-night block at 9 PM with its own bumps and 15-minute timing
- Opens with a signon at 9 PM and closes with a signoff at 6 AM
- Runs the same schedule every day

## Folder Structure

Everything lives under one `content_dir`. The key is keeping the daytime and late-night bumps in separate folders. The names below are just an example for the config example below. Wse whatever folder names and structure make sense for your library, and update the config values to match.

```
catalog/toon_tv/
├── toons/                  <- daytime content
├── as/
│   ├── aqua_teen/
│   ├── robot_chicken/
│   ├── harvey_birdman/
│   ├── sealab/
│   ├── metalocalypse/
│   ├── space_ghost/
│   ├── family_guy/
│   ├── american_dad/
│   ├── rick_and_morty/
│   └── venture_bros/
├── commercial/             <- daytime commercials
├── as_commercials/         <- late-night commercials
├── bump/                   <- daytime bumps
└── as_bumps/               <- late-night bumps
    ├── pre/                <- "we'll be right back" cards (optional)
    ├── post/               <- "and we're back" cards (optional)
    ├── signon.mp4
    └── signoff.mp4
```

The daytime and late-night bump and commercial folders are completely separate. That separation is what makes the whole thing work.

## The Slot Override

Without any special configuration, every slot on your channel uses the same bumps folder. If you want the 9 PM slot to use `as_bumps` instead of `bump`, you'd add `"bump_dir": "as_bumps"` to that slot. Then the 10 PM slot. Then the 11 PM slot. And so on through 6 AM.

Slot overrides solve this. Define your late-night settings once in `slot_overrides`, then reference them with `"overrides"` on each slot:

```json
"slot_overrides": {
  "adult_swim_block": {
    "bump_dir": "as_bumps",
    "commercial_dir": "as_commercials",
    "schedule_increment": 15
  }
}
```

Then in your schedule:

```json
"22": {"tags": "as/family_guy", "overrides": "adult_swim_block"}
```

Every slot that uses `"overrides": "adult_swim_block"` gets `bump_dir`, `commercial_dir`, and `schedule_increment` applied automatically. The daytime slots continue using the station-level `commercial` and `bump` folders. Change a setting in the override and it applies to every late-night slot at once.

## Why Schedule Increment 15?

The station default is `schedule_increment: 30`. That works well for daytime cartoons: a 22-minute episode gets buffered to fill a 30-minute block, with commercials in the gap.

Adult Swim is built around 15-minute shows. With `schedule_increment: 30`, a 12-minute episode gets padded to fill 30 minutes, which is too much. With `schedule_increment: 15`, it gets padded to 15 minutes: one episode, one commercial break, done.

Because this is set inside the override, the late-night block uses 15-minute timing and the daytime block stays on 30. The station-level setting handles daytime; the override handles late-night.

## Filling the Quarter-Hours

Each hour in your schedule is one config entry. With `schedule_increment: 15` and a single tag, the scheduler fills the whole hour with that show: four 15-minute blocks, four episodes of the same show.

When you list multiple tags in an array, the hour gets divided evenly between them. Four tags means four 15-minute quarters, one show per quarter:

```json
"21": {
  "tags": ["as/aqua_teen", "as/robot_chicken", "as/harvey_birdman", "as/sealab"],
  "overrides": "adult_swim_block"
}
```

9 PM plays one episode each of ATHF, Robot Chicken, Harvey Birdman, and Sealab, with commercial breaks between them.

For 30-minute shows, two tags splits the hour into two 30-minute halves:

```json
"22": {
  "tags": ["as/family_guy", "as/american_dad"],
  "overrides": "adult_swim_block"
}
```

Mix the two patterns across your late-night hours to reflect how Adult Swim actually programmed: short shows early, longer syndicated shows later in the night.

## Signon and Signoff

The block needs a clear opening and closing moment. `start_bump` and `end_bump` handle this: a clip plays before the first show of a slot (`start_bump`) or after the last show (`end_bump`). Both accept either a path to a single file or a path to a folder -- if you point them at a folder, one clip is chosen at random each time.

Put `start_bump` only on the first late-night slot and `end_bump` only on the last:

```json
"21": {
  "tags": ["as/aqua_teen", "as/robot_chicken", "as/harvey_birdman", "as/sealab"],
  "overrides": "adult_swim_block",
  "start_bump": "as_bumps/signon.mp4"
},
...
"5": {
  "tags": ["as/aqua_teen", "as/robot_chicken", "as/metalocalypse", "as/space_ghost"],
  "overrides": "adult_swim_block",
  "end_bump": "as_bumps/signoff.mp4"
}
```

These stay on the individual slots rather than inside the override because the override applies to every slot that references it. If `start_bump` were in the override, every late-night hour would play the signon clip.

## The Complete Config

```json
{
  "station_conf": {
    "network_name": "Toon TV",
    "channel_number": 42,
    "content_dir": "catalog/toon_tv",
    "commercial_dir": "commercial",
    "bump_dir": "bump",
    "schedule_increment": 30,
    "break_strategy": "standard",

    "slot_overrides": {
      "adult_swim_block": {
        "bump_dir": "as_bumps",
        "commercial_dir": "as_commercials",
        "schedule_increment": 15
      }
    },

    "day_templates": {
      "everyday": {
        "7":  {"tags": "toons"},
        "8":  {"tags": "toons"},
        "9":  {"tags": "toons"},
        "10": {"tags": "toons"},
        "11": {"tags": "toons"},
        "12": {"tags": "toons"},
        "13": {"tags": "toons"},
        "14": {"tags": "toons"},
        "15": {"tags": "toons"},
        "16": {"tags": "toons"},
        "17": {"tags": "toons"},
        "18": {"tags": "toons"},
        "19": {"tags": "toons"},
        "20": {"tags": "toons"},
        "21": {
          "tags": ["as/aqua_teen", "as/robot_chicken", "as/harvey_birdman", "as/sealab"],
          "overrides": "adult_swim_block",
          "start_bump": "as_bumps/signon.mp4"
        },
        "22": {"tags": ["as/family_guy", "as/american_dad"],                                       "overrides": "adult_swim_block"},
        "23": {"tags": ["as/aqua_teen", "as/metalocalypse", "as/space_ghost", "as/robot_chicken"], "overrides": "adult_swim_block"},
        "0":  {"tags": ["as/rick_and_morty", "as/venture_bros"],                                   "overrides": "adult_swim_block"},
        "1":  {"tags": ["as/harvey_birdman", "as/sealab", "as/aqua_teen", "as/metalocalypse"],     "overrides": "adult_swim_block"},
        "2":  {"tags": ["as/family_guy", "as/rick_and_morty"],                                     "overrides": "adult_swim_block"},
        "3":  {"tags": ["as/robot_chicken", "as/space_ghost", "as/harvey_birdman", "as/sealab"],   "overrides": "adult_swim_block"},
        "4":  {"tags": ["as/american_dad", "as/venture_bros"],                                     "overrides": "adult_swim_block"},
        "5":  {
          "tags": ["as/aqua_teen", "as/robot_chicken", "as/metalocalypse", "as/space_ghost"],
          "overrides": "adult_swim_block",
          "end_bump": "as_bumps/signoff.mp4"
        }
      }
    },

    "monday":    "everyday",
    "tuesday":   "everyday",
    "wednesday": "everyday",
    "thursday":  "everyday",
    "friday":    "everyday",
    "saturday":  "everyday",
    "sunday":    "everyday"
  }
}
```

## Going Further

**Per-night lineups.** If you want Friday to lead with Rick and Morty or Saturday to run a different rotation, create separate day templates and assign them by day. The `adult_swim_block` override stays the same; only the tags and order change.

**Context-aware bumps.** The `next/` subfolder inside `as_bumps` lets you add "coming up next" bump cards that only play when a specific show is actually scheduled next. See the [Bumps and Commercials](/docs/guides/bumps-and-commercials/) guide for how to set those up.