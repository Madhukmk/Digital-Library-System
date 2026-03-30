import { Download, Eye, ShoppingCart, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';

const BookCard = ({ book, onDownload, onRead }) => {
    const { addToCart, removeFromCart, isInCart } = useCart();
    const inCart = isInCart(book._id);

    const handleCartClick = () => {
        if (inCart) {
            removeFromCart(book._id);
        } else {
            addToCart(book);
        }
    };

    return (
        <div className="book-card">
            <div className="book-cover-wrapper">
                <img
                    src={book.cover}
                    alt={book.title}
                    className="book-cover"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800';
                    }}
                />
                <span className="book-badge">
                    {book.category}
                </span>
            </div>

            <div className="book-details">
                <h3 className="book-title" title={book.title}>{book.title}</h3>
                <p className="book-author">{book.author}</p>

                <div className="book-footer">
                    <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        <Download size={14} style={{ marginRight: '4px' }} />
                        {book.downloads}
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                            onClick={handleCartClick}
                            className={`cart-btn ${inCart ? 'active' : ''}`}
                            title={inCart ? "Remove from Cart" : "Add to Cart"}
                        >
                            {inCart ? <Check size={16} /> : <ShoppingCart size={16} />}
                        </button>
                        <button
                            onClick={() => onRead(book)}
                            className="download-btn"
                            style={{ backgroundColor: 'var(--primary-color)' }}
                            title="Read Online"
                        >
                            <Eye size={16} />
                        </button>
                        <button
                            onClick={() => onDownload(book)}
                            className="download-btn"
                            title="Download"
                        >
                            <Download size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookCard;
