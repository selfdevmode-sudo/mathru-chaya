# Temple / Pond Construction — Website + Admin

A [Next.js](https://nextjs.org) website for a traditional temple & pond construction
contractor, with a simple password-protected admin at **`/admin`** for managing the
content shown on the site.

- **No database, no external CMS.** Content lives in a single file (`data/content.json`)
  and uploaded photos in a folder (`public/uploads/`). Everything sits on the
  filesystem of whatever machine runs the app.
- **Three languages** in the interface (English / ಕನ್ನಡ / हिंदी); English is the default.
- The site is public; only `/admin` needs the password.

---

## 1. What you need

- **Normal setup:** [Node.js](https://nodejs.org) **20 or newer** and npm.
- **Docker setup:** just [Docker](https://www.docker.com/) (Node is not needed on the host).

Two settings are read from **environment variables** (see `.env.example`):

| Variable         | What it is                                        |
| ---------------- | ------------------------------------------------- |
| `ADMIN_PASSWORD` | The password to log in to `/admin`.               |
| `SESSION_SECRET` | Any long random string — keeps the login secure.  |

---

## 2. Run it normally (with Node)

```bash
# 1. Install dependencies (first time only)
npm install

# 2. Create your settings file, then edit it to set your own password + secret
cp .env.example .env

# 3a. Development mode (auto-reloads as you edit) -> http://localhost:3000
npm run dev

# 3b. OR production mode
npm run build
npm start                     # -> http://localhost:3000
```

Open **http://localhost:3000** for the site and **http://localhost:3000/admin** for the
admin (log in with your `ADMIN_PASSWORD`).

---

## 3. Run it with Docker

Easiest way is **Docker Compose** (one command). Edit the password and secret in
`docker-compose.yml` first, then:

```bash
docker compose up -d --build      # builds the image and starts it in the background
```

The site is now at **http://localhost:3000**. To stop it: `docker compose down`.

Prefer plain Docker? Build and run manually:

```bash
# build the image
docker build -t temple-site .

# run it (change the password + secret)
docker run -d --name temple-site -p 3000:3000 \
  -e ADMIN_PASSWORD="your-password" \
  -e SESSION_SECRET="a-long-random-string" \
  -v "$(pwd)/data:/app/data" \
  -v "$(pwd)/public/uploads:/app/public/uploads" \
  temple-site
```

> **Why the `-v` volumes?** They keep your content (`data/`) and uploaded photos
> (`public/uploads/`) on the host, so nothing is lost when the container is rebuilt or
> restarted. Without them, content added through the admin would disappear on the next
> `docker compose up --build`.

---

**If `docker compose up --build` fails** with a `buildx ... permission denied` error
(a Docker Desktop config quirk, not this project), either fix the permissions
(`sudo chown -R "$(whoami)" ~/.docker`) or build with the classic builder and run it
directly:

```bash
DOCKER_BUILDKIT=0 docker build -t temple-site .
docker run -d --name temple-site -p 3000:3000 \
  -e ADMIN_PASSWORD="your-password" \
  -e SESSION_SECRET="a-long-random-string" \
  -v "$(pwd)/data:/app/data" \
  -v "$(pwd)/public/uploads:/app/public/uploads" \
  temple-site
```

Stop/remove it later with `docker rm -f temple-site`.

---

## 4. Everyday use

- **Add/edit projects, awards, testimonials, about text, and site info:** log in at
  `/admin` and use the forms. Photos upload straight from the form.
- **Change the business name, phone, WhatsApp, region:** `/admin` → *Site info*.
- **Change the admin password:** edit `ADMIN_PASSWORD` (in `.env`, or the compose file /
  `docker run -e`) and restart the app.

## 5. Where things live

| Thing                  | Location            |
| ---------------------- | ------------------- |
| All site content       | `data/content.json` |
| Uploaded photos        | `public/uploads/`   |
| Interface translations | `lib/i18n.ts`       |
| Styles / theme         | `app/globals.css`   |

The sample content that ships with the project is just a placeholder — delete it from the
admin and add the real projects and photos.

## 6. Hosting note

Because the admin writes to `data/content.json` and `public/uploads/` at request time,
this app needs a host with a **persistent, writable disk** — a normal VPS, or a
container/platform with a mounted volume (Render, Railway, Fly.io, etc.). It will **not**
work on static-export or ephemeral serverless hosting (e.g. Vercel's default), where
uploads and edits would be lost.
