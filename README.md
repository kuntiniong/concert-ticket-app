# Full Stack Concert Ticket Web App

## Features
- Responsive frontend
- Two Content Management Systems (CMS) for both technical (admin) and non-technical users:
  - Strapi Admin Panel -> manage API permissions and backend data
  - Google Sheets -> for easy concert/ event management
- Real-time update and synchronization across the frontend, Strapi backend and Google Sheets

## Tech Stack
- Frontend: React and shadcn/Tailwind CSS
- Backend: Strapi (w/ SQLite)

- Testing: Postman and ngrok

## Run the App

### Strapi CMS
1. Install [node.js](https://nodejs.org/en)
2. Open a new terminal for the local Strapi server and type
```
cd backend
npm install
```
3. Create a .env file ```touch .env``` and simply copy [.env.example](backend/.env.example) and paste to it
4. Run the local server with ```npm run develop``` and create an Strapi account in the admin panel
5. Install and get your API key from [ngrok](https://ngrok.com/) and set a path for the environment variables
6. Open a new terminal for the ngrok tunnel and type
```
cd backend
ngrok config add-authtoken your-api-key
ngrok http 1337
```

### Google Sheets CMS
7. Go to [Google Sheets](https://docs.google.com/spreadsheets/) and import [ConcertTicketCMS.xlsx](google-sheets-cms/ConcertTicketCMS.xlsx)
8. Go to the Extensions tab and paste [StrapiSync.js](google-sheets-cms/StrapiSync.js) in the Editor
9. Go back to Strapi Admin Panel -> Settings -> API Tokens to generate an API token with full access
10. Paste the API key and ngrok URL in StrapiSync.js


### Frontend
11. Open a new terminal for the frontend and type 
```
cd frontend
npm install
npm run dev
```

## Workflow
### 1. Setting up a Strapi Environment as the Admin-side CMS
- 1.1 Define the data models (Concert, Ticket) with the Content-Type Builder in Strapi CMS

<div style="text-align: center;">
  <img src="readme-assets/er-diagram.png" width="200" height="400">
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
- 2.1 Write a Google Apps Script to sync Google Sheets with Strapi and perform real-time CRUD operations (i.e. when the spreadsheet is on editing)
- 2.2 Setup a installable trigger to enable script automation for external API calls (to Strapi)
- 2.3 Create a tunnel to expose the local Strapi server to the internet using ngrok for testing
> *the script should be running in Google's server*

### 3. Building the Frontend
- 3.1 Import the shadcn components through the shadcn CLI ```npx shadcn@latest add card dialog button input```
- 3.2 Create the components and the home page and manage state with state hooks
- 3.3 Integrate API calls using Fetch and effect hooks

#### File Structure for the Frontend:
```
frontend/src
          ├── components
          │   ├── ui                  // shadcn components
          │   │   ├── button.jsx
          │   │   ├── card.jsx
          │   │   ├── dialog.jsx
          │   │   └── input.jsx       // quantity input
          │   ├── ConcertCard.jsx
          │   ├── ConcertGrid.jsx     // grid layout
          │   └── PurchaseDialog.jsx  // purchase popup
          ├── lib
          │   └── utils.js
          ├── testing
          │   └──dummyConcerts.js     // for testing
          ├── App.jsx
          ├── index.css               // tailwind setup
          └── main.jsx
```

### 4. Synchronize the Frontend with Google Sheets CMS
- 4.1 Update the Google Apps Script to allow Google Sheets receiving an API call from the Strapi server when a purchase is made at the frontend

<!-- ## Improvement
### Data Models
- add user auth
- add a booking period
- add seat preferences and different ticket price point -->