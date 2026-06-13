# Publish the RSVP Page

The finished website files are in this folder. To make a real public link, host this folder with a static website host, then connect your custom domain.

## Suggested Domain

Use:

`www.shaheerandgulwish.com/rsvp`

Also connect:

`shaheerandgulwish.com`

The `www` version is the main address guests can type. The RSVP page should live inside an `/rsvp` folder.

## Easy Hosting Option: Netlify

1. Go to Netlify.
2. Choose Add new site.
3. Upload this `rsvp` folder.
4. Netlify will give you a temporary website link.
5. Add your custom domain: `www.shaheerandgulwish.com`.
6. Follow Netlify's DNS instructions at your domain registrar.

Typical DNS records:

| Host | Type | Value |
| --- | --- | --- |
| `www` | `CNAME` | Your Netlify site address |
| `@` | `A` | Netlify's apex records, shown inside Netlify |

Use the exact DNS values Netlify shows for your site.

## GitHub Pages Option

The included `CNAME` file is ready for GitHub Pages and contains:

`www.shaheerandgulwish.com`

After uploading the site to GitHub Pages, add these DNS records at your domain registrar:

| Host | Type | Value |
| --- | --- | --- |
| `www` | `CNAME` | Your GitHub Pages address |
| `@` | `A` | GitHub Pages apex IPs |

Use GitHub's current listed IP addresses from your GitHub Pages settings.

## Google Sheet

The page is already connected to your Apps Script URL in `script.js`. After publishing the website, submit one test RSVP and confirm that it appears in the Google Sheet.
