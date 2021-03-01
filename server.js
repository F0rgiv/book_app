'use strict';
// ======================================= add requrments =======================================

require('dotenv').config();
const express = require('express');
const app = express();
const superagent = require('superagent');


// ======================================= app config =======================================

const PORT = process.env.PORT;

// ======================================= routs =======================================

// app.get('/location', getLocation);


// ======================================= Rout Handelars =======================================

function handelError(res) {
    return err => {
        // let user know we messed up
        res.status(500).send("Sorry, something went very wrong");
    };
}

//catchall / 404
app.use('*', (request, response) => response.send('Sorry, that route does not exist.'));

// ======================================= start app =======================================

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
