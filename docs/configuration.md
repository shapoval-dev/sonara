# Configuration

[Back to Sonara](../README.md)

## Configuration

Open Settings (`Ctrl+,`) and search for `sonara`. Full list:

| Setting | Default | Description |
|---------|---------|-------------|
| `sonara.voice.model` | `large-v3` | Whisper model (`tiny`, `base`, `small`, `medium`, `large-v2`, `large-v3`) |
| `sonara.voice.device` | `auto` | Compute device (`auto`, `cuda:0`, `cuda:1`, `cpu`) |
| `sonara.voice.language` | `auto` | Transcription language, or `auto` to detect (23 languages available) |
| `sonara.voice.computeType` | `auto` | faster-whisper compute type (`auto`, `float16`, `int8_float16`, `int8`, `float32`) |
| `sonara.voice.vadFilter` | `true` | Voice activity detection filter |
| `sonara.voice.audioInput` | `null` | Input device (`null` = system default; pick via `Sonara: Change Audio Input`) |
| `sonara.voice.stopDelayMs` | `1000` | Extra capture time (ms) after Stop, so trailing words are not cut off |
| `sonara.voice.streamingMode` | `off` | `off` (classic), `on` (live), or `adaptive` |
| `sonara.voice.adaptiveStreamingThresholdSec` | `30` | In adaptive mode, switch to live after this many seconds |
| `sonara.voice.streamingIntervalSec` | `2` | How often (s) live transcription emits a partial result |
| `sonara.voice.beamSize` | `5` | Whisper beam size |
| `sonara.voice.idleShutdownMinutes` | `10` | Idle minutes before the server shuts down (`0` = never) |
| `sonara.voice.log.autoOpenPanel` | `false` | Auto-open the Voice Log panel on start |
| `sonara.voice.log.showNotificationOnTranscribe` | `true` | Toast after each transcription |
| `sonara.timeTracker.tickIntervalSec` | `15` | How often (s) time is credited while a timer runs |
| `sonara.timeTracker.flushIntervalSec` | `60` | How often (s) pending time is written to disk |
| `sonara.review.viewMode` | `tree` | Review layout: `tree` or `list` |
| `sonara.codeMap.sortBy` | `lines` | Code Map ordering: `lines` or `name` |
| `sonara.review.compactFolders` | `true` | Collapse chains of single-child folders into one row |
| `sonara.review.debugLog` | `false` | Include per-file and per-Git-process debugging details in Review logs |
