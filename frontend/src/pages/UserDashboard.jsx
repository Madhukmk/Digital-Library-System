import React, { useState, useEffect } from 'react';
import BookCard from '../components/BookCard';
import { Search } from 'lucide-react';

const UserDashboard = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [downloadingBook, setDownloadingBook] = useState(null);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const res = await fetch('/api/books');
                const data = await res.json();
                setBooks(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching books:', error);
                setLoading(false);
            }
        };

        fetchBooks();
    }, []);

    const handleDownload = async (book) => {
        setDownloadingBook(book._id);

        try {
            await fetch(`/api/books/${book._id}/download`, {
                method: 'PUT',
            });

            // Optimistically update UI
            setBooks(books.map(b =>
                b._id === book._id ? { ...b, downloads: b.downloads + 1 } : b
            ));

            // Simulate download delay
            setTimeout(() => {
                alert(`Downloading "${book.title}"...`);
                setDownloadingBook(null);
            }, 1000);
        } catch (error) {
            console.error('Error downloading book:', error);
            setDownloadingBook(null);
        }
    };

    const handleRead = (book) => {
        if (book.pdfUrl) {
            window.open(book.pdfUrl, '_blank');
        } else {
            alert("Sorry, this book is not available for online reading.");
        }
    };

    const filteredBooks = books.filter(book =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <header className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 className="dashboard-title">Library Catalog</h1>
                    <p className="dashboard-subtitle">Explore our vast collection of digital resources.</p>
                </div>

                <div className="search-container">
                    <Search className="search-icon" size={20} />
                    <input
                        type="text"
                        placeholder="Search by title, author, or category..."
                        className="search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </header>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>Loading books...</div>
            ) : filteredBooks.length > 0 ? (
                <div className="book-grid">
                    {filteredBooks.map(book => (
                        <BookCard
                            key={book._id}
                            book={book}
                            onDownload={handleDownload}
                            onRead={handleRead}
                        />
                    ))}
                </div>
            ) : (
                <div className="empty-state">
                    <div className="empty-state-icon">
                        <Search size={40} />
                    </div>
                    <h3>No books found</h3>
                    <p>Try adjusting your search terms.</p>
                </div>
            )}
        </div>
    );
};

export default UserDashboard;
