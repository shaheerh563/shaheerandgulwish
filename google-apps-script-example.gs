const SPREADSHEET_ID = "1REZHxDQzsqDRJ_Wvqj1OcGyYSngY0smH1HN3KdSKzGk";

const NIKKAH_SHEET = "Nikkah RSVP";
const WALIMA_SHEET = "Walima RSVP";

const HEADERS = [
  "Timestamp",
  "Event",
  "City",
  "Event Date",
  "Family",
  "Name",
  "Phone",
  "Email",
  "Attending",
  "Guest Count",
  "Message",
  "Source"
];

function doPost(e) {
  try {
    const values = e.parameter || {};
    const eventName = String(values.event || "").toLowerCase();
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheetName =
      eventName.includes("toronto") || eventName.includes("nikkah")
        ? NIKKAH_SHEET
        : WALIMA_SHEET;
    const sheet = getSheet(spreadsheet, sheetName);

    sheet.appendRow([
      new Date(),
      values.event || "",
      values.event_city || "",
      values.event_date || "",
      values.family || "",
      values.name || "",
      values.phone || "",
      values.email || "",
      values.attending || "",
      values.guest_count || "",
      values.message || "",
      values.source || ""
    ]);

    return jsonResponse({ success: true });
  } catch (err) {
    return jsonResponse({
      success: false,
      error: err.toString()
    });
  }
}

function doGet() {
  return ContentService
    .createTextOutput("RSVP API ONLINE")
    .setMimeType(ContentService.MimeType.TEXT);
}

function getSheet(spreadsheet, sheetName) {
  let sheet = spreadsheet.getSheetByName(sheetName);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
  }

  return sheet;
}

function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
