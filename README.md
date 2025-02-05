# Full Stack Concert Ticket Web App

## Tech Stack
- Frontend: HTML, CSS and JavaScript
- Backend: Strapi

## Workflow
### 1. Setting up a Strapi Environment as the Admin-side CMS
- 1.1 Define the data models (Concert, Ticket) with the Content-Type Builder in Strapi CMS

<div style="text-align: center;">
  <img src="readme-images/er-diagram.png" width="200" height="400">
</div>

- 1.2 Create a controller to handle the ticket booking logic (e.g. update tickets availability, etc.)

```
Preconditions:
1. fetch concertID
2. check if the current time is before the concert date
3. check if enough tickets are available

Executions:
4. calculate the total price
5. create the ticket
6. update the concert's available tickets
```

- 1.3 Setup a route to connect the controller to the API endpoints and tested with Postman

### 2. Integrating Google Sheets as the User-side CMS
- 2.1 Write a Google Apps Script to sync Google Sheets with Strapi and perform real-time (i.e. when the spreadsheet is on editing) CRUD operations
> *the script is stored in the Google Sheets itself, NOT in this repo*

### 3. Building the Frontend


## Improvement
### Data Models
- add user auth
- add a booking period
- add seat preferences and different ticket price point