import mongoose from 'mongoose';

const bookSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    cover: {
        type: String,
        default: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800'
    },
    pdfUrl: {
        type: String,
        required: true
    },
    downloads: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

const Book = mongoose.model('Book', bookSchema);
export default Book;
