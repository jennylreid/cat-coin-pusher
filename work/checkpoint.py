"""WIP checkpoint of the UAT source to GitHub (Jenny, Nov 12: "checkpoint the UAT source to a WIP branch on GitHub
after each build"). Since OPS-03 (Jenny, Nov 18: "each checkpoint only takes the files that the build actually uses") it
commits only the published build, never every work folder. Run it right after publishing a UAT:

    python work/checkpoint.py --dry-run          # show what would change; touches nothing
    python work/checkpoint.py                    # copy, commit on wip/uat, push
    python work/checkpoint.py --include work/cp74-hug/release   # also the source folder the build copies its blocks from
    python work/checkpoint.py --ticket CP-72     # also another ticket's report (and --evidence <folder> for its evidence)
    python work/checkpoint.py --png              # also the evidence folders' .png stills (big; off by default)
    python work/checkpoint.py --message "UAT 106: CP-74 Hug"    # ticket-specific commit subject

It copies into C:/Users/jenny/GitHub/cat-coin-pusher:
  - the published UAT runtime from uat/CatCoinPusher-UAT-game.json (index.html, img/, lib/; sounds/ is git-ignored),
  - the published build's own work folder only: the work/<folder> whose release-version.json and release.html match the
    published UAT (or --build work/<folder>): source and scripts (*.html *.js *.cjs *.py, *.json under 1 MB), skipping
    update-JSON copies (*-game.json), runtime copies (boot*/, game*/, art/), logs/ and Android/build trees,
  - anything named with --include (a work file or folder, same filters),
  - that build's ticket: the evidence folder its publication-manifest.json names (text files; its .png stills only with --png) plus
    tickets/<ID>.md, <ID>-brief.md and <ID>-ticket.md; --ticket and --evidence add more,
  - GAMEPLAY_DESIGN.md, SPEC.md, DEVELOPER.md, AGENTS.md, CODEX_BRIEF.md and this script.
Other engineers' work folders and prototypes are never swept in. It never copies Screenshots/, photos-private/, art-moodboard/, ibear-*, ref-*,
ref-other-pusher-*, keystores, .env, phone/ or backups/, honours the repo's .gitignore (no WAV/MP3), stops if any file is
over 5 MB, only ever commits on wip/uat (main stays sign-off only), and never deletes anything from the repo.
"""
import argparse, base64, fnmatch, hashlib, json, re, subprocess, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]                 # the CoinPusher folder
REPO = Path(r'C:/Users/jenny/GitHub/cat-coin-pusher')
BRANCH = 'wip/uat'
MAX_FILE = 5 * 1024 * 1024                                 # stop and ask above this
MAX_JSON = 1024 * 1024                                     # "small" json
PNG_FROM_TICKET = 33                                       # .png evidence only for CP-33 and later (older is ~1.5 GB)
DOCS = ['GAMEPLAY_DESIGN.md', 'SPEC.md', 'DEVELOPER.md', 'AGENTS.md', 'CODEX_BRIEF.md', 'work/checkpoint.py']
WORK_EXT = {'.html', '.js', '.cjs', '.py', '.json'}
TICKET_TEXT_EXT = {'.md', '.txt', '.json', '.jsonl', '.csv', '.log', '.diff', '.html', '.svg', '.js', '.cjs', '.py'}
SKIP_DIRS = {'android', 'build', 'build-app', 'intermediates', '.gradle', 'node_modules', 'assets', 'runtime',
             'backups', 'phone', 'Screenshots', '__pycache__', 'art', 'logs'}
SKIP_DIR_PREFIX = ('boot', 'game')                         # runtime copies inside a build folder (boot106/, game104/)
BANNED = ['ibear-*', 'ref-*', 'ref-other-pusher-*', '*.keystore', '*.jks', '.env', '*.env', '*.apk', '*-game.json',
          '*.wav', '*.mp3']
CO_AUTHOR = 'Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>'


def git(*args, check=True, capture=True):
    r = subprocess.run(['git', '-C', str(REPO), *args], capture_output=capture, text=True)
    if check and r.returncode:
        sys.exit('git %s failed:\n%s%s' % (' '.join(args), r.stdout or '', r.stderr or ''))
    return (r.stdout or '').strip()


def banned(rel):
    parts = Path(rel).parts
    if any(p in ('phone', 'backups', 'Screenshots', 'photos-private', 'art-moodboard') for p in parts):  # PROD-11: Jenny's private photos, third-party references
        return True
    return any(fnmatch.fnmatch(parts[-1].lower(), pat) for pat in BANNED)


def published():
    """The published UAT: version, name and runtime files, straight from the UAT update JSON."""
    j = json.loads((ROOT / 'uat/CatCoinPusher-UAT-game.json').read_text(encoding='utf-8'))
    files = {k: base64.b64decode(v) for k, v in j['files'].items()}
    src = None  # the work folder whose release.html is what was published (for the report)
    for rv in sorted(ROOT.glob('work/*/release-version.json')):
        try:
            if json.loads(rv.read_text())['version'] == j['version'] and (rv.parent / 'release.html').read_bytes() == files['index.html']:
                src = rv.parent.relative_to(ROOT).as_posix()
        except Exception:
            pass
    return j['version'], j['displayName'], files, src


def folder_files(rel_dir):
    """Source and scripts in one work file or folder (repo-relative), with the usual filters."""
    base = ROOT / rel_dir
    if base.is_file():
        yield base.relative_to(ROOT)
        return
    if not base.is_dir():
        sys.exit('Not found: %s' % rel_dir)
    for f in sorted(base.rglob('*')):
        rel = f.relative_to(ROOT); inner = f.relative_to(base).parts[:-1]
        if not f.is_file() or f.suffix.lower() not in WORK_EXT:
            continue
        if SKIP_DIRS & set(inner) or any(p.startswith(SKIP_DIR_PREFIX) for p in inner):
            continue
        if f.name.endswith('-game.json') or (f.suffix.lower() == '.json' and f.stat().st_size > MAX_JSON):
            continue
        yield rel


def build_ticket(build):
    """The ticket ID and evidence folder a build's publication-manifest.json names (tickets/<ID>-evidence/...)."""
    try:
        ev = json.loads((ROOT / build / 'publication-manifest.json').read_text())['evidence']
    except Exception:
        return None, None
    m = re.match(r'tickets/([A-Z]+-[0-9]+)-evidence/', ev)
    return (m.group(1) if m else None), ev


def ticket_files(ids, folders, png=False):
    """Each ticket's report, brief and ticket .md, and the named evidence folders (text; .png from CP-33 on only with --png)."""
    for t in ids:
        for name in (t + '.md', t + '-brief.md', t + '-ticket.md'):
            if (ROOT / 'tickets' / name).is_file():
                yield Path('tickets') / name
    for d in folders:
        for f in sorted((ROOT / d).rglob('*')):
            if not f.is_file():
                continue
            rel = f.relative_to(ROOT); ext = f.suffix.lower()
            if ext in TICKET_TEXT_EXT:
                if ext == '.json' and f.stat().st_size > MAX_JSON:
                    continue
                yield rel
            elif ext == '.png' and png:
                m = re.match(r'CP-([0-9]+)', rel.parts[1])
                if m and int(m.group(1)) >= PNG_FROM_TICKET:
                    yield rel


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--dry-run', action='store_true', help='list what would change; copy, commit and push nothing')
    ap.add_argument('--message', help='ticket-specific commit subject; checkpoint details are retained')
    ap.add_argument('--exclude', action='append', default=[], help='repo-relative file or folder to leave out of this checkpoint')
    ap.add_argument('--build', help="the published build's work folder (default: the one whose release.html matches the published UAT)")
    ap.add_argument('--include', action='append', default=[], help='an extra work file or folder to commit (repeatable), e.g. work/cp74-hug/release')
    ap.add_argument('--ticket', action='append', default=[], help="an extra ticket ID whose report and brief to commit (repeatable)")
    ap.add_argument('--evidence', action='append', default=[], help='an extra evidence folder to commit (repeatable)')
    ap.add_argument('--png', action='store_true', help='also commit the .png stills in the evidence folders (off by default: the build does not use them)')
    a = ap.parse_args()

    branch = git('--no-optional-locks', 'branch', '--show-current')
    if branch == 'main':
        sys.exit('Refusing: the repo is on main, which is sign-off only. Run: git -C "%s" switch %s' % (REPO, BRANCH))
    if branch != BRANCH:
        sys.exit('Refusing: the repo is on %r, not %s.' % (branch, BRANCH))
    if git('--no-optional-locks', 'status', '--porcelain'):
        sys.exit('Refusing: the repo has uncommitted changes; sort those out first:\n' + git('status', '--short'))

    version, name, runtime, src = published()
    norm = lambda p: p.replace(chr(92), '/').rstrip('/')
    build = norm(a.build or src or '')
    if not build:
        sys.exit('Refusing: no work folder matches the published UAT; name it with --build work/<folder>.')
    tid, ev = build_ticket(build)
    tickets = ([tid] if tid else []) + a.ticket
    evidence = ([ev] if ev else []) + [norm(e) for e in a.evidence]
    plan = {}  # repo-relative path -> bytes
    for k, b in runtime.items():
        if k == 'index.html' or k.startswith(('img/', 'lib/')):
            plan[k] = b
    work = [r for d in [build, *a.include] for r in folder_files(norm(d))]
    for rel in [*work, *ticket_files(tickets, evidence, a.png), *[Path(d) for d in DOCS if (ROOT / d).is_file()]]:
        plan[rel.as_posix()] = (ROOT / rel).read_bytes()

    plan = {k: v for k, v in plan.items() if not banned(k)}
    # -z: in text mode Windows wrote \r\n, so every path but the last carried a \r and no ignore ever matched (CP-51, Nov 16)
    ignored = set(subprocess.run(['git', '-C', str(REPO), 'check-ignore', '--stdin', '-z'], input='\0'.join(plan),
                                 capture_output=True, text=True).stdout.split('\0')) - {''}
    changed = {k: v for k, v in plan.items() if k not in ignored and
               (not (REPO / k).is_file() or (REPO / k).read_bytes() != v)}
    changed = {k: v for k, v in changed.items() if not any(k == x.rstrip('/') or k.startswith(x.rstrip('/') + '/') for x in a.exclude)}
    big = sorted(changed.items(), key=lambda kv: -len(kv[1]))
    total = sum(len(v) for v in changed.values())
    print('Published UAT: %s (%s), source %s' % (name, version, src or 'not matched to a work folder'))
    print('Build folder %s%s; tickets %s; evidence %s' % (build, (' + ' + ', '.join(a.include)) if a.include else '',
          ', '.join(tickets) or 'none', ', '.join(evidence) or 'none'))
    print('%d files to add or update, %.1f MB; %d git-ignored skipped' % (len(changed), total / 1e6, len(ignored)))
    for k, v in big[:10]:
        print('  %8.2f MB  %s' % (len(v) / 1e6, k))
    over = [k for k, v in big if len(v) > MAX_FILE]
    if over:
        sys.exit('Stopping: over 5 MB, ask the PM first:\n  ' + '\n  '.join(over))
    if a.dry_run or not changed:
        print('Dry run: nothing copied.' if a.dry_run else 'Nothing changed since the last checkpoint.')
        return

    for k, v in changed.items():
        p = REPO / k; p.parent.mkdir(parents=True, exist_ok=True); p.write_bytes(v)
    paths = sorted(changed)
    for i in range(0, len(paths), 200):
        git('add', '--', *paths[i:i + 200])
    staged = git('diff', '--cached', '--name-only').splitlines()
    bad = [s for s in staged if banned(s)]
    if bad:
        git('reset', '-q')
        sys.exit('Stopping: banned files were staged (unstaged again):\n  ' + '\n  '.join(bad))
    subject = a.message or 'WIP checkpoint: %s (%s)' % (name, version)
    git('commit', '-q', '-m', '%s\n\nSource: %s%s. Copied by work/checkpoint.py (published build only, OPS-03).\n\n%s'
        % (subject, build, (' + ' + ', '.join(a.include)) if a.include else '', CO_AUTHOR))
    head = git('rev-parse', '--short', 'HEAD')
    git('push', '-q', '-u', 'origin', BRANCH, capture=False)
    print('Committed %s on %s (%d files, %.1f MB) and pushed.' % (head, BRANCH, len(staged), total / 1e6))


if __name__ == '__main__':
    main()
