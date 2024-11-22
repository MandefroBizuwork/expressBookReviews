const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

const users = []; // In-memory user storage (use a database in production)
const bcrypt = require('bcrypt'); // For hashing passwords


// User registration
regd_users.post('/register', async function (req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  const existingUser = users.find(user => user.username === username);
  if (existingUser) {
    return res.status(409).json({ message: "Username already exists" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { username, password: hashedPassword };
    users.push(newUser);
    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error registering user", error: error.message });
  }
});




// Helper functions
const isValid = (username) => {
  // Logic to check if the username is valid
  return users.some(user => user.username === username);
};

const authenticatedUser = async (username, password) => {
  const user = users.find(user => user.username === username);
  if (!user) return false;

  return await bcrypt.compare(password, user.password);
};

// User login
regd_users.post('/login', async function (req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  const existingUser = users.find(user => user.username === username);
  if (!existingUser) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isPasswordValid = await bcrypt.compare(password, existingUser.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  return res.status(200).json({ message: "User logged in successfully" });
});




// Add or modify a book review
regd_users.put('/review/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  const { username, review } = req.body;

  if (!username || !review) {
    return res.status(400).json({ message: "Username and review are required" });
  }

  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Add or update the review
  book.reviews[username] = review;

  return res.status(200).json({
    message: "Review added/updated successfully",
    reviews: book.reviews,
  });
});



// Delete a book review
regd_users.delete('/review/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  const { username } = req.body;
  if (!username) {
    return res.status(400).json({ message: "Username is required" });
  }
  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }
  if (!book.reviews[username]) {
    return res.status(404).json({ message: "Review by this user not found" });
  }
  delete book.reviews[username];
  return res.status(200).json({
    message: "Review deleted successfully",
    reviews: book.reviews,
  });
});



module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
