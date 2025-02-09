const STRAPI_BASE_URL = "https://your-ngrok-url.ngrok-free.app";
const STRAPI_API_TOKEN = PropertiesService.getScriptProperties().getProperty('STRAPI_API_TOKEN');

const HEADERS = {
  "Authorization": `Bearer ${STRAPI_API_TOKEN}`,
  "Accept": "application/json",
  "Content-Type": "application/json",
  "Ngrok-Skip-Browser-Warning": "true" // bypass ngrok warning page
};

const currDatetime = new Date().toLocaleString();

// 2 installable triggers

// 1. fetch latest ticket availability <- triggered when refreshed
function fetchLatestTicketAvailability() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = sheet.getDataRange().getValues();
  const headerRow = 1;

  for (let i = headerRow + 1; i <= data.length; i++) { // iterate each row
    const rowData = data[i - 1];
    const documentId = rowData[0];

    if (documentId) {
      try {
        const response = UrlFetchApp.fetch(`${STRAPI_BASE_URL}/api/concerts/${documentId}`, {
          method: "GET",
          headers: HEADERS,
          muteHttpExceptions: true,
        });

        if (response.getResponseCode() >= 400) {
          throw new Error(`HTTP Error ${response.getResponseCode()}: ${response.getContentText()}`);
        }

        const result = JSON.parse(response.getContentText());
        const latestTickets = result.data.availableTickets;

        sheet.getRange(i, 7).setValue(latestTickets); // update status in action col

        Logger.log(`${documentId} is in sync.`);
        sheet.getRange(i, 8).setValue(`Synced at ${currDatetime} ✓`);

      } catch (error) {
        Logger.log(`Error fetching ticket availability for documentId ${documentId}: ${error.message}`);
        sheet.getRange(i, 8).setValue('Error! Unable to fetch');
      }
    }
  }
}

// 2. real-time CRUD operations <- triggered when celss are on editing
function myonEdit(e) {
  const sheet = e.range.getSheet();
  const range = e.range;
  const row = range.getRow();
  const col = range.getColumn();

  if (row === 1) return;

  const rowData = sheet.getRange(row, 1, 1, 8).getValues()[0];
  Logger.log('Raw row data:', rowData);
  
  const [documentId, name, description, venue, price, concertDateTime, availableTickets, action] = rowData;

  if (action && action.toString().toUpperCase() === 'DELETE') { // check if the action column contains keyword "delete"
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
      method: "POST",
      headers: HEADERS,
      payload: JSON.stringify({ data: payload }),
      muteHttpExceptions: true
    });
    
    if (response.getResponseCode() >= 400) {
      throw new Error(`HTTP Error ${response.getResponseCode()}: ${response.getContentText()}`);
    }

    const result = JSON.parse(response.getContentText());
    const documentId = result.data.documentId;

    sheet.getRange(row, 1).setValue(documentId);
    sheet.getRange(row, 8).setValue(`Created at ${currDatetime} ✓`); // update status in action col
  } catch (error) {
    sheet.getRange(row, 8).setValue('Error! ' + error.message.substring(0, 50));
    throw new Error(`Failed to create entry: ${error.message}`);
  }
}

function updateEntry(row, documentId, payload) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  try {
    const response = UrlFetchApp.fetch(`${STRAPI_BASE_URL}/api/concerts/${documentId}`, {
      method: "PUT",
      headers: HEADERS,
      payload: JSON.stringify({ data: payload }),
      muteHttpExceptions: true
    });
    
    if (response.getResponseCode() >= 400) {
      throw new Error(`HTTP Error ${response.getResponseCode()}: ${response.getContentText()}`);
    }

    sheet.getRange(row, 8).setValue(`Updated at ${currDatetime} ✓`); // update status in action col
    Logger.log('Update successful');
  } catch (error) {
    sheet.getRange(row, 8).setValue('Error! ' + error.message.substring(0, 50));
    throw new Error(`Failed to update entry: ${error.message}`);
  }
}

// delete entry <- type "delete" in the action col
function deleteEntry(row, documentId) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  try {
    const response = UrlFetchApp.fetch(`${STRAPI_BASE_URL}/api/concerts/${documentId}`, {
      method: "DELETE",
      headers: HEADERS,
      muteHttpExceptions: true
    });
    
    if (response.getResponseCode() >= 400) {
      throw new Error(`HTTP Error ${response.getResponseCode()}: ${response.getContentText()}`);
    }

    sheet.getRange(row, 1, 1, 7).clearContent(); // clear the row after deletion
    sheet.getRange(row, 8).setValue(`Deleted at ${currDatetime} ✓`); // update status in action col

    SpreadsheetApp.flush(); // act as await cause google sheets doesn't have async func

    Utilities.sleep(3000); // delete the row after 3 secs
    sheet.deleteRow(row);

    Logger.log('Delete successful');
  } catch (error) {
    sheet.getRange(row, 8).setValue('Error! ' + error.message.substring(0, 50));
    throw new Error(`Failed to delete entry: ${error.message}`);
  }
}