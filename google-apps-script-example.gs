const SHEET_NAME = "RSVP Responses";

function doPost(e) {
  const sheet = getSheet();
  const values = e.parameter || {};

  sheet.appendRow([
    new Date(),
    values.event || "",
    values.event_city || "",
    values.event_date || "",
    values.name || "",
    values.phone || "",
    values.email || "",
    values.attending || "",
    values.guest_count || "",
    values.message || "",
    values.source || ""
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ result: "success" }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  return ContentService
    .createTextOutput("Wedding RSVP endpoint is live.")
    .setMimeType(ContentService.MimeType.TEXT);
}

function getSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "Timestamp",
      "Event",
      "City",
      "Event Date",
      "Name",
      "Phone",
      "Email",
      "Attending",
      "Guest Count",
      "Message",
      "Source"
    ]);
  }

  return sheet;
}
