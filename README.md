# NeighborAGI_WEB

The commercial site, accounts, licensing and admin for NeighborAGI — one Cloudflare Worker that serves the
built site and a `/api` backend, over a free **D1** database, with support-chat images in **R2**.

Repo: `https://github.com/12azaiziaislam-code/NeighborAG_WEB.git`

## How it works

- A visitor sees the program's features and screenshots, then chooses **Download**. Downloading requires an
  account (email + username + password), after which the site sends them to the installer on Hugging Face:
  `https://huggingface.co/islamII3620/NeighborAGI/resolve/main/NeighborAGI-Setup-x64.exe`.
- **The account is the key.** After installing, the program asks the person to sign in with the same email.
  The account binds to that one device the first time (`POST /api/app/login`); signing in on a second device
  fails (`other_device`) until the admin unbinds it. If they have no account yet, the program sends them to the
  site to create one.
- Having an account is not the same as being allowed to run the program: the **admin activates** each account
  for a chosen span (years → minutes) and can extend, ban (for a span or forever), delete, unbind the device,
  or message the person. An admin message shows in the site's support thread **and** as an in-app notification.
- AI-usage permission is a **separate** project (`../alternateApiKey`) and is not handled here.

## Architecture

```
web/            the site (Vite + React + three.js), built to web/dist and served by the Worker
worker/index.js the API: auth, device binding, the download gate, admin, support chat
migrations/     the D1 schema
wrangler.toml   Worker + D1 + R2 bindings
```

## First-time setup

```bash
cd admin_Info/NeighborAGI_WEB
npm install

# 1) database + image store (free tiers)
npx wrangler d1 create neighboragi          # paste the printed database_id into wrangler.toml
npx wrangler r2 bucket create neighboragi-support-images
npx wrangler d1 execute neighboragi --remote --file migrations/0001_init.sql

# 2) secrets (kept out of the code and out of this repo)
npx wrangler secret put ADMIN_PASSWORD      # your admin password (never commit it)
npx wrangler secret put AUTH_PEPPER         # any long random string

# 3) build the site and deploy
npm run deploy
```

Day to day, deploys are automatic: the Worker is connected to this GitHub repo (Cloudflare Workers Builds), so every push to `main` builds and deploys the site. `npm run deploy` is only needed for a manual deploy.

To develop locally: `npm run db:init:local` then `npm run dev` (Worker + API) and `npm run dev:web` (site).

## API (summary)

| Route | Who | Purpose |
|---|---|---|
| `POST /api/signup` / `login` / `logout` | public | website account |
| `GET /api/me` | user | current account + access state |
| `GET /api/download` | user | returns the Hugging Face installer URL (gated by login) |
| `POST /api/app/login` | the program | sign in + bind the device + report access |
| `GET /api/app/status` | the program | access state + unread admin notifications |
| `GET/POST /api/support` | user | support thread (text + image) |
| `POST /api/admin/login` | admin | admin session (`ADMIN_EMAIL` + `ADMIN_PASSWORD`) |
| `GET /api/admin/users` | admin | every account with its details |
| `POST /api/admin/users/:id/{activate,extend,ban,unban,unbind,message}` | admin | the controls above |
| `DELETE /api/admin/users/:id` | admin | delete an account |
| `GET/POST /api/admin/users/:id/support` | admin | the support thread with that person |

## Security

- Passwords are stored only as salted **PBKDF2-SHA256** hashes with a server-side pepper (`AUTH_PEPPER`).
- The admin password is a Worker **secret**, never in the code or the repo.
- Each account is bound to its first device, so one account cannot run the program on several machines.
- Support images are private: only the owner and the admin can fetch them.
