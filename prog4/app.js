// Paulius Malcius - pam226
// Server Side script

const express = require("express");
const path = require("path");

const app = express();

app.use(express.static(path.resolve(__dirname, "public")));

let books = [];
let authors = [];
let publishers = [];

function returnBooks(res) {
  let sortedBooks = books.slice().sort((a, b) => a.title.localeCompare(b.title));
  const ret = JSON.stringify(sortedBooks);
  res.end(ret);
}

app.get("/load", (req, res) => {
  returnBooks(res);
});

app.get("/add", (req, res) => {
  const title = req.query.title;
  const author = req.query.author;
  const ttype = req.query.ttype;
  const publisher = req.query.publisher;
  const year = req.query.year;
  const hardcover = req.query.hardcover === 'true'; // Convert to boolean
  const paperback = req.query.paperback === 'true'; // Convert to boolean
  const ebook = req.query.ebook === 'true'; // Convert to boolean
  const audio = req.query.audio === 'true'; // Convert to boolean

  const book = new Book(title, author, ttype, publisher, year, hardcover, paperback, ebook, audio);
  books.push(book);
  
  // Update authors and publishers
  if (!authors.includes(author)) {
    authors.push(author);
  }
  if (!publishers.includes(publisher)) {
    publishers.push(publisher);
  }

  returnBooks(res);
});

app.get("/authors", (req, res) => {
  res.json(authors);
});

app.get("/publishers", (req, res) => {
  res.json(publishers);
});

app.listen(3000, () => console.log("Starting up Library Manager on port 3000"));

class Book {
  constructor(title, author, ttype, publisher, year, hardcover, paperback, ebook, audio) {
    this.title = title;
    this.author = author;
    this.ttype = ttype;
    this.publisher = publisher;
    this.year = year;
    this.hardcover = hardcover;
    this.paperback = paperback;
    this.ebook = ebook;
    this.audio = audio;
  }
}