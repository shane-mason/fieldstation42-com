Title: Bumps and Commercials
Slug: docs/guides/bumps-and-commercials
Summary: Everything you need to know about bumps and commercials - what they are, when you need them, and how to organize them for the best results.

Bumps and commercials are short clips that make your channel feel like real TV. They're primarily used by **standard network types** that schedule content in time blocks.

## Bumps (Station Promos)

**What are they?**

- Short clips that identify your station
- Examples: "You're watching Retro TV", "We'll be right back"
- Play between shows and during commercial breaks

**When are they needed?**

- For standard networks using time-block scheduling (e.g., 30-minute or 60-minute blocks)
- Not needed for continuous play channels (`schedule_increment: 0`)
- Not needed for loop or streaming network types

**Best practices:**

- Length: 2-60 seconds (shorter is better)
- Variety: Add 5 to 10 different bumps minimum
- Content: Station IDs, "coming up next" messages, interstitials

## Commercials

**What are they?**

- Advertisement clips that fill programming blocks
- Used to pad shows to fit 30-minute or 60-minute time slots

**When are they needed?**

- For standard networks that aren't commercial-free
- If you set `"commercial_free": true`, commercials aren't needed (bumps are used instead)
- Not needed for continuous play channels (`schedule_increment: 0`)

**Best practices:**

- Length: 15-60 seconds
- Variety: Add 20-30 different commercials minimum
- The more variety, the better the scheduler can fit content into time blocks

**Customizing folder names:** The default folder names are `commercial` and `bump`, but you can configure different names using `"commercial_dir"` and `"bump_dir"` settings in your station configuration.

## Special Bump Subfolders: Pre & Post

The bump folder supports two special subfolders for commercial break control:

```
catalog/retro_tv/
└── bump/
    ├── pre/                    <- Always plays at START of commercial breaks
    │   ├── "we'll be right back.mp4"
    │   └── "after these messages.mp4"
    ├── post/                   <- Always plays at END of commercial breaks
    │   ├── "welcome back.mp4"
    │   └── "and now back to.mp4"
    └── general_bump.mp4        <- Used if pre/post aren't specified
```

**How it works:**

- If `pre/` exists: First clip in every commercial break comes from this folder
- If `post/` exists: Last clip in every commercial break comes from this folder
- If `pre/` or `post/` are missing: Regular bumps are used instead

## Special Bumps for Specific Shows

You can add custom bumps for branded programming blocks by setting `start_bump` and `end_bump` on individual time slots:

```json
"20": {
  "tags": "adult_swim",
  "start_bump": "caps/as_start.mp4",
  "end_bump": "caps/as_end.mp4"
}
```

*This is a snippet showing a single time slot.*

**Important:** Place these bumps in a separate folder (not your regular `bump_dir`) so they don't play during other shows.