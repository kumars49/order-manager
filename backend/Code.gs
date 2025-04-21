
function doGet(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Orders");
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const rows = data.slice(1).map(row => {
    let obj = {};
    headers.forEach((h, i) => obj[h] = row[i]);
    return obj;
  });

  return ContentService.createTextOutput(JSON.stringify(rows))
                       .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Orders");
  const body = JSON.parse(e.postData.contents);
  const orderId = body.orderId;
  const existing = sheet.getDataRange().getValues();
  
  for (let i = 1; i < existing.length; i++) {
    if (existing[i][0] == orderId) {
      // Update existing order
      sheet.getRange(i + 1, 2, 1, 3).setValues([[body.orderName, body.quantity, body.contact]]);
      return ContentService.createTextOutput("Order updated");
    }
  }

  // Add new order
  sheet.appendRow([orderId, body.orderName, body.quantity, body.contact]);
  return ContentService.createTextOutput("Order added");
}
