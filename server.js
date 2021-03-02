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
app.use(express.urlencoded({ extended: true }));

// ======================================= routs =======================================

app.get('/hello', home);
app.get('/searches/new', getBookQurie)
app.post('/searches/new', getBook)

// ======================================= Rout Handelars =======================================

function handelError(res) {
    return err => {
        // let user know we messed up
        res.status(500).send("Sorry, something went very wrong");
    };
}

function home(req, res) {
    res.render('pages/index')
};

function getBookQurie(req, res) {
    console.log('laning on qurie')
    res.render('pages/searches/new')
};

function getBook(req, res) {
    superagent.get(`https://www.googleapis.com/books/v1/volumes?q=${req.body.search}:${req.body.search_string}`)
        .then(data => {
            const books = data.body.items.map(book => new Book(book.volumeInfo));
            res.render('pages/searches/show', { books: books })
        });
};


//catchall / 404
app.use('*', (request, response) => response.send('Sorry, that route does not exist.'));

//constructors

function Book(obj) {
    this.img = obj.imageLinks ? obj.imageLinks.thumbnail : "https://i.imgur.com/J5LVHEL.jpg";
    this.title = obj.title;
    this.author = obj.authors[0];
    this.description = obj.description;
}

// ======================================= start app =======================================

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
