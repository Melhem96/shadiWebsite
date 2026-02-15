/**
 * Google Apps Script Web App endpoint for store-onepager contact form.
 *
 * Setup (daily spreadsheet auto-create):
 * 1) Create a Google Drive folder where you want daily sheets stored.
 * 2) In Apps Script, set Script Property DAILY_FOLDER_ID to that folder ID.
 * 3) (Optional) Set DAILY_SHEET_PREFIX (default: "store-onepager-contact").
 * 4) Deploy as Web App: Execute as "Me", Who has access: "Anyone".
 *
 * Backward compatibility:
 * - If Script Property SPREADSHEET_ID is set, we will keep appending into that sheet.
 * - Otherwise we will create/use a daily spreadsheet.
 *
 * Expected JSON POST body:
 * { name, email, message, lang, pageUrl }
 */

function doPost(e) {
  try {
    var payload = {};

    // NOTE: When called from browsers, Content-Type may vary.
    // We primarily support JSON.
    if (e && e.postData && e.postData.contents) {
      payload = JSON.parse(e.postData.contents);
    }

    var name = String(payload.name || '').trim();
    var email = String(payload.email || '').trim();
    var message = String(payload.message || '').trim();
    var lang = String(payload.lang || '').trim();
    var pageUrl = String(payload.pageUrl || '').trim();

    if (!name || !email || !message) {
      return json_(400, { ok: false, error: 'Invalid payload' });
    }

    var ss = getTargetSpreadsheet_();
    var sheet = ss.getSheetByName('Contact') || ss.insertSheet('Contact');

    // Create header row if empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['timestamp', 'name', 'email', 'message', 'lang', 'pageUrl']);
    }

    sheet.appendRow([new Date(), name, email, message, lang, pageUrl]);

    return json_(200, { ok: true, spreadsheetId: ss.getId(), spreadsheetUrl: ss.getUrl() });
  } catch (err) {
    return json_(500, { ok: false, error: String(err && err.message ? err.message : err) });
  }
}

function doGet() {
  return json_(200, {
    ok: true,
    message: 'Contact endpoint is running',
    info: {
      uses: 'SPREADSHEET_ID if set, otherwise daily spreadsheet',
      requiredForDailyMode: ['DAILY_FOLDER_ID']
    }
  });
}

function doOptions() {
  // Preflight support
  return json_(200, { ok: true });
}

function getTargetSpreadsheet_() {
  var props = PropertiesService.getScriptProperties();

  // Backward compatible mode (single fixed spreadsheet)
  var explicitSpreadsheetId = props.getProperty('SPREADSHEET_ID');
  if (explicitSpreadsheetId) {
    return SpreadsheetApp.openById(explicitSpreadsheetId);
  }

  // Daily spreadsheet mode
  return getOrCreateDailySpreadsheet_();
}

function getOrCreateDailySpreadsheet_() {
  var props = PropertiesService.getScriptProperties();

  var folderId = props.getProperty('DAILY_FOLDER_ID');
  if (!folderId) {
    throw new Error('Missing DAILY_FOLDER_ID script property (and SPREADSHEET_ID not set)');
  }

  var prefix = props.getProperty('DAILY_SHEET_PREFIX') || 'store-onepager-contact';
  var dateKey = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd');
  var propKey = 'DAILY_SPREADSHEET_ID_' + dateKey;

  var existingId = props.getProperty(propKey);
  if (existingId) {
    try {
      return SpreadsheetApp.openById(existingId);
    } catch (_) {
      // Spreadsheet was deleted or permissions changed
      props.deleteProperty(propKey);
    }
  }

  var folder = DriveApp.getFolderById(folderId);
  var name = prefix + '-' + dateKey;

  // Create spreadsheet (initially in root), then move into target folder
  var ss = SpreadsheetApp.create(name);
  var file = DriveApp.getFileById(ss.getId());
  folder.addFile(file);
  DriveApp.getRootFolder().removeFile(file);

  props.setProperty(propKey, ss.getId());
  return ss;
}

function json_(status, obj) {
  var output = ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);

  // Best-effort CORS.
  // Note: Some deployments ignore custom headers.
  output.setHeader('Access-Control-Allow-Origin', '*');
  output.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  output.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  return output;
}
