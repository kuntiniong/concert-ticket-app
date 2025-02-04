# Full Stack Concert Ticket Web App

## Tech Stack
- Frontend: HTML, CSS and JavaScript
- Backend: Strapi

## Workflow
### 1. Setting up a Strapi Environment as the Admin-side CMS
- 1.1 Define the data models (User, Concert, Ticket) with the Content-Type Builder in Strapi CMS
- 1.2 Create a controller to handle the ticket booking logic (e.g. update tickets availability, etc.)
- 1.3 Setup a route to connect the controller to the API endpoints

### 2. Integrating Google Sheets as the User-side CMS
- 2.1 Write a Google Apps Script to sync Google Sheets with Strapi and perform real-time (i.e. when the spreadsheet is on editing) CRUD operations
> *the script is stored in the Google Sheets itself, NOT in this repo*

### 3. Building the Frontend