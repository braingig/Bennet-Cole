# Bennett & Cole

A complete React website built with the supported Vinext/Cloudflare Workers starter.

## Pages

Home, Our Firm, Practice Areas, four practice detail pages, Our People, three attorney profiles, a searchable/filterable insights library with six articles, Location, Contact, Privacy, Terms, and an owner-only consultation inbox. Unknown routes return HTTP 404. Page titles, robots.txt, and sitemap.xml are included.

## Local development

```sh
npm install
npm run dev -- --port 3020 --hostname 127.0.0.1
npm run build
```

The tracked `.openai/hosting.json` retains the existing Site identity and declares the D1 `DB` binding. Apply the generated migration to a local database after a build:

```sh
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_last_malice.sql
```

## Consultation requests

`POST /api/inquiries` validates and persists requests, gives each one a reference number, handles retries idempotently, checks same-origin submissions, and limits repeated requests using a hashed connection identifier. It does not email notifications. The displayed `.example` email address is retained at the user's request and cannot receive email.

`/inbox` uses Sites-owned ChatGPT sign-in. Server-side access checks restrict the inbox and request-status API to `INBOX_OWNER_EMAIL`. These runtime settings are configured as Sites secrets and must not be committed. Local `.dev.vars` is ignored.

- `INBOX_OWNER_EMAIL`: allowed owner account email.
- `INQUIRY_HASH_SALT`: server-side salt for the connection identifier.

## Design and motion

Shared charcoal, ivory, and bronze palette; locally hosted Montserrat/Poppins; consistent headers, footers, calls to action, spacious layouts, responsive navigation, section entrances, hero parallax, a one-time upward team-image reveal, hover accents, FAQ transitions, and reduced-motion support. Existing supporting subheadings were increased by 1px.

Original AI-created portraits and architectural imagery live in `public/images/`. The generated prompts and asset provenance are recorded in `asset-prompts.md`; these internal development notes are not shown to visitors.
