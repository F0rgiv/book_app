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
app.get('/books/:id', getBook)
// app.post('/book', saveBook)

// ======================================= Rout Handelars =======================================

function handelError(res) {
    return err => {
        // let user know we messed up
        res.status(500).render("pages/error", { err: err });
    };
}

function home(req, res) {
    let sqlSelect = 'SELECT * FROM book'
    client.query(sqlSelect)
        .then(books => { res.render('pages/index', { books: books.rows })
        })
        .catch(handelError(res))
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

function getBook(req, res) {
    const sqlSelect = `SELECT * FROM book WHERE id=${req.params.id}`;
    client.query(sqlSelect)
        .then(books => { res.render('pages/books/detail', { books: books.rows })
        })
        .catch(handelError(res))
}

//catchall / 404
app.use('*', (request, response) => response.send('Sorry, that route does not exist.'));

//constructors
function Book(obj) {
    this.id = obj.id ? obj.id : '';
    this.isbn = obj.isbn;
    this.img_url = obj.imageLinks ? obj.imageLinks.thumbnail : "https://i.imgur.com/J5LVHEL.jpg";
    this.title = obj.title;
    this.author = obj.authors ? obj.authors[0] : 'Unknown author';
    this.description = obj.description;
    this.bookShealf = 'bookShealf'
}

// ======================================= start app =======================================

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
