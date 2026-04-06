import React, { useState, useEffect } from 'react';
import { Users, BookOpen, Upload, Plus, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [books, setBooks] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [newBook, setNewBook] = useState({
        title: '',
        author: '',
        cover: '',
        pdfUrl: '',
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const booksRes = await fetch('/api/books');
                const booksData = await booksRes.json();
                setBooks(booksData);

                // Fetch users if user is admin, although route is protected
                if (user && user.token) {
                    const usersRes = await fetch('/api/auth', { // api/auth root is getUsers
                        headers: {
                            Authorization: `Bearer ${user.token}`,
                        },
                    });
                    if (usersRes.ok) {
                        const usersData = await usersRes.json();
                        setUsers(usersData);
                    }
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

    const uploadFileHandler = async (e, fieldName) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('file', file);
        setUploading(true);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (res.ok) {
                let data = await res.text();
                setNewBook({ ...newBook, [fieldName]: data });
                setUploading(false);
            } else {
                alert('File upload failed. Ensure it is a valid file.');
                setUploading(false);
            }
        } catch (error) {
            console.error(error);
            alert('Upload error');
            setUploading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewBook({ ...newBook, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/books', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify(newBook),
            });

            if (res.ok) {
                const data = await res.json();
                setBooks([...books, data]);
                setNewBook({ title: '', author: '', category: '', cover: '', pdfUrl: '' });
                alert('Book added successfully!');
            } else {
                alert('Failed to add book');
            }
        } catch (error) {
            console.error('Error adding book:', error);
            alert('Error adding book');
        }
    };

    const handleDeleteBook = async (id) => {
        if (confirm('Are you sure you want to delete this book?')) {
            try {
                const res = await fetch(`/api/books/${id}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });

                if (res.ok) {
                    setBooks(books.filter(b => b._id !== id));
                    alert('Book deleted');
                }
            } catch (error) {
                console.error(error);
            }
        }
    }

    const topBook = [...books].sort((a, b) => b.downloads - a.downloads)[0];

    return (
        <div>
            <header className="dashboard-header">
                <h1 className="dashboard-title">Admin Dashboard</h1>
                <p className="dashboard-subtitle">Manage library resources and view system analytics.</p>
            </header>

            {loading ? <p>Loading stats...</p> : (
                <>
                    {/* Stats Section */}
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-icon">
                                <Users size={32} />
                            </div>
                            <div className="stat-info">
                                <p className="stat-label">Total Users</p>
                                <p className="stat-value">{users.length}</p>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon success">
                                <BookOpen size={32} />
                            </div>
                            <div className="stat-info">
                                <p className="stat-label">Total Books</p>
                                <p className="stat-value">{books.length}</p>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon accent">
                                <Upload size={32} />
                            </div>
                            <div className="stat-info">
                                <p className="stat-label">Most Downloaded</p>
                                <p className="stat-value" style={{ fontSize: '1.125rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '150px' }} title={topBook?.title}>{topBook?.title || 'N/A'}</p>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{topBook?.downloads || 0} downloads</p>
                            </div>
                        </div>
                    </div>

                    {/* Add Book Form */}
                    <div className="form-card">
                        <div className="form-header">
                            <Plus size={20} color="var(--primary-color)" />
                            <span>Add New Book</span>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label className="form-label">Book Title</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={newBook.title}
                                        onChange={handleInputChange}
                                        required
                                        className="form-input"
                                        placeholder="Enter book title"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Author</label>
                                    <input
                                        type="text"
                                        name="author"
                                        value={newBook.author}
                                        onChange={handleInputChange}
                                        required
                                        className="form-input"
                                        placeholder="Enter author name"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Category</label>
                                    <select
                                        name="category"
                                        value={newBook.category}
                                        onChange={handleInputChange}
                                        required
                                        className="form-input"
                                    >
                                        <option value="">Select Category</option>
                                        <option value="Fiction">Fiction</option>
                                        <option value="Non-Fiction">Non-Fiction</option>
                                        <option value="Sci-Fi">Sci-Fi</option>
                                        <option value="Technology">Technology</option>
                                        <option value="Classic">Classic</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Cover Image Upload</label>
                                    <input
                                        type="file"
                                        onChange={(e) => uploadFileHandler(e, 'cover')}
                                        className="form-input"
                                        accept="image/*"
                                        style={{ marginBottom: '0.5rem', padding: '0.5rem' }}
                                    />
                                    {newBook.cover && <span style={{fontSize: '0.8rem', color: 'var(--success-color)'}}>File attached</span>}
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Book PDF Soft Copy Upload</label>
                                    <input
                                        type="file"
                                        onChange={(e) => uploadFileHandler(e, 'pdfUrl')}
                                        className="form-input"
                                        accept="application/pdf"
                                        style={{ marginBottom: '0.5rem', padding: '0.5rem' }}
                                    />
                                    {newBook.pdfUrl && <span style={{fontSize: '0.8rem', color: 'var(--success-color)'}}>File attached</span>}
                                    {uploading && <div style={{fontSize: '0.8rem', color: 'var(--primary-color)', marginTop: '0.5rem'}}>Uploading file...</div>}
                                </div>

                                <div className="full-width" style={{ textAlign: 'right', marginTop: '1rem' }}>
                                    <button type="submit" className="btn-primary">
                                        <Upload size={16} />
                                        Publish Book
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Book List for Admin to Manage/Delete */}
                    <div style={{ marginTop: '2rem' }}>
                        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Manage Books</h2>
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            {books.map(book => (
                                <div key={book._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                                    <div>
                                        <h4 style={{ margin: 0, color: 'var(--text-primary)' }}>{book.title}</h4>
                                        <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)' }}>{book.author}</p>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteBook(book._id)}
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}
                                        title="Delete Book"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default AdminDashboard;
