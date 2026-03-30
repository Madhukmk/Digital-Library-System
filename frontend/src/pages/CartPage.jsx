import React, { useState } from 'react';
import BookCard from '../components/BookCard';
import { ShoppingCart, ArrowLeft, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CartPage = () => {
    const { cartItems, clearCart } = useCart();
    const [downloadingBook, setDownloadingBook] = useState(null);

    const handleDownload = async (book) => {
        setDownloadingBook(book._id);
        try {
            await fetch(`/api/books/${book._id}/download`, {
                method: 'PUT',
            });

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

    return (
        <div className="cart-page">
            <header className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <Link to="/user" className="btn-text" style={{ padding: 0, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <ArrowLeft size={16} /> Back to Library
                        </Link>
                    </div>
                    <h1 className="dashboard-title">My Saved Books</h1>
                    <p className="dashboard-subtitle">Books you've marked to read or download later.</p>
                </div>

                {cartItems.length > 0 && (
                    <button
                        onClick={clearCart}
                        className="btn-text"
                        style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        <Trash2 size={18} /> Clear All
                    </button>
                )}
            </header>

            {cartItems.length > 0 ? (
                <div className="book-grid">
                    {cartItems.map(book => (
                        <BookCard
                            key={book._id}
                            book={book}
                            onDownload={handleDownload}
                            onRead={handleRead}
                        />
                    ))}
                </div>
            ) : (
                <div className="empty-state" style={{ padding: '4rem 2rem' }}>
                    <div className="empty-state-icon">
                        <ShoppingCart size={48} />
                    </div>
                    <h3>Your cart is empty</h3>
                    <p>Browser the library and add books you're interested in.</p>
                    <Link to="/user" className="btn-primary" style={{ marginTop: '1.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', width: 'auto' }}>
                        Go to Library
                    </Link>
                </div>
            )}
        </div>
    );
};

export default CartPage;
