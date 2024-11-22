const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(books)



 
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  // Convert `books` to an array and filter
  const BookArray=Object.values(books);
  const book = BookArray.filter((book, index) => (index + 1).toString() === isbn);

  if (book.length > 0) {
    res.send(book); // Return the matched book
  } else {
    res.status(404).send({ message: "Book not found" });
  }
});



  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author.toLowerCase();

  // Convert `books` to an array and filter
  const BookArray=Object.values(books);
  const book = BookArray.filter((book, index) => book.author.toLowerCase() === author);

  if (book.length > 0) {
    res.send(book); // Return the matched book
  } else {
    res.status(404).send({ message: "Book not found" });
  }
});

public_users.get('/title/:title', function (req, res) {
  const title = req.params.title.toLowerCase(); // Convert title to lowercase for case-insensitive comparison

  // Convert books object to array and search for matching titles
  const matchingBooks = Object.values(books).filter((book) =>book.title.toLowerCase() === title);

  if (matchingBooks.length > 0) {
    res.status(200).json(matchingBooks); // Send the matched books
  } else {
    res.status(404).json({ message: "No book found with the given title" });
  }
});


//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn; // Get ISBN from request parameters

  // Find the book by its ISBN key
  const book = books[isbn];

  if (book) {
    res.status(200).json({ reviews: book.reviews }); // Return the reviews of the book
  } else {
    res.status(404).json({ message: "Book not found" }); // Return error if book doesn't exist
  }
});


module.exports.general = public_users;
