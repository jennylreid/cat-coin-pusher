"""WIP checkpoint of the UAT source to GitHub (Jenny, Nov 12: "checkpoint the UAT source to a WIP branch on GitHub
after each build"). Run it right after publishing a UAT:

    python work/checkpoint.py            # copy, commit on wip/uat, push
    python work/checkpoint.py --dry-run  # show what would change; touches nothing

It copies into C:/Users/jenny/GitHub/cat-coin-pusher:
  - the published UAT runtime from uat/CatCoinPusher-UAT-game.json (index.html, img/, lib/; sounds/ is git-ignored),
  - every work/cpNN/ and work/cpNN-*/ folder's source and scripts (*.html *.js *.cjs *.py, *.json under 1 MB), skipping
    update-JSON copies (*-game.json), Android/build trees and runtime copies,
  - tickets/: reports, briefs and text evidence, and .png evidence for tickets from CP-33 on (PNG_FROM_TICKET),
  - GAMEPLAY_DESIGN.md, SPEC.md, DEVELOPER.md, AGENTS.md, CODEX_BRIEF.md.
It never copies Screenshots/, ibear-*, ref-*, ref-other-pusher-*, keystores, .env, phone/ or backups/, honours the
repo's .gitignore (no WAV/MP3), stops if any file is over 5 MB, only ever commits on wip/uat (main stays sign-off only),
and never deletes anything from the repo.
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
             'backups', 'phone', 'Screenshots', '__pycache__'}
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
    if any(p in ('phone', 'backups', 'Screenshots') for p in parts):
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


def work_files():
    for d in sorted((ROOT / 'work').iterdir()):
        if not (d.is_dir() and re.fullmatch(r'cp\d+(-.+)?', d.name)):
            continue
        for f in d.rglob('*'):
            rel = f.relative_to(ROOT)
            if not f.is_file() or f.suffix.lower() not in WORK_EXT or SKIP_DIRS & set(rel.parts[2:-1]):
                continue
            if f.name.endswith('-game.json') or (f.suffix.lower() == '.json' and f.stat().st_size > MAX_JSON):
                continue
            yield rel


def ticket_files():
    for f in sorted((ROOT / 'tickets').rglob('*')):
        if not f.is_file():
            continue
        rel = f.relative_to(ROOT); ext = f.suffix.lower()
        if ext in TICKET_TEXT_EXT:
            if ext == '.json' and f.stat().st_size > MAX_JSON:
                continue
            yield rel
        elif ext == '.png':
            m = re.match(r'CP-(\d+)', rel.parts[1])
            if m and int(m.group(1)) >= PNG_FROM_TICKET:
                yield rel


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--dry-run', action='store_true', help='list what would change; copy, commit and push nothing')
    a = ap.parse_args()

    branch = git('branch', '--show-current')
    if branch == 'main':
        sys.exit('Refusing: the repo is on main, which is sign-off only. Run: git -C "%s" switch %s' % (REPO, BRANCH))
    if branch != BRANCH:
        sys.exit('Refusing: the repo is on %r, not %s.' % (branch, BRANCH))
    if git('status', '--porcelain'):
        sys.exit('Refusing: the repo has uncommitted changes; sort those out first:\n' + git('status', '--short'))

    version, name, runtime, src = published()
    plan = {}  # repo-relative path -> bytes
    for k, b in runtime.items():
        if k == 'index.html' or k.startswith(('img/', 'lib/')):
            plan[k] = b
    for rel in [*work_files(), *ticket_files(), *[Path(d) for d in DOCS if (ROOT / d).is_file()]]:
        plan[rel.as_posix()] = (ROOT / rel).read_bytes()

    plan = {k: v for k, v in plan.items() if not banned(k)}
    ignored = set(subprocess.run(['git', '-C', str(REPO), 'check-ignore', '--stdin'], input='\n'.join(plan),
                                 capture_output=True, text=True).stdout.split('\n')) - {''}
    changed = {k: v for k, v in plan.items() if k not in ignored and
               (not (REPO / k).is_file() or (REPO / k).read_bytes() != v)}
    big = sorted(changed.items(), key=lambda kv: -len(kv[1]))
    total = sum(len(v) for v in changed.values())
    print('Published UAT: %s (%s), source %s' % (name, version, src or 'not matched to a work folder'))
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
    git('commit', '-q', '-m', 'WIP checkpoint: %s (%s)\n\nSource: %s. Copied by work/checkpoint.py.\n\n%s'
        % (name, version, src or 'uat/CatCoinPusher-UAT-game.json', CO_AUTHOR))
    head = git('rev-parse', '--short', 'HEAD')
    git('push', '-q', '-u', 'origin', BRANCH, capture=False)
    print('Committed %s on %s (%d files, %.1f MB) and pushed.' % (head, BRANCH, len(staged), total / 1e6))


if __name__ == '__main__':
    main()
