# Cat Coin Pusher

A coin-pusher arcade game for Android phones, starring a tuxedo cat. Tap to drop coins, which fall from the top of
the screen with a sparkling trail, push prizes off the table, and use cat powers like Paw Sweep and Catquake to clear each board.

It's a single-file HTML/JavaScript game (`index.html`) with real physics from [Rapier](https://rapier.rs/),
wrapped in a small Android app (`android/`) that runs the game and fetches game updates without a reinstall.

## How it was made

My role is product owner: I decide what to build and perform UAT. I automate all steps where a human adds no value. 

- **Claude** is the product manager: it turns my ideas into prompts, adds those to tickets to a kanban and seeds new Codex conversations. 
- **Codex** is the engineer: it executes on the prompt, tests it and writes a report in `tickets/`.
- Every change goes to a separate **UAT** (test) app before I approve it for release to production. 

More about how I work: [my GitHub profile](https://github.com/jennylreid).

## Timeline

| Date | Milestone |
|---|---|
| Oct 10, 2026 | First phone release; the cat board with Rapier physics, Paw Sweep, sound effects, a second board |
| Oct 11 | Cosmic background; Catquake power; Developer mode; retrospective |
| Oct 12 | Ticketed work starts: safe-area fix (PROD-01); new faces and poses in UAT |
| Oct 13 | PROD-02: Rest, Waiting and Happy faces, brass pusher, comet-sparkle coin fall, 120 fps |
| Oct 15 | PROD-03: timing-based coin landing, easier Board 1. PROD-04: update check and readable build names |
| Oct 16 | APK 16 hotfix after APK 15 wouldn't open on the phone |
| Oct 17 | In testing: Board 3 with coin towers, the Quake coin, a dancing pose, tickle-the-paws |

The history before the move to GitHub was rebuilt from dated release backups: one commit per release,
dated when it was published.

## What's here

| Path | What it is |
|---|---|
| `index.html` | The game (latest test build) |
| `img/art/` | Game art |
| `lib/` | Rapier physics engine (Apache 2.0) |
| `android/` | Android wrapper app (Java) |
| `tests/` | Physics and gameplay regression tests (Node) |
| `tickets/` | Backlog, ticket briefs and the engineer's reports |
| `SPEC.md`, `ROADMAP.md`, `DEVELOPER.md` | Design, plans and engineering notes |
| `RETROSPECTIVE-2026-10-11.md` | What went wrong and right in the first two days |
| `cat-art/` | The cat from my finance app, which inspired this one |

Sound files aren't included (see [CREDITS.md](CREDITS.md)), so the game runs silently from this repository.
