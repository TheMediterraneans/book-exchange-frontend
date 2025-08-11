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
        // Check if book data was passed via navigation state
        if (location.state?.book) {
            setBook(location.state.book);
            setLoading(false);
            return;
        }

        // Check if book data was stored in sessionStorage (returning from login)
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

        // No book data available, show empty skeleton
        setBook(null);
        setLoading(false);
    }, [location.state, params.externalId]);

    const handleAddToLibrary = async () => {
        if (!user) {
            // Store current location and book data before redirecting to login
            sessionStorage.setItem('redirectAfterLogin', location.pathname);
            sessionStorage.setItem('bookDataBeforeLogin', JSON.stringify(book));
            navigate('/login');
            return;
        }

        if (!book) return;

        try {
            setAddingToLibrary(true);
            
            const bookCopyData = {
                externalId: book.key || book.id,
                title: book.title,
                authors: book.authors || [],
                publishedYear: book.publishedYear,
                isbn: book.isbn,
                coverUrl: book.coverUrl,
                language: book.language,
                subjects: book.subjects || [],
                source: book.source || 'external',
                maxDuration: parseInt(maxDuration)
            };

            const storedToken = localStorage.getItem("authToken");
            const response = await fetch(`http://localhost:5005/api/mybooks/add`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${storedToken}`,
                },
                body: JSON.stringify(bookCopyData),
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
           {/* <button onClick={() => navigate(-1)}>Back to the previous page</button> */}
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
            </div>
        </div>
    );
}

export default BookDetailPage;
