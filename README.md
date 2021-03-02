# book_app

**Author**: James Mansour
**Version**: 1.0.0

## Overview
Application for searching book information and displaing that to a user

## Getting Started
run
```npm install```
this will install requred dependancies.

Ensure you have the local env vars.
PORT =<port number>

then run ```npm start server.js``` or ```nodemon```

## Architecture
This application uses express, ejs, superagent and dotenv to dynamically retreive book information from the web and format it into a view for the end user.

## Change Log
3/1/2021:
- Adds new search urel for books here <APP_URL>/searches/new
- Adds constructors for a book object
- Adds route for future homepage
- Adds initial styling
- Adds new view page for showing results for your search
- Adds a error page that is desplayed showing any errors to a user if they occure.
