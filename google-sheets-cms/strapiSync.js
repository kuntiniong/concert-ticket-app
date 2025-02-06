const STRAPI_BASE_URL = "https://your-ngrok-url.ngrok-free.app";
const STRAPI_API_TOKEN = PropertiesService.getScriptProperties().getProperty('STRAPI_API_TOKEN');

// installable trigger
function myonEdit(e) {
  const sheet = e.range.getSheet();
  const range = e.range;
  const row = range.getRow();
  const col = range.getColumn();

  if (row === 1) return;

  const rowData = sheet.getRange(row, 1, 1, 8).getValues()[0];
  Logger.log('Raw row data:', rowData);
  
  const [documentId, name, description, venue, price, concertDateTime, availableTickets, action] = rowData;

  // check if it is a delete action
  if (action && action.toString().toUpperCase() === 'DELETE') {
    if (documentId) {
      deleteEntry(row, documentId);
    }
    return;
  }

  // only return the all entities are filled
  if (!name || !description || !venue || !price || !concertDateTime || !availableTickets) {
    Logger.log('All fields are required - skipping');
    sheet.getRange(row, 8).setValue('Error! All fields are required');
    return;
  }

  Logger.log(`Edit detected:
    Row: ${row}
    Column: ${col}
    DocumentID: ${documentId}
    Name: ${name}
    Description: ${description}
    Venue: ${venue}
    Price: ${price}
    DateTime: ${concertDateTime}
    Tickets: ${availableTickets}
    Action: ${action}`);

  const payload = { 
    name: name,
    description: description || '',
    venue: venue,
    price: Number(price) || 0,
    concertDateTime: concertDateTime ? new Date(concertDateTime).toISOString() : null,
    availableTickets: Number(availableTickets) || 0
  };

  if (!documentId) {
    Logger.log('Creating new entry');
    createEntry(row, payload);
  } else {
    Logger.log('Updating existing entry');
    updateEntry(row, documentId, payload);
  }
}

function createEntry(row, payload) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  try {
    const response = UrlFetchApp.fetch(`${STRAPI_BASE_URL}/api/concerts`, {
      method: "post",
      headers: {
        "Authorization": `Bearer ${STRAPI_API_TOKEN}`,
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      payload: JSON.stringify({ data: payload }),
      muteHttpExceptions: true
    });
    
    if (response.getResponseCode() >= 400) {
      throw new Error(`HTTP Error ${response.getResponseCode()}: ${response.getContentText()}`);
    }

    const result = JSON.parse(response.getContentText());
    const documentId = result.data.documentId;

    sheet.getRange(row, 1).setValue(documentId);
    sheet.getRange(row, 8).setValue('Created ✓');
  } catch (error) {
    sheet.getRange(row, 8).setValue('Error! ' + error.message.substring(0, 50));
    throw new Error(`Failed to create entry: ${error.message}`);
  }
}

function updateEntry(row, documentId, payload) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  try {
    const response = UrlFetchApp.fetch(`${STRAPI_BASE_URL}/api/concerts/${documentId}`, {
      method: "put",
      headers: {
        "Authorization": `Bearer ${STRAPI_API_TOKEN}`,
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      payload: JSON.stringify({ data: payload }),
      muteHttpExceptions: true
    });
    
    if (response.getResponseCode() >= 400) {
      throw new Error(`HTTP Error ${response.getResponseCode()}: ${response.getContentText()}`);
    }

    sheet.getRange(row, 8).setValue('Updated ✓');
    Logger.log('Update successful');
  } catch (error) {
    sheet.getRange(row, 8).setValue('Error! ' + error.message.substring(0, 50));
    throw new Error(`Failed to update entry: ${error.message}`);
  }
}

function deleteEntry(row, documentId) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  try {
    const response = UrlFetchApp.fetch(`${STRAPI_BASE_URL}/api/concerts/${documentId}`, {
      method: "delete",
      headers: {
        "Authorization": `Bearer ${STRAPI_API_TOKEN}`,
        "Accept": "application/json"
      },
      muteHttpExceptions: true
    });
    
    if (response.getResponseCode() >= 400) {
      throw new Error(`HTTP Error ${response.getResponseCode()}: ${response.getContentText()}`);
    }

    // clear the row after deletion
    sheet.getRange(row, 1, 1, 7).clearContent();
    sheet.getRange(row, 8).setValue('Deleted ✓');
    Logger.log('Delete successful');
  } catch (error) {
    sheet.getRange(row, 8).setValue('Error! ' + error.message.substring(0, 50));
    throw new Error(`Failed to delete entry: ${error.message}`);
  }
}
