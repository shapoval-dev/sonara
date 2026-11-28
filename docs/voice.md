# Voice server

[Back to Sonara](../README.md)

## How the voice server works

Sonara bundles a local server that runs [faster-whisper](https://github.com/SYSTRAN/faster-whisper). It is managed automatically so it does not waste memory when you are not dictating:

- **Lazy start** - the server is not running until your first dictation or file transcription.
- **Status bar toggle** - a `Voice: On / Off` item lets you turn the server on or off at any time. Turning it off frees the model from memory immediately. While it is off, starting a recording asks whether you want to turn it back on.
- **Idle shutdown** - when on, the server shuts itself down after `sonara.voice.idleShutdownMinutes` of inactivity (default 10; set to 0 to never shut down) and starts again on your next dictation.
- **GPU out-of-memory recovery** - if a transcription runs out of GPU memory, a prompt offers to retry the recording on CPU or with a smaller model, then restores your usual model.

### Streaming modes

Set `sonara.voice.streamingMode` (or use `Sonara: Change Streaming Mode`):

- `off` - classic: record, stop, then transcribe in one shot. Best accuracy on short messages.
- `on` - live: transcribe continuously while you speak. Requires a CUDA GPU.
- `adaptive` - classic for short recordings, automatically switching to live once a recording passes `sonara.voice.adaptiveStreamingThresholdSec`. Requires a GPU for the live phase.

### Vocabulary

Edit `.vscode/sonara/vocabulary.md` (or run `Sonara: Edit Project Vocabulary`) to list technical terms, proper names, and project jargon - one term per line, `#` for comments. Whisper is biased toward these words across dictation and file transcription. Keep the list focused.
