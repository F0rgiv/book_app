'use strict';
// ======================================= add requrments =======================================

require('dotenv').config();
const express = require('express');
const app = express();
const superagent = require('superagent');
const path = require('path')
const client = require('./client');


// ======================================= app config =======================================

const PORT = process.env.PORT;
app.set('view engine', 'ejs');
app.use('/static', express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }));

// ======================================= routs =======================================

app.get('/', home);
app.get('/hello', home);
app.get('/searches/new', getBookQurie)
app.post('/searches/new', getBooks)
// app.post('/book/:id', getBook) access with req.perams.id
// app.post('/book', saveBook)

// ======================================= Rout Handelars =======================================

function handelError(res) {
    return err => {
        // let user know we messed up
        res.status(500).render("pages/error", {err: err});
    };
}

function home(req, res) {
    res.render('pages/index')
};

function getBookQurie(req, res) {
    console.log('laning on qurie')
    res.render('pages/searches/new')
};

function getBooks(req, res) {
    superagent.get(`https://www.googleapis.com/books/v1/volumes?q=${req.body.search}:${req.body.search_string}`)
        .then(data => {
            const books = data.body.items.map(book => new Book(book.volumeInfo));
            res.render('pages/searches/show', { books: books })
        }).catch(handelError(res));
};

function insertArrIntoSql(arr, tableAndFields) {
    // create db querie settings
    let sqlInsert = `INSERT INTO ${tableAndFields} VALUES(`;
    // Add $n and closing )
    arr.forEach(element, index => sqlInsert.concat(`$${index + 1} `)).concat(')');

    const sqlInsertArray = [
        cityName,
        location.display_name,
        parseFloat(location.lat),
        parseFloat(location.lon)
    ];
    // save in the db
    client.query(sqlInsert, sqlInsertArray);
    //send result to client
    res.status(200).send(new Location(location, cityName));
}

//catchall / 404
app.use('*', (request, response) => response.send('Sorry, that route does not exist.'));

//constructors
function Book(obj) {
    this.id = obj.id ? obj.id: '';
    this.isbn = obj.isbn;
    this.img_url = obj.imageLinks ? obj.imageLinks.thumbnail : "https://i.imgur.com/J5LVHEL.jpg";
    this.title = obj.title;
    this.author = obj.authors ? obj.authors[0]: 'Unknown author';
    this.description = obj.description;
}

// ======================================= start app =======================================

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
