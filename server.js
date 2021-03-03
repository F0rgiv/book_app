'use strict';
// ======================================= add requrments =======================================

require('dotenv').config();
const express = require('express');
const app = express();
const superagent = require('superagent');
const path = require('path')
const client = require('./client');
const methodOverride = require('method-override');

// ======================================= app config =======================================

const PORT = process.env.PORT;
app.set('view engine', 'ejs');
app.use('/static', express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// ======================================= routs =======================================

app.get('/', home);
app.get('/hello', home);
app.get('/searches/new', getBookQurie);
app.post('/searches/new', getBooks);
app.get('/books/:id', getBook);
app.post('/books', saveBook);
app.get('/books/:id/update', getBookForm);
app.put('/books/:id', updateBook);
app.delete('/books/:id', deleteBook);

// ======================================= Rout Handelars =======================================

function handelError(res) {
    return err => {
        //log error
        console.log(err)
        // let user know we messed up
        res.status(500).render("pages/error", { err: err });
    };
}

function home(req, res) {
    let sqlSelect = 'SELECT * FROM book'
    client.query(sqlSelect)
        .then(books => {
            res.render('pages/index', { books: books.rows })
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
            res.render('pages/searches/show', { books: books, apiReturn: true })
        }).catch(handelError(res));
};

function getBook(req, res) {
    const sqlSelect = `SELECT * FROM book WHERE id=${req.params.id}`;
    client.query(sqlSelect)
        .then(books => {
            res.render('pages/books/detail', { books: books.rows, apiDetail: true })
        })
        .catch(handelError(res))
}

function saveBook(req, res) {
    const sqlString = 'INSERT INTO book (isbn, img_url, title, author, description) VALUES($1, $2, $3, $4, $5) RETURNING id;';
    const sqlArray = [
        req.body.isbn,
        req.body.img_url,
        req.body.title,
        req.body.author,
        req.body.description,
    ];
    client.query(sqlString, sqlArray)
        .then(result => res.redirect(`/books/${result.rows[0].id}`))
        .catch(handelError(res))
}

function getBookForm(req, res) {
    const sqlSelect = `SELECT * FROM book WHERE id=${req.params.id}`;
    client.query(sqlSelect)
        .then(books => { res.render('pages/books/edit', { book: books.rows[0] }) })
        .catch(handelError(res))
}

function deleteBook(req, res) {
    console.log('here');
    const sqlString = 'DELETE from book WHERE id=$1'
    const sqlArray = [
        req.params.id
    ];
    client.query(sqlString, sqlArray)
        .then(res.redirect('/'))
        .catch(handelError(res))
}

function updateBook(req, res) {
    // console.log(req.body);
    const sqlString = 'UPDATE book SET isbn=$1, img_url=$2, title=$3, author=$4, description=$5 WHERE id=$6;';
    const sqlArray = [
        req.body.isbn,
        req.body.img_url,
        req.body.title,
        req.body.author,
        req.body.description,
        req.params.id
    ];

    client.query(sqlString, sqlArray)
        .then(res.redirect(`/books/${req.params.id}`))
        .catch(handelError(res))
}

//catchall / 404
app.use('*', (request, response) => response.send('Sorry, that route does not exist.'));

//constructors
function Book(obj) {
    this.id = obj.id ? obj.id : '';
    this.isbn = obj.industryIdentifiers[0].identifier;
    this.img_url = obj.imageLinks ? obj.imageLinks.thumbnail : "https://i.imgur.com/J5LVHEL.jpg";
    this.title = obj.title;
    this.author = obj.authors ? obj.authors[0] : 'Unknown author';
    this.description = obj.description;
    this.bookShealf = 'bookShealf'
}

// ======================================= start app =======================================

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
