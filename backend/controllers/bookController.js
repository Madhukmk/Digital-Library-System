import asyncHandler from 'express-async-handler';
import Book from '../models/Book.js';

// @desc    Fetch all books
// @route   GET /api/books
// @access  Public
const getBooks = asyncHandler(async (req, res) => {
    const books = await Book.find({});
    res.json(books);
});

// @desc    Fetch single book
// @route   GET /api/books/:id
// @access  Public
const getBookById = asyncHandler(async (req, res) => {
    const book = await Book.findById(req.params.id);

    if (book) {
        res.json(book);
    } else {
        res.status(404);
        throw new Error('Book not found');
    }
});

// @desc    Create a book
// @route   POST /api/books
// @access  Private/Admin
const createBook = asyncHandler(async (req, res) => {
    const { title, author, category, cover, pdfUrl } = req.body;

    const book = new Book({
        title,
        author,
        category,
        cover,
        pdfUrl,
        downloads: 0
    });

    const createdBook = await book.save();
    res.status(201).json(createdBook);
});

// @desc    Delete a book
// @route   DELETE /api/books/:id
// @access  Private/Admin
const deleteBook = asyncHandler(async (req, res) => {
    const book = await Book.findById(req.params.id);

    if (book) {
        await book.deleteOne();
        res.json({ message: 'Book removed' });
    } else {
        res.status(404);
        throw new Error('Book not found');
    }
});

// @desc    Increment download count
// @route   PUT /api/books/:id/download
// @access  Public
const incrementDownload = asyncHandler(async (req, res) => {
    const book = await Book.findById(req.params.id);

    if (book) {
        book.downloads = book.downloads + 1;
        const updatedBook = await book.save();
        res.json(updatedBook);
    } else {
        res.status(404);
        throw new Error('Book not found');
    }
});

export { getBooks, getBookById, createBook, deleteBook, incrementDownload };
