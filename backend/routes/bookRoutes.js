const express = require("express");
const router = express.Router();
const Book = require("../models/Book");
const { verifyToken, isAdmin } = require("../middleware/auth");

// GET books (Public)
router.get("/", async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
});

// GET single book (Public)
router.get("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ msg: "ไม่พบหนังสือ" });
    res.json(book);
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
});

// ADD book (Admin Only)
router.post("/", verifyToken, isAdmin, async (req, res) => {
  try {
    const newBook = new Book(req.body);
    await newBook.save();
    res.json(newBook);
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
});

// UPDATE book (Admin Only)
router.put("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedBook);
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
});

// DELETE book (Admin Only)
router.delete("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.json({ msg: "ลบหนังสือสำเร็จ" });
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
});

module.exports = router; 