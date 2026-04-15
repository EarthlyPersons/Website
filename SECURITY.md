# Security Policy

## Supported versions

This repository follows a rolling release model on `main`.

## Reporting a vulnerability

Please do not open public issues for security vulnerabilities.

Report privately to the maintainer and include:

- affected area (frontend worker, backend worker, CI, etc.)
- reproduction steps
- impact assessment
- suggested mitigation (if available)

## Secrets handling

- Never commit credentials or service account JSON.
- Use Wrangler secrets for deployed workers.
- Use local `.env`/`.dev.vars` files only for local development.
