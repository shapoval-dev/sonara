# Review

[Back to Sonara](../README.md)

## Review workflow

Review uncommitted changes in steps instead of two buckets (changed / staged). Built for code written by AI agents: mark what you have already read, and anything the agent changes afterwards comes back as new.

- Five levels, from top to bottom: **Staged Changes**, **Verified**, **Read**, **Queued**, **New**. Staged Changes is the real git stage; the other levels are kept by the extension
- **Backlog** is a level shown under New for changes you do not want to look at yet, such as edits of temporary or system files. It works like the other levels: it keeps the accepted version of the file, a file or a single change can be moved there from any level with **Move to Backlog** (from New also with **Move Down**), and from there to any level. A new edit of a file always lands on New, even when its earlier changes are on Backlog: the backlog changes stay where they are, the new edit shows on New next to them. The badge, the status bar and `new: N` do not count Backlog
- Every git repository of the window is reviewed at once, the same repositories Source Control shows. With several of them the panel shows one row per repository, `new: N · changed: N · lines: N` (the last number is how many lines the files tracked by git have on disk now, not a sum of the levels), with its levels inside, the way Source Control groups changes; with one repository the levels sit at the top. Each repository keeps its levels in its own `.vscode/sonara/review/`
- The Review view carries a badge with the number of files that have changes on New in all repositories, so a glance at the sidebar is enough to see there is something to look at; hover it for their lines
- The panel lists exactly the files git reports as changed, grouped by level, as a folder tree or a flat list (`sonara.review.viewMode` and `sonara.review.compactFolders`). Each level shows `files: N (A… M… D…) · lines: +X -Y`: how many files were added, modified and deleted, and how many lines were added and removed, the way git counts them; a binary file has no lines
- A file row carries one status letter on the right, Sonara's own, in the usual git colors: what happened to the file on this level compared with the level below (`A` added, `M` modified, `D` deleted, `U` conflict). The git letters and colors that other views put on files are left out of the panel
- Each file shows its added and removed lines on this level (`+X -Y`); a binary file shows none
- Each folder shows how many changed files it holds, subfolders included, and their lines (`files: N · lines: +X -Y`); hover it for the same summary as a level
- A repository, a level and a folder have **Expand All** and **Collapse All** buttons that open or close everything inside them, folders included; Collapse All keeps the level or folder itself open
- A git worktree (a second working copy of a repository, such as one an agent made for its branch) gets its own row right under the repository it belongs to, with a forked icon and its branch in brackets: `api (branch fix-login)`; the tooltip names the main repository. Sonara asks git for the worktrees of every open repository and opens the ones inside the workspace through the built-in Git extension, so they show up in Review and Source Control without opening a file from them first
- With the [Git Graph](https://marketplace.visualstudio.com/items?itemName=mhutchie.git-graph) extension installed, a repository row has an **Open Git Graph** button that opens the commit graph of that repository; with one repository the button sits in the title of the Review view. Without Git Graph the button is not shown
- Move a folder, a file, or a whole level with **Move Up**, **Move Down**, or straight to a level with **Move to Read**, **Move to Verified** and the rest, right in the context menu. Moving to Staged Changes stages the changes, moving down from it unstages them
- Click a file to open the changes of that level only: the left side is `HEAD` plus all levels above, the right side adds this level. Both sides are read-only; **Open File** opens the real file for editing, and for a markdown file **Open Preview** renders the right side in a tab of the same column; for an HTML file **Open in Browser** opens the file from disk in the default browser
- A binary file is not forced into a text comparison: both versions open side by side in one Sonara tab, before on the left and after on the right, with their sizes: an image as an image, audio in a player, video in a video player; other types show their sizes only. An SVG image opens the same way, as pictures before and after, although git sees it as text. Images have a zoom bar: zoom out, zoom in, Fit to Window and 100%, and Ctrl with the mouse wheel zooms around the pointer; both sides share the zoom and scroll together. AAC sound plays the same way as in the Media Preview below: from a copy with the sound converted to MP3. The two audio or video players are linked: play, pause, seeking and speed on one are repeated on the other, so both stay on the same second; when one version is shorter, it stops on its last frame while the longer one goes on, and seeking back brings both together again. The tab is reused: clicking the next binary file replaces its content instead of opening another tab. Levels keep copies of binary files up to 50 MB, so any level opens as a before/after pair; a larger file is kept by its fingerprint only, and a side that was not kept, was added or was deleted says so in its place
- **Revert Changes** in the context menu of a file or folder undoes the action of the level it is on, after a confirmation. On every level except Staged Changes (New, Backlog, Queued, Read, Verified: for git they are all one layer, the working tree) the files on disk go back to what is staged: a deleted file comes back, a changed file is restored, a file that is not staged is moved to the Trash; the index is never touched. On Staged Changes the files go back to `HEAD`, staged and on disk. It cannot be undone, so the confirmation says what will be lost
- **Open with Default Application** in the context menu of a file (Review and Code Map) opens it with the program the operating system picks for its type, a PDF in the PDF viewer for example
- The context menu of a file or folder also has the usual actions: **Open Containing Folder**, **Copy Path**, **Copy Relative Path** and **Delete** (moves it to the Trash after a confirmation; a folder goes with everything in it, including files without changes). Copy and Delete work on every selected row. The `...` button on a row opens the same actions as a list, for touch screens and anywhere a right click is out of reach
- A created or deleted file shows one row of actions, not two: its existence travels with its content, and only a mode change keeps a row of its own, and its actions are named **Move Permissions Up** and so on, so the two rows are never confused
- Move a single change from the level diff with the CodeLens above it or with `Sonara: Move Change Up` / `Move Change Down` / `Move Change to Level...` for the change under the cursor
- `Sonara: Next New Change` / `Previous New Change` walk through everything on New across files and repositories
- Any edit - yours or an agent's - lands on New and shows as the difference from the version you accepted; the accepted version stays on its level
- Staging through the regular Source Control view counts as Staged Changes, and unstaging there drops the changes one level down, to Verified. Committed parts leave the panel; after `git stash` and `git stash pop` the levels come back if the files return byte-identical
- Every action is logged to the **Sonara Review** output channel, failures with their stack trace
- Stored under `.vscode/sonara/review/`

## Read-only CLI
Sonara writes a project-specific launcher to `.vscode/sonara/review/sonara-review` (and `sonara-review.cmd` for Windows). Open the project in VS Code to refresh the launcher after moving the extension or repository. Run from the project directory:

```sh
.vscode/sonara/review/sonara-review levels
.vscode/sonara/review/sonara-review list --level new
.vscode/sonara/review/sonara-review changes src/example.ts
.vscode/sonara/review/sonara-review show src/example.ts --level read
.vscode/sonara/review/sonara-review diff src/example.ts --level new --format text
```

The available levels are `new`, `backlog`, `queued`, `read`, `verified` and `staged`. JSON is the default output format; use `--format text` for human-readable output. Run `help` for usage. The CLI reads review state, not the agent's task list, and does not change review levels or Git staging.
