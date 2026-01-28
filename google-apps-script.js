// ============================================
// GOOGLE APPS SCRIPT - FORM TO GOOGLE SHEETS
// ============================================
// This script receives form submissions and saves them to Google Sheets
// Deploy this as a Web App from Google Apps Script

function doPost(e) {
  try {
    // Parse the incoming data
    const data = JSON.parse(e.postData.contents);

    // Open your Google Sheet (replace with your spreadsheet ID)
    // Spreadsheet ID from: https://docs.google.com/spreadsheets/d/1C0ojs95TXHmwDXpVyMKBEq7cCDsFW93_zWvrI4ntAjw/edit
    const SPREADSHEET_ID = "1C0ojs95TXHmwDXpVyMKBEq7cCDsFW93_zWvrI4ntAjw";
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);

    // Get or create the sheet named "Form Submissions"
    let sheet = spreadsheet.getSheetByName("Form Submissions");

    // If sheet doesn't exist, create it with minimal headers
    if (!sheet) {
      sheet = spreadsheet.insertSheet("Form Submissions");

      // Add minimal header row (Timestamp, Name, Phone)
      sheet.appendRow(["Timestamp", "Name", "Phone"]);

      // Format header row
      const headerRange = sheet.getRange(1, 1, 1, 3);
      headerRange.setBackground("#0a4d68");
      headerRange.setFontColor("#FFFFFF");
      headerRange.setFontWeight("bold");

      // Freeze header row
      sheet.setFrozenRows(1);
    }

    // Append the new submission (only Timestamp, Name, Phone)
    sheet.appendRow([new Date(), data.name || "", data.phone || ""]);

    // Auto-resize the first three columns
    sheet.autoResizeColumns(1, 3);

    // Optional: Send email notification
    // Uncomment and configure if you want email alerts
    /*
    MailApp.sendEmail({
      to: 'your-email@example.com',
      subject: 'New Form Submission - Abbar Form',
      body: `New submission received:
      
Name: ${data.name}
Phone: ${data.phone}
Language: ${data.language}
Date: ${data.date} ${data.time}
Country: ${data.country}
      
View all submissions: ${spreadsheet.getUrl()}`
    });
    */

    return ContentService.createTextOutput(
      JSON.stringify({ status: "success" }),
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    Logger.log("Error: " + error.toString());
    return ContentService.createTextOutput(
      JSON.stringify({ status: "error", message: error.toString() }),
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

// Test function to verify setup
function testSetup() {
  const SPREADSHEET_ID = "1C0ojs95TXHmwDXpVyMKBEq7cCDsFW93_zWvrI4ntAjw";
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  Logger.log("Spreadsheet name: " + spreadsheet.getName());
  Logger.log("Setup successful!");
}
