import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
    const { user } = useAuth();
    const [cartItems, setCartItems] = useState([]);

    // Load cart from backend when user is logged in
    useEffect(() => {
        const fetchCart = async () => {
            if (user && user.token) {
                try {
                    const res = await fetch('/api/cart', {
                        headers: {
                            'Authorization': `Bearer ${user.token}`
                        }
                    });
                    if (res.ok) {
                        const data = await res.json();
                        setCartItems(data.items || []);
                    } else if (res.status === 401) {
                        // User session might be invalid (e.g., database reset)
                        console.warn("Session invalid, clearing cart and user state");
                        // We shouldn't necessarily force logout here to avoid loops, 
                        // but clearing cart items is safe.
                        setCartItems([]);
                    }
                } catch (error) {
                    console.error("Failed to fetch cart from backend", error);
                }
            } else if (!user) {
                setCartItems([]);
            }
        };

        fetchCart();
    }, [user]);

    const addToCart = async (book) => {
        if (user && user.token) {
            try {
                const res = await fetch('/api/cart', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user.token}`
                    },
                    body: JSON.stringify({ bookId: book._id })
                });

                if (res.ok) {
                    const data = await res.json();
                    setCartItems(data.items);
                } else {
                    const errorData = await res.json();
                    console.error("Failed to add to cart:", errorData.message);
                    alert(`Error: ${errorData.message}`);
                }
            } catch (error) {
                console.error("Failed to add to cart on backend", error);
            }
        } else {
            setCartItems((prevItems) => {
                if (prevItems.find(item => (item._id || item) === book._id)) return prevItems;
                return [...prevItems, book];
            });
        }
    };

    const removeFromCart = async (bookId) => {
        const id = bookId._id || bookId;
        if (user && user.token) {
            try {
                const res = await fetch(`/api/cart/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                });
                if (res.ok) {
                    const data = await res.json();
                    setCartItems(data.items);
                }
            } catch (error) {
                console.error("Failed to remove from cart on backend", error);
            }
        } else {
            setCartItems((prevItems) => prevItems.filter(item => (item._id || item) !== id));
        }
    };

    const isInCart = (bookId) => {
        const id = bookId._id || bookId;
        return cartItems.some(item => (item._id || item) === id);
    };

    const clearCart = async () => {
        if (user && user.token) {
            try {
                const res = await fetch('/api/cart', {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                });
                if (res.ok) {
                    setCartItems([]);
                }
            } catch (error) {
                console.error("Failed to clear cart on backend", error);
            }
        } else {
            setCartItems([]);
        }
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, isInCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
