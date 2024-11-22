const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// User registration
public_users.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    const existingUser = users.find(user => user.username === username);
    if (existingUser) {
      return res.status(409).json({ message: "Username already exists" });
    }

    users.push({ username, password });
    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error registering user", error: error.message });
  }
});




// Get the book list available in the shop
public_users.get('/', async (req, res) => {
  try {
    return res.status(200).json(Object.values(books));
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books", error: error.message });
  }
});





public_users.get('/isbn/:isbn', async (req, res) => {
  try {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (book) {
      return res.status(200).json(book);
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error fetching book", error: error.message });
  }
});





// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
  try {
    const author = req.params.author.toLowerCase();
    const matchingBooks = Object.values(books).filter(book =>
      book.author.toLowerCase() === author
    );

    if (matchingBooks.length > 0) {
      return res.status(200).json(matchingBooks);
    } else {
      return res.status(404).json({ message: "No book found with the given author" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books", error: error.message });
  }
});





// Get book details based on title
public_users.get('/title/:title', async (req, res) => {
  try {
    const title = req.params.title.toLowerCase();
    const matchingBooks = Object.values(books).filter(book =>
      book.title.toLowerCase() === title
    );

    if (matchingBooks.length > 0) {
      return res.status(200).json(matchingBooks);
    } else {
      return res.status(404).json({ message: "No book found with the given title" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books", error: error.message });
  }
});




// Get book review
public_users.get('/review/:isbn', async (req, res) => {
  try {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (book) {
      return res.status(200).json({ reviews: book.reviews });
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error fetching reviews", error: error.message });
  }
});





module.exports.general = public_users;
