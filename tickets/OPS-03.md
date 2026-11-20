# OPS-03 Checkpoint takes only what the build uses (Nov 18)

**Status: prepared and dry-run tested; NOT swapped in yet.** `work/checkpoint.py` is untouched (sha256 fe0c0a1a…) because
PROD-09 is using it. On the PM's word that PROD-09 is done: `python work/ops03/swap.py`. It refuses if `work/checkpoint.py`
has changed since I copied it; otherwise it swaps the file and updates DEVELOPER.md and AGENTS.md.

Jenny: "please fix that issue. So that each checkpoint only takes the files that the build actually uses."

## What changes
Today the script copies every `work/cpNN*/` folder, all ticket evidence including PNGs, and runtime copies. New version
(`work/ops03/checkpoint.py`, made by `make.py` from `checkpoint-before.py`, the exact copy of today's):

**Commits by default:**
- the published UAT runtime (as before);
- the published build's own work folder only: the folder whose release.html matches the published UAT, or `--build`.
  It takes source and scripts, never `boot*/`, `game*/`, `art/`, `logs/` or `*-game.json`;
- that build's ticket: the evidence folder named in its `publication-manifest.json` (text files), plus
  `tickets/<ID>.md`, `-brief.md` and `-ticket.md`;
- the docs and the script (as before).

**Options to add more:**
- `--include work/<folder or file>` (repeatable), for example the source folder a build copies its blocks from;
- `--ticket <ID>`, `--evidence <folder>`;
- `--png` for the evidence folders' PNG stills.

PNG stills are off by default because the build doesn't use them; they were most of the size.

**Kept:** `--dry-run`, `--message`, `--exclude`, the banned list (Screenshots/, ibear-*, ref-*, keystores, .env, phone/,
backups/), .gitignore (WAV/MP3), the 5 MB stop, wip/uat only (refuses main), and never deleting.

**Also:** the read-only git calls use `--no-optional-locks`, so a dry run never takes the repo's index lock while someone
else is committing.

## Dry runs (published UAT 105, repo on wip/uat; nothing copied)
| | files | size |
|---|---|---|
| Today's script | 489 | 466.7 MB (includes cp87, cp86-meow-face, cp74-hug review copies, CP-86 mock-up PNGs) |
| New, default | 47 | 4.7 MB: runtime index.html, work/cp105 sources, CP-72 report + uat105 text evidence, docs |
| New, `--png` | 113 | 115.4 MB (the uat105 evidence PNGs) |
| New, `--build work/cp106-hug --include work/cp74-hug/release` | 41 | 5.1 MB, no runtime copies |

Outputs: `work/ops03/old-dryrun.txt` and `new-dryrun.txt`. The dry runs used copies with the folder root adjusted
(`dryrun-old.py`, `dryrun-new.py`) because the script finds the project folder from its own location.

## Docs (applied by swap.py)
- **DEVELOPER.md, "GitHub WIP checkpoint":** the new default and options.
- **AGENTS.md:** the close-out line mentions `--include` for builds that copy blocks from a source folder.
