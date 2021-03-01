'use strict';
// ======================================= add requrments =======================================

require('dotenv').config();
const express = require('express');
const app = express();
const superagent = require('superagent');
const path = require('path')


// ======================================= app config =======================================

const PORT = process.env.PORT;
app.set('view engine', 'ejs');
app.use('/static', express.static(path.join(__dirname, 'public')))

// ======================================= routs =======================================

app.get('/hello', home);

// ======================================= Rout Handelars =======================================

function handelError(res) {
    return err => {
        // let user know we messed up
        res.status(500).send("Sorry, something went very wrong");
    };
}

function home(req, res){    
    res.render('index',{user:"John Smith"})
};

//catchall / 404
app.use('*', (request, response) => response.send('Sorry, that route does not exist.'));

// ======================================= start app =======================================

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
