# ADR-0004 Repository layout, archive and self-hosting

Status: accepted. Date: 2026-11-01. Amends ADR-0002. Decision 6 is amended by ADR-0005: the live site is on GitHub Pages, and your own server is the path for when the enquiry form is needed.

## Context

The owner asked for the code to be cleaned up, for everything outside or extra to go into an archive they can cut out and keep somewhere else, and for one clean copy they will host on their own server.

Before this change the working folder held the original zip, the company profile PDF, the original master spec and build prompt, and the repository two folders deep (`arq-website-package/arq-website-package/`). Inside the repository, documents were spread over `specs/`, `notes/`, `agents/`, `constitution.md` and `HANDOFF.md` at the top level, next to a generated master spec and a duplicate of the build prompt.

## Decision

1. **The repository is `arq-website/`, one level down.** The wrapper folder is gone.
2. **Inputs that are not part of the site go to `archive/`, next to the repository, never inside it.** The original zip, master spec and build prompt go to `archive/original-package/`. The company profile goes to `archive/company/`. The master spec generated inside the repository, and the script that generated it, go to `archive/retired-from-repo/`. The repository's copy of the build prompt was byte-identical to the original and was removed. `archive/README.md` lists every file and where it came from. Nothing in the repository reads from the archive, so the folder can be moved or deleted.
3. **The generated master spec is retired.** It was a concatenation of the documents now under `docs/`, so it went stale whenever one of them changed. The documents themselves are the source.
4. **The top level holds only what runs the site or starts a reader.** `README.md`, `AGENTS.md` (authoritative agent instructions, moved up from `agents/`), `CLAUDE.md` (a pointer to it), `package.json`, the lock file and the config files, plus `content/`, `data/`, `assets/`, `scripts/` and `ui/`.
5. **All documentation is under `docs/`.** `docs/specs/`, `docs/decisions/`, `docs/notes/`, `docs/prompts/` (the two reviewer prompts from `agents/prompts/`), `docs/screenshots/`, and `docs/constitution.md`, `docs/handoff.md`, `docs/architecture.md`, `docs/deploy.md`. Every path in the documents, `scripts/lint_content.py` and `.prettierignore` was rewritten to match.
6. **Self-hosting is the first deployment target.** `docs/deploy.md` covers one Node process behind Caddy or nginx with HTTPS, kept alive by systemd. This amends ADR-0002, which assumed Vercel. Nothing in the code depends on Vercel: the analytics package stays off (it only works on Vercel), the `VERCEL_ENV` checks fall through to the normal production behaviour, and the redirects are in `next.config.ts`.

## Consequences

- No source file moved, so imports and the build are unchanged. `npm install` was run again after the move because the workspace links in `node_modules/@arq` pointed at the old path.
- `docs/specs/001`'s layout tree was updated to the new tree. The rest of the specs keep their original wording; departures are recorded in ADR-0003.
- The enquiry rate limit lives in memory, so the server must run one process. `docs/deploy.md` says so.
- To bring the master spec back, `archive/retired-from-repo/build_master_spec.py` needs its paths updated to `docs/`.
