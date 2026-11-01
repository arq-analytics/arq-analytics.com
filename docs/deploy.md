# Hosting

The live site, `arqoneailabs.space`, is served by **GitHub Pages** from the `arq-analytics/arq-analytics.com` repository. Every push to `main` runs `.github/workflows/deploy-pages.yml`: install, `npm test`, `npm run build:static`, `npm run check:build`, then publish. If any step fails, nothing is published and the previous version stays live.

The same code can also run on your own server with the enquiry form working. That is the second half of this page.

## GitHub Pages (live)

GitHub Pages serves plain files only, so `npm run build:static` builds the site as files into `ui/frontend/out`. Compared with a server:

| On a server | On GitHub Pages |
| --- | --- |
| Contact page has the enquiry form, sent by email | Contact page shows WhatsApp, phone and email. There is no server to send the form |
| `/` and old URLs redirect with a 308 | Small redirect pages: `/`, `/index.html` and `/inner-page.html` go to `/en/`, `/portfolio-details.html` to `/en/products/` |
| Unknown pages get the site's not-found page | `404.html`, written by the build from the same copy |
| URLs without a trailing slash | Each page is a folder, so URLs end in `/`. Canonical links, hreflang and the sitemap match |

### Change the live site

Push to `main`. Follow the run under the repository's **Actions** tab, "Deploy to GitHub Pages". It takes a few minutes.

### Look at the static build first

```bash
npm run build:static
python -m http.server 3002 --bind 127.0.0.1 --directory ui/frontend/out
# open http://127.0.0.1:3002/
```

Built on Windows, Next 16.4.3 misnames its prefetch files (it keeps a backslash where it expects a slash), so the browser logs some 404s for `__next...__PAGE__.txt` and falls back to loading the whole page. Navigation still works. GitHub builds on Linux, where the names are right.

### Roll back

- **One version back:** in **Actions**, open the last good "Deploy to GitHub Pages" run and choose **Re-run all jobs**. It rebuilds that commit and publishes it.
- **The old site:** the previous static site is kept on the branch `main_backup_2026-11-01`. In **Settings > Pages**, set the source to "Deploy from a branch", pick that branch and `/ (root)`, and save. Switch back to "GitHub Actions" to return to this site.

### Settings that must stay

In **Settings > Pages**: source "GitHub Actions", custom domain `arqoneailabs.space`. "Enforce HTTPS" is off today; turning it on sends every visitor to `https://`.

## Your own server

The site is one Node.js process: 52 static pages plus one endpoint, `/api/enquiry`. There is no database, no login and nothing to migrate. A small Linux server (1 vCPU, 1 GB RAM) is enough. The same steps work on Windows with PowerShell syntax.

The steps below have not been run on a real server yet. They use only the commands this repository already runs locally (`npm ci`, `npm run build`, `npm run start`), and the build and start were checked on 2026-11-01.

### 1. What the server needs

- Node.js 20.9 or newer (the minimum for Next.js 16). Node 24 was used to build and test.
- A domain pointing at the server (an `A` record for `arqoneailabs.space` and `www`). Leave the mail records for `contact@arqoneailabs.space` untouched.
- Ports 80 and 443 open. Keep port 3000 closed to the outside; only the reverse proxy talks to it.

Python is not needed on the server. It runs only the content gate inside `npm test`.

### 2. Copy the code

Copy the `arq-website` folder without `node_modules`, `.next` and any `.env` file, for example to `/srv/arq-website`. With git, push the repository and clone it there.

### 3. Install and configure

```bash
cd /srv/arq-website
npm ci                                   # exact versions from package-lock.json
cp .env.example ui/frontend/.env.production.local
nano ui/frontend/.env.production.local   # fill in the values below
```

| Variable | Value | When it is read |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `https://arqoneailabs.space` | At build time. Canonical links, sitemap, Open Graph. Rebuild after changing it |
| `NEXT_PUBLIC_ANALYTICS` | `off` | At build time. The analytics package only works on Vercel, so keep it off on your own server |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` | your mail provider's SMTP details | At run time. Without them the form answers `503` and offers WhatsApp instead |
| `ENQUIRY_TO`, `ENQUIRY_FROM` | where enquiries go, and a sender address on your domain | At run time |

The file stays on the server. It is ignored by `.gitignore` and must never be copied back into the repository.

### 4. Build

```bash
npm run build          # about a minute; 58 routes
npm run check:build    # optional: SEO, contacts and CTA checks on the built pages
```

### 5. Keep it running with systemd

`/etc/systemd/system/arq-website.service`:

```ini
[Unit]
Description=ARQ ONE AI Labs website
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/srv/arq-website
Environment=NODE_ENV=production
ExecStart=/usr/bin/node node_modules/next/dist/bin/next start ui/frontend -p 3000 -H 127.0.0.1
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

```bash
sudo chown -R www-data:www-data /srv/arq-website
sudo systemctl daemon-reload
sudo systemctl enable --now arq-website
curl -I http://127.0.0.1:3000/en      # expect 200
```

`-H 127.0.0.1` keeps the app reachable only from the server itself. This exact command was run on 2026-11-01 against the local build: `/en` and `/sitemap.xml` answered 200, `/` redirected to `/en`, and the API rejected an empty request. Check `which node` and fix the path if Node lives elsewhere.

Run one process only. The enquiry rate limit (5 a minute per visitor) is kept in memory, so a cluster of processes would each keep their own count. pm2 works too, in fork mode, not cluster mode.

### 6. HTTPS in front

Either proxy works. Both pass the visitor's real address in `X-Forwarded-For`, which the enquiry rate limit uses. Without it, every visitor shares one limit.

**Caddy** fetches and renews the certificate by itself. `/etc/caddy/Caddyfile`:

```caddyfile
arqoneailabs.space {
	encode zstd gzip
	reverse_proxy 127.0.0.1:3000 {
		header_up X-Forwarded-For {remote_host}
	}
}

www.arqoneailabs.space {
	redir https://arqoneailabs.space{uri} permanent
}
```

**nginx**, with a certificate from certbot (`sudo certbot --nginx -d arqoneailabs.space -d www.arqoneailabs.space`):

```nginx
server {
    server_name arqoneailabs.space;
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $remote_addr;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    # certbot adds the listen 443 ssl lines here
}

server {
    server_name www.arqoneailabs.space;
    return 301 https://arqoneailabs.space$request_uri;
}
```

The proxy sets the header to the address it sees, rather than appending to one the visitor sent, so it cannot be faked.

### 7. Check it is live

1. `https://arqoneailabs.space` redirects to `/en`, and the old `/index.html` and `/portfolio-details.html` links redirect too.
2. `https://arqoneailabs.space/robots.txt` and `/sitemap.xml` show the real domain, not `localhost`.
3. Open the site on a phone in all four languages.
4. Send one real enquiry from `/en/contact` and confirm it reaches the inbox.
5. Submit the sitemap in the search console for the domain.

### 8. Update it later

```bash
cd /srv/arq-website
# copy the new files in, or: git pull
npm ci
npm run build
sudo systemctl restart arq-website
```

To roll back, keep the previous folder (for example `/srv/arq-website-previous`), point the service at it and restart.

### A staging copy

A second copy on, say, `staging.arqoneailabs.space` would be indexed by search engines, because `robots.txt` allows everything. Put it behind the proxy's basic auth (Caddy `basic_auth`, nginx `auth_basic`) until it replaces the live site.

## Vercel instead

The site also runs on Vercel unchanged. `docs/decisions/ADR-0002-deployment.md` lists what to check first.
