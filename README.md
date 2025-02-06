# Full Stack Concert Ticket Web App

## Features
- Responsive frontend for the concert ticketing page
- Two Content Management Systems (CMS) for both technical (admin) and non-technical users:
  - Strapi Admin Panel -> manage API permissions and backend data
  - Google Sheets -> for easy concert/ event management
- Real-time update and synchronization across the frontend, Strapi backend and Google Sheets

## Tech Stack
- Frontend: HTML, CSS and JavaScript
- Backend: Strapi (w/ SQLite)

- Testing: Postman and ngrok

## Run the App (for Windows)
1. Install [node.js](https://nodejs.org/en) 
2. Run the local Strapi server with ``` npm run develop ```
3. Open the Strapi CMS with the given localhost url
4. Install [ngrok](https://ngrok.com/) and set a path for the environment variables
5. Create a ngrok account on the website and add your API key ```ngrok config add-authtoken your-api-key```
6. Expose the localhost to the public by ```ngrok http 1337```
7. Create a google account and go to [Google Sheets](https://docs.google.com/spreadsheets/)
8. 

## Workflow
### 1. Setting up a Strapi Environment as the Admin-side CMS
- 1.1 Define the data models (Concert, Ticket) with the Content-Type Builder in Strapi CMS

<div style="text-align: center;">
  <img src="readme-images/er-diagram.png" width="200" height="400">
</div>

- 1.2 Create a controller to handle the ticket booking logic (e.g. update tickets availability, etc.)

```
Preconditions:
1. Fetch concertID
2. Check if the current time is before the concert date
3. Check if enough tickets are available

Executions:
4. Calculate the total price
5. Create the ticket
6. Update the concert's available tickets
```

- 1.3 Setup a route to connect the controller to the API endpoints and tested with Postman

### 2. Integrating Google Sheets as the User-side CMS
- 2.1 Write a Google Apps Script to sync Google Sheets with Strapi and perform real-time (i.e. when the spreadsheet is on editing) CRUD operations
- 2.2 Setup a installable trigger to enable script automation for external API calls (to Strapi)
- 2.3 Create a tunnel for the local Strapi server to the internet using ngrok for testing
> *the script should be running in Google's cloud <- strapiSync.js*

### 3. Building the Frontend




<!-- ## Improvement
### Data Models
- add user auth
- add a booking period
- add seat preferences and different ticket price point -->