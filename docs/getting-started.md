# Getting started

[Back to Sonara](../README.md)

## Overview

Sonara adds a sidebar with five panels - **Tasks**, **Review**, **Code Map**, **Voice Log**, and **Voice Transcripts** - plus a **Time Tracker** in the status bar. Each project keeps its own data under its own `.vscode/sonara/`. A project is a workspace folder or a git repository inside it - the same repositories Source Control shows - so a folder that holds several repositories gives one project per repository.

Every list or input Sonara opens at the top of the window has a close button in its title bar, so it can be dismissed on a touch screen without an Escape key.

## Requirements

- **VS Code** 1.85 or newer.
- **Voice recording currently runs on Linux only** (audio is captured via PulseAudio/PipeWire). Tasks and Time Tracking work on every platform; on macOS/Windows the voice commands show a clear message instead of recording.
- **GPU is optional but recommended.** A CUDA GPU gives fast transcription and is required for the live streaming phase. Without a GPU, transcription runs on CPU and is considerably slower.
- The first time the voice features activate, Sonara sets up a local Python environment and downloads the selected Whisper model (default `large-v3`, ~3 GB). This is the only step that needs the internet.

## Install

1. Download the latest `.vsix` from the [Releases](https://github.com/shapoval-dev/sonara/releases) page (or build it yourself - see [Building](#building)).
2. In VS Code: `Extensions` view → `...` menu → `Install from VSIX...` → pick the file.
3. Reload VS Code when prompted.

## Quick Start

1. **Open the sidebar.** Click the Sonara icon in the Activity Bar. Five panels appear: Tasks, Review, Code Map, Voice Log, Voice Transcripts. The `.vscode/sonara/` folder is created automatically the first time you use a feature.
2. **Create a task.** In the Tasks panel, click **New Task** (the `+` button), fill in the details, and it is saved as a markdown file.
3. **Dictate.** Press `Ctrl+Shift+M` to start. On first use the Whisper model downloads (one time). Speak, then press `Ctrl+Shift+M` again to stop and save the entry to the Voice Log.
4. **Several projects?** Review and Code Map show every repository at once. Tasks, Voice Log, Voice Transcripts and the Time Tracker work with one project at a time: use the **Active Project** selector in the title of Tasks or the voice panels to switch between workspace folders and the git repositories inside them - each keeps its own independent data. Until you pick one, Sonara takes the only project there is, or the project of the file open in the editor; a project you picked stays active until you pick another.

## Keyboard shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Shift+M` | Start / stop recording |
| `Ctrl+Alt+M` | Cancel recording (discard audio) |

## Building

Requires Docker (the build runs in a container) and the VS Code `code` CLI.

```sh
make build        # compile + package into sonara-<version>.vsix
make install-ext  # install the built .vsix into local VS Code
```

Run `make help` for all targets.
