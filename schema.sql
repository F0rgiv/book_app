DROP TABLE book;

CREATE TABLE book (
    id SERIAL PRIMARY KEY,
    isbn VARCHAR(255),
    img_url VARCHAR(255),
    title VARCHAR(255),
    author VARCHAR(255),
    description TEXT
);