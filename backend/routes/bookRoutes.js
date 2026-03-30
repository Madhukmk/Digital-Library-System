import express from 'express';
const router = express.Router();
import {
    getBooks,
    getBookById,
    createBook,
    deleteBook,
    incrementDownload,
} from '../controllers/bookController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/').get(getBooks).post(protect, admin, createBook);
router.route('/:id').get(getBookById).delete(protect, admin, deleteBook);
router.route('/:id/download').put(incrementDownload);

export default router;
