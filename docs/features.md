# Features

[Back to Sonara](../README.md)

## Tasks

Manage project tasks as plain markdown files - they travel with your repository.

- One markdown file per task with YAML frontmatter metadata
- Fields: title, status, priority, sprint, labels, created
- Webview panel groups tasks by status: Activity, Inbox, Backlog, To Do, In Progress, Ready for Review, Done, Released, Cancelled
- Five priority levels: Highest, High, Medium, Low, Lowest
- Filter by sprint, label, and priority directly in the panel
- Create, edit, and delete tasks without leaving VS Code
- "Copy Agent Context" puts a task's details on the clipboard for pasting into an AI assistant
- Stored under `.vscode/sonara/tasks/` - commit them with your code or keep them local
- Every command and panel action is logged to the **Sonara Tasks** output channel, with the error and its stack trace when something fails

## Code Map

See where the code of a project lives, the way a disk usage analyzer shows where the space goes.

- A tree of the project with the numbers always on the row: a folder shows `files: N · lines: X · size`, a file shows `lines: X · size`; a binary file shows its size only
- Every git repository of the window gets its own row with its totals and its folders inside, the same repositories Source Control shows; with one repository its folders sit at the top. A repository nested in another one is counted in its own row only
- Uncommitted changes are added as `+X -Y` lines against the last commit; a file that is not in git yet counts all its lines as added
- Counts the files git knows about plus new files that are not ignored; ignored folders such as `node_modules` stay out
- The panel title carries the totals of all repositories together
- Order by line count, largest first, or by name with folders first - the button in the panel title switches between them (`sonara.codeMap.sortBy`)
- Numbers update by themselves when files change, are staged or committed; only changed files are read again
- Click a file to open it
- A repository and a folder have **Expand All** and **Collapse All** buttons, the same as in Review
- The context menu of a file or folder has **Open Containing Folder**, **Copy Path**, **Copy Relative Path** and **Delete** (to the Trash, with a confirmation); copy and delete work on several selected rows at once. A repository row has the same menu without Delete

## Media Preview

VS Code's own player cannot play AAC sound, the usual sound of mp4 and m4a files: the picture plays, the volume button stays grey. Sonara Media Preview is the default viewer for `.mp4`, `.mov`, `.m4v` and `.m4a` files wherever they are opened: the Explorer, Code Map, Quick Open, a git diff.

- A file with sound VS Code cannot play (AAC, Opus) plays from a copy where the picture stays as it is and the sound is converted to MP3 with `ffmpeg`; the file itself is not changed. A file with MP3, Vorbis, FLAC or PCM sound, or with no sound, plays as is
- The copy lives in the extension storage while the tab is open; copies left by a closed window are removed a day later
- Without `ffmpeg` and `ffprobe` on the `PATH` the player stays silent and says so; **Open with Default Application** plays the sound
- VS Code's own viewer stays available through **Open With...**
- What was checked and converted is logged to the **Sonara Media Preview** output channel

## Voice

Dictate notes, prompts, and task descriptions with a local Whisper model. Audio is captured and transcribed entirely on your machine.

- Start/stop dictation with a single shortcut (`Ctrl+Shift+M`)
- Three streaming modes: classic (record then transcribe), live (transcribe as you speak), and adaptive (classic for short clips, live for long ones)
- The local transcription server starts only when you need it, can be toggled on/off from the status bar, and shuts itself down after a period of inactivity to free memory
- GPU (CUDA) acceleration when available; if the GPU runs out of memory mid-transcription, Sonara offers to retry on CPU or with a smaller model
- Project vocabulary biases Whisper toward your technical terms and proper names
- Voice Log keeps the full dictation history as JSONL - search, copy, and clear it from the panel
- No network connection required for recording or transcription
- Every command is logged to the **Sonara Voice** output channel, with the error and its stack trace when something fails

## Voice Transcripts

Transcribe pre-recorded audio or video files (meetings, debriefs, design reviews) into searchable markdown.

- Right-click an audio file or run `Sonara: Transcribe File...` from the Command Palette
- Each transcript is saved as a markdown file under `.vscode/sonara/voice-transcripts/`
- Metadata header captures source filename, duration, language, and creation date
- Webview panel lists all transcripts with timestamps and durations

## Time Tracking

Track time per task, stored as plain daily files.

- Start, stop, and toggle a timer from the Command Palette or the status bar
- Time accrues to the active task in small slots while the timer runs
- Per-day, per-user data stored as JSON under `.vscode/sonara/time-tracker/days/`
- Open today's file with `Sonara: Open Today's Time Tracker File`
- Every command is logged to the **Sonara Time Tracker** output channel, with the error and its stack trace when something fails
