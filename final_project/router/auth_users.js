const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

const users = []; // In-memory user storage (use a database in production)
const bcrypt = require('bcrypt'); // For hashing passwords

regd_users.post('/register', async function (req, res) {
  const { username, password } = req.body; // Extract username and password from request body

  // Validate input
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Check for duplicate username
  const existingUser = users.find(user => user.username === username);
  if (existingUser) {
    return res.status(409).json({ message: "Username already exists" });
  }

  // Hash the password for secure storage
  try {
    const hashedPassword = await bcrypt.hash(password, 10); // Hash with salt rounds = 10
    const newUser = { username, password: hashedPassword };
    users.push(newUser); // Store user

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error: error.message });
  }
});


const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post('/login', async function (req, res) {
  try {
    const { username, password } = req.body; // Extract username and password from request body

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    // Find the user by username
    const existingUser = users.find(user => user.username === username);
    if (!existingUser) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare the plain password with the hashed password
    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Login successful
    return res.status(200).json({ message: "User logged in successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error logging in user", error: error.message });
  }
});

// Add a book review
regd_users.put('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn; // Get the ISBN from the URL parameters
  const { username, review } = req.body; // Extract username and review from the request body

  // Validate input
  if (!username || !review) {
    return res.status(400).json({ message: "Username and review are required" });
  }

  // Find the book by its ISBN
  const book = books[isbn];

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Add or update the review
  book.reviews[username] = review;

  // Send a success response
  return res.status(200).json({
    message: "Review added/updated successfully",
    reviews: book.reviews,
  });
});


//Delete book review added by that particular user 
regd_users.delete('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn; // Get the ISBN from the URL parameters
  const { username } = req.body; // Extract username from the request body

  // Validate input
  if (!username) {
    return res.status(400).json({ message: "Username is required" });
  }

  // Find the book by its ISBN
  const book = books[isbn];

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Check if the user has a review for this book
  if (!book.reviews[username]) {
    return res.status(404).json({ message: "Review by this user not found" });
  }

  // Delete the user's review
  delete book.reviews[username];

  // Send a success response
  return res.status(200).json({
    message: "Review deleted successfully",
    reviews: book.reviews, // Return the remaining reviews
  });
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
