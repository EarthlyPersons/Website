# Contributing Guide

Thanks for contributing to this project.

## Development setup

1. `npm install`
2. `npm run setup:local`
3. Fill `client/.env.local` and `server/.dev.vars`
4. `npm run dev`

## Quality gate

Before opening a PR:

- `npm run lint`
- `npm run typecheck`
- `npm run build`

## Pull requests

- Keep PRs focused and small when possible.
- Explain user impact, not only code changes.
- Update docs when behavior or setup changes.
- Do not commit secrets (`.env`, service account JSON, private keys).
