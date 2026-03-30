import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { BookOpen, User, Shield, LogOut, LogIn, ShoppingCart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Layout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { cartItems } = useCart();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="app-container">
            <nav className="navbar">
                <div className="navbar-content">
                    <Link to="/" className="logo">

                        <span>DigitalLib</span>
                    </Link>

                    <div className="nav-links">
                        {user ? (
                            <>
                                <Link
                                    to="/cart"
                                    className={`nav-link ${location.pathname.includes('/cart') ? 'active' : ''}`}
                                    style={{ position: 'relative' }}
                                >
                                    <ShoppingCart size={18} />
                                    <span>My Cart</span>
                                    {cartItems.length > 0 && (
                                        <span style={{
                                            position: 'absolute',
                                            top: '-8px',
                                            right: '-8px',
                                            backgroundColor: 'var(--secondary-color)',
                                            color: 'white',
                                            borderRadius: '50%',
                                            width: '18px',
                                            height: '18px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '0.65rem',
                                            fontWeight: 'bold'
                                        }}>
                                            {cartItems.length}
                                        </span>
                                    )}
                                </Link>

                                {user.role === 'user' && (
                                    <Link
                                        to="/user"
                                        className={`nav-link ${location.pathname.includes('/user') ? 'active' : ''}`}
                                    >
                                        <User size={18} />
                                        <span>Library</span>
                                    </Link>
                                )}

                                {user.role === 'admin' && (
                                    <>
                                        <Link
                                            to="/user"
                                            className={`nav-link ${location.pathname.includes('/user') ? 'active' : ''}`}
                                        >
                                            <User size={18} />
                                            <span>User View</span>
                                        </Link>
                                        <Link
                                            to="/admin"
                                            className={`nav-link ${location.pathname.includes('/admin') ? 'active' : ''}`}
                                        >
                                            <Shield size={18} />
                                            <span>Admin View</span>
                                        </Link>
                                    </>
                                )}

                                <button
                                    onClick={handleLogout}
                                    className="nav-link"
                                    style={{
                                        border: 'none',
                                        background: 'transparent',
                                        cursor: 'pointer',
                                        fontSize: '1rem'
                                    }}
                                >
                                    <LogOut size={18} />
                                    <span>Logout</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="nav-link">
                                    <LogIn size={18} />
                                    <span>Login</span>
                                </Link>
                                <Link to="/register" className="nav-link">
                                    <User size={18} />
                                    <span>Sign Up</span>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            <main className="main-content">
                <Outlet />
            </main>

            <footer style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                <p>&copy; {new Date().getFullYear()} Digital Library System. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Layout;
