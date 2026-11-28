# Project files

[Back to Sonara](../README.md)

## Tasks file format

Each task is a `.md` file under `.vscode/sonara/tasks/`: a YAML frontmatter block followed by free-form markdown.

```markdown
---
title: Implement OAuth2 session refresh
status: in-progress
priority: high
sprint: Q2 Growth
labels:
  - backend
  - auth
created: 2026-04-08T09:00:00.000Z
---

<!-- Sonara task. Format and rules: .vscode/sonara/tasks/README.md -->

Task description in free-form markdown.
```

> The YAML frontmatter **must be the first thing in the file** - line 1 is `---`, with no leading comment or blank line. The Sonara hint comment belongs in the body, after the closing `---`. Field order inside the frontmatter does not matter (it is parsed by key); the order above is just the convention Sonara writes.

| Field | Required | Values |
|-------|----------|--------|
| `title` | No (filename used as fallback) | Any string |
| `status` | No (null if omitted or invalid) | `activity`, `inbox`, `backlog`, `todo`, `in-progress`, `review`, `done`, `released`, `cancelled` |
| `priority` | No (defaults to `medium`) | `highest`, `high`, `medium`, `low`, `lowest` |
| `created` | No | ISO 8601 date string |
| `sprint` | No | Any string |
| `labels` | No | YAML array of strings |

A `README.md` describing the full format is generated inside `.vscode/sonara/tasks/` of every initialized project.

## Project files

Everything Sonara stores lives under `.vscode/sonara/` in each project folder:

| Path | Contents |
|------|----------|
| `tasks/` | One markdown file per task (+ a format `README.md`) |
| `voice-log/voice-log.jsonl` | Dictation history (one JSON record per line) |
| `vocabulary.md` | Project vocabulary that biases Whisper |
| `voice-transcripts/` | File transcripts as markdown |
| `time-tracker/days/` | Per-day time tracking data as JSON |
| `review/` | Review levels: accepted file versions, per-file records, and a format `README.md` |

Whether you commit these is up to you - the extension does not touch your `.gitignore`. Voice data can contain personal recordings; consider excluding `voice-log/` and `voice-transcripts/` from shared repositories.

### Voice Log and time tracking formats

**Voice Log** - one JSON object per line in `voice-log/voice-log.jsonl`:

```json
{"id": "a1b2c3", "timestamp": "2026-06-04T18:30:00.000Z", "text": "Add login screen", "language": "uk", "duration_sec": 4.2, "model": "large-v3", "tags": [], "copied": false}
```

**Time tracking** - one file per user per day at `time-tracker/days/<user>/<YYYY-MM-DD>.json`:

```json
{
  "date": "2026-06-04",
  "tasks": {
    "implement-oauth2-session-refresh": {
      "total": 1800,
      "slots": [{ "start": "2026-06-04T09:00:00Z", "seconds": 900 }]
    }
  }
}
```

Within a day file, `slots` are chronological and `total` is their sum. As with task frontmatter, object key order is not significant - only the order of array items (the `slots` sequence) is.

## Privacy

Voice data never leaves your machine. Audio is captured locally, transcribed by the bundled Whisper server on `localhost`, and the dictation text is stored in `.vscode/sonara/voice-log/voice-log.jsonl` inside your project. Audio is not retained after transcription. No telemetry is collected.
