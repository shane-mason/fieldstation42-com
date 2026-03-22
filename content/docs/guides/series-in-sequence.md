Title: Playing Series in Sequence
Slug: docs/guides/series-in-sequence
Summary: Play episodes in order using named sequences, with support for multiple independent progressions, start and end points, and multi-tag slots.

FieldStation42 lets you play series in order, based on the alpha-numeric sorting of video files. Sequences are named, so you can have multiple independent episode progressions for the same show.

---

## 🗂️ Declaring Sequences in Your Config

Add a sequence to a time slot in your station's config:

```json
"21": {"tags": "my_show", "sequence": "my_sequence"},
```

- Only files in the `my_show` folder (and subfolders) are included.
- The sequence key is `<TAG>-<SEQUENCE_NAME>`, so each sequence is tracked separately.

You can use any sequence name you like. For example, these increment independently:

```json
"21": {"tags": "my_show", "sequence": "my_sequence"},
"21": {"tags": "another_show", "sequence": "my_sequence"},
```

---

## 🔄 Scanning & Rebuilding Sequences

After editing your config, scan for sequences:

```sh
python3 station_42.py --scan_sequences
```

To delete and rescan all sequences:

```sh
python3 station_42.py --rebuild_sequences
```

> **Note:** If you get errors, you may need to rebuild your catalogs first.

---

## 💡 Sequence Use Cases

### 1. Single Time Slot (e.g., Prime Time)

```json
"21": {"tags": "xfiles", "sequence": "prime"},
```

A new episode airs each week at a specific time.

### 2. Multiple Slots (e.g., Syndication)

```json
"17": {"tags": "xfiles", "sequence": "daily"},
```

A show airs every weekday at a specific time.

### 3. Multiple Sequences for the Same Show

Prime time and syndication can run independently:

```json
"17": {"tags": "xfiles", "sequence": "daily"},
"21": {"tags": "xfiles", "sequence": "prime"},
```

### 4. Sequence Start & End Points

Split a series into different intervals:

```json
"17": {"tags": "xfiles", "sequence": "daily", "sequence_start": 0.0, "sequence_end": 0.75},
"21": {"tags": "xfiles", "sequence": "prime", "sequence_start": 0.75, "sequence_end": 1.0},
```

- Values are percentages of the total episode count.
- Sequences loop from `sequence_end` back to `sequence_start`.

### 5. Random Play (No Sequence)

```json
"21": {"tags": "xfiles"},
```

Episodes play randomly, not affecting any sequence.

### 6. Persistence

- Catalog rebuilds do not affect sequences.
- When a schedule is deleted, the sequence rewinds to the correct point.

### 7. Multiple Tags in a Slot

```json
"18": {"tags": ["friends", "seinfeld"], "sequence": "prime"},
```

Both `friends-prime` and `seinfeld-prime` are tracked independently.

---

## 📦 Content Storage Tips

- Store only series episodes in the tag folder.
- Subfolders (e.g., by season) are supported.
