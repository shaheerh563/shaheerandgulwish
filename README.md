# Wedding RSVP Page

Open `index.html` in a browser to preview the RSVP page.

For public hosting and the custom domain setup, see `DEPLOYMENT.md`.

The form sends RSVP submissions to:

`https://script.google.com/macros/s/AKfycbw0HRAYXxJz98EdVpJ5tfNLX1dWzoke1C0kqoNETxBIjEW8avbRHbfnWdQDJSKbirbPZw/exec`

## Fields sent to Google Sheets

- `event`
- `event_city`
- `event_date`
- `family`
- `name`
- `phone`
- `email`
- `attending`
- `guest_count_male`
- `guest_count_female`
- `guest_count`
- `message`
- `submitted_at`
- `source`

## Apps Script

If your current Apps Script uses different field names, replace it with the code in `google-apps-script-example.gs`, then redeploy the web app.

Recommended deployment settings:

- Execute as: `Me`
- Who has access: `Anyone`
