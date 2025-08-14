import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function BookDetailPage() {
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [addingToLibrary, setAddingToLibrary] = useState(false);
    const [maxDuration, setMaxDuration] = useState(14);
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();
    const { user } = useAuth();

    useEffect(() => {
        // check if book data was passed via navigation state
        if (location.state?.book) {
            setBook(location.state.book);
            setLoading(false);
            return;
        }

        // check if book data was stored in sessionStorage (returning from login)
        const storedBookData = sessionStorage.getItem('bookDataBeforeLogin');
        if (storedBookData) {
            try {
                const parsedBook = JSON.parse(storedBookData);
                setBook(parsedBook);
                sessionStorage.removeItem('bookDataBeforeLogin'); // Clean up
                setLoading(false);
                return;
            } catch (error) {
                console.error('Error parsing stored book data:', error);
            }
        }

        // no book data available, show empty skeleton
        setBook(null);
        setLoading(false);
    }, [location.state, params.externalId]);

    const handleAddToLibrary = async () => {
        if (!user) {
            // store current location and book data before redirecting to login
            sessionStorage.setItem('redirectAfterLogin', location.pathname);
            sessionStorage.setItem('bookDataBeforeLogin', JSON.stringify(book));
            navigate('/login');
            return;
        }

        setAddingToLibrary(true);

        try {
            const authToken = localStorage.getItem('authToken');
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/mybooks/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({
                    externalId: book.key,
                    title: book.title,
                    authors: book.authors,
                    coverUrl: book.coverUrl,
                    publishedYear: book.publishedYear,
                    isbn: book.isbn,
                    language: book.language,
                    subjects: book.subjects,
                    maxDuration: parseInt(maxDuration)
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to add book to library");
            }

            alert('Book added to your lending library!');
            navigate('/mybooks');
        } catch (error) {
            console.error("Error adding book to library:", error);
            alert(`Error: ${error.message}`);
        } finally {
            setAddingToLibrary(false);
        }
    };

    const goBack = () => {
        // Always try to go back in history first
        navigate(-1);
    };

    if (loading) {
        return <div style={{ padding: '20px' }}>Loading book details...</div>;
    }

    if (error) {
        return <div style={{ padding: '20px', color: 'red' }}>Error: {error}</div>;
    }

    if (!book) {
        return <div style={{ padding: '20px' }}>Book not found</div>;
    }

    return (
        <div style={{ padding: '20px', maxWidth: '800px' }}>
            {/* Back Button */}
            <button 
                onClick={goBack}
                style={{
                    marginBottom: '20px',
                    padding: '10px 20px',
                    backgroundColor: '#4f46e5',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: '500',
                    transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#3730a3'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#4f46e5'}
            >
                ← Back to Search
            </button>
            
            <h1 style={{ borderBottom: '2px solid #ddd', paddingBottom: '10px' }}>
                {book.title}
            </h1>
            
            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                {book.coverUrl && (
                    <img 
                        src={book.coverUrl} 
                        alt={book.title}
                        style={{ 
                            width: '150px', 
                            height: 'auto',
                            border: '1px solid #ddd'
                        }}
                    />
                )}
                
                <div style={{ flex: 1 }}>
                    <p><strong>Authors:</strong> {book.authors?.join(', ') || 'Unknown'}</p>
                    <p><strong>Published Year:</strong> {book.publishedYear || 'Unknown'}</p>
                    <p><strong>ISBN:</strong> {book.isbn || 'Not available'}</p>
                    <p><strong>Language:</strong> {book.language || 'Unknown'}</p>
                    <p><strong>Source:</strong> {book.source || 'External'}</p>
                    
                    {book.subjects && book.subjects.length > 0 && (
                        <p><strong>Subjects:</strong> {book.subjects.join(', ')}</p>
                    )}
                </div>
            </div>

            <div style={{ marginTop: '30px', borderTop: '1px solid #ddd', paddingTop: '20px' }}>
                {!location.state?.fromDatabase && (
                    <>
                        {user && (
                            <div style={{ marginBottom: '20px' }}>
                                <label htmlFor="max-duration" style={{ 
                                    display: 'block', 
                                    marginBottom: '8px',
                                    fontWeight: 'bold' 
                                }}>
                                    Maximum loan duration (days):
                                </label>
                                <input
                                    id="max-duration"
                                    type="number"
                                    min="1"
                                    max="30"
                                    value={maxDuration}
                                    onChange={(e) => setMaxDuration(e.target.value)}
                                    style={{
                                        padding: '8px 12px',
                                        border: '1px solid #ddd',
                                        borderRadius: '4px',
                                        fontSize: '14px',
                                        width: '100px'
                                    }}
                                />
                                <small style={{ 
                                    display: 'block', 
                                    marginTop: '5px', 
                                    color: '#666' 
                                }}>
                                    Choose how many days you're willing to lend this book (1-30 days)
                                </small>
                            </div>
                        )}
                        
                        <button
                            onClick={handleAddToLibrary}
                            disabled={addingToLibrary}
                            style={{
                                padding: '12px 24px',
                                backgroundColor: user ? '#28a745' : '#007bff',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: addingToLibrary ? 'not-allowed' : 'pointer',
                                fontSize: '16px',
                                opacity: addingToLibrary ? 0.6 : 1
                            }}
                        >
                            {addingToLibrary 
                                ? 'Adding...' 
                                : user 
                                    ? 'Add to My Lending Library' 
                                    : 'Login to Add to Library'
                            }
                        </button>
                        
                        {!user && (
                            <p style={{ marginTop: '10px', color: '#666', fontSize: '14px' }}>
                                You need to login to add books to your lending library
                            </p>
                        )}
                    </>
                )}
                
                {location.state?.fromDatabase && (
                    <div style={{ 
                        padding: '15px', 
                        backgroundColor: '#f8f9fa', 
                        border: '1px solid #dee2e6', 
                        borderRadius: '4px'
                    }}>
                        {(() => {
                            const availableCopies = location.state?.availableCopies || [];
                            const availableCount = location.state?.availableCount;
                            const isLoggedInContext = location.state?.isLoggedIn;
                            const currentUserId = user?._id;
                            
                            if (isLoggedInContext && availableCopies.length > 0) {
                                // filter copies to find ones owned by current user and others
                                const ownedCopies = availableCopies.filter(copy => copy.owner === currentUserId || copy.owner?._id === currentUserId);
                                const borrowableCopies = availableCopies.filter(copy => copy.owner !== currentUserId && copy.owner?._id !== currentUserId);
                                
                                if (ownedCopies.length > 0) {
                                    return (
                                        <div>
                                            <p style={{ color: '#28a745', fontWeight: 'bold' }}>
                                                ✓ You own {ownedCopies.length} {ownedCopies.length === 1 ? 'copy' : 'copies'} of this book
                                            </p>
                                            <p style={{ color: '#6c757d' }}>
                                                This book is in your lending library. You can view and manage your copies in "My Books".
                                            </p>
                                            <button
                                                onClick={() => navigate('/mybooks')}
                                                style={{
                                                    padding: '8px 16px',
                                                    backgroundColor: '#28a745',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '4px',
                                                    cursor: 'pointer',
                                                    marginTop: '10px'
                                                }}
                                            >
                                                Go to My Books
                                            </button>
                                        </div>
                                    );
                                } else if (borrowableCopies.length > 0) {
                                    return (
                                        <div>
                                            <p style={{ color: '#007bff', fontWeight: 'bold' }}>
                                                📚 {borrowableCopies.length} {borrowableCopies.length === 1 ? 'copy is' : 'copies are'} available for borrowing
                                            </p>
                                            <p style={{ color: '#6c757d' }}>
                                                You can reserve this book from other users.
                                            </p>
                                            <button
                                                onClick={() => navigate('/reservation', {
                                                    state: {
                                                        book: book,
                                                        availableCopies: borrowableCopies
                                                    }
                                                })}
                                                style={{
                                                    padding: '8px 16px',
                                                    backgroundColor: '#007bff',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '4px',
                                                    cursor: 'pointer',
                                                    marginTop: '10px'
                                                }}
                                            >
                                                Reserve This Book
                                            </button>
                                        </div>
                                    );
                                } else {
                                    return (
                                        <div>
                                            <p style={{ color: '#dc3545', fontWeight: 'bold' }}>
                                                ❌ No copies available for borrowing
                                            </p>
                                            <p style={{ color: '#6c757d' }}>
                                                This book is not currently available in our lending network.
                                            </p>
                                        </div>
                                    );
                                }
                            }

                            else if (!isLoggedInContext && typeof availableCount === 'number') {
                                if (availableCount > 0) {
                                    return (
                                        <div>
                                            <p style={{ color: '#ffc107', fontWeight: 'bold' }}>
                                                📚 {availableCount} {availableCount === 1 ? 'copy is' : 'copies are'} available for borrowing
                                            </p>
                                            <p style={{ color: '#6c757d' }}>
                                                Please log in to see copy details and make a reservation.
                                            </p>
                                            <button
                                                onClick={() => navigate('/login')}
                                                style={{
                                                    padding: '8px 16px',
                                                    backgroundColor: '#ffc107',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '4px',
                                                    cursor: 'pointer',
                                                    marginTop: '10px'
                                                }}
                                            >
                                                Login to Reserve
                                            </button>
                                        </div>
                                    );
                                } else {
                                    return (
                                        <div>
                                            <p style={{ color: '#dc3545', fontWeight: 'bold' }}>
                                                ❌ No copies available for borrowing
                                            </p>
                                            <p style={{ color: '#6c757d' }}>
                                                This book is not currently available in our lending network.
                                            </p>
                                        </div>
                                    );
                                }
                            }
                            // Fallback for cases where copy information is not available
                            else {
                                return (
                                    <div>
                                        <p style={{ color: '#6c757d', fontWeight: 'bold' }}>
                                            📖 Book information from our lending network
                                        </p>
                                        <p style={{ color: '#6c757d' }}>
                                            Copy availability information is not available in this view.
                                        </p>
                                    </div>
                                );
                            }
                        })()}
                    </div>
                )}
            </div>
        </div>
    );
}

export default BookDetailPage;
