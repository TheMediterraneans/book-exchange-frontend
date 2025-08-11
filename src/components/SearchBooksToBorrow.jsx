import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function SearchBooksToBorrow() {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const doSearch = (e) => {
        e.preventDefault();

        if (!searchTerm.trim()) return;

        // Check authentication status
        const authToken = localStorage.getItem('authToken');
        const isLoggedIn = !!authToken;
        
        console.log('Starting search for:', searchTerm, 'Logged in:', isLoggedIn);
        setLoading(true);
        setResults([]);

        // Choose endpoint based on authentication status
        const endpoint = isLoggedIn 
            ? 'http://localhost:5005/api/search-available-books'  // Full details with owner info
            : 'http://localhost:5005/api/browse-available-books'; // Public version without owner info
        
        const headers = isLoggedIn 
            ? { Authorization: `Bearer ${authToken}` }
            : {}; // No auth header for public endpoint

        // Search for available books
        axios.get(endpoint, {
            params: { q: searchTerm },
            headers: headers
        })
            .then((response) => {
                console.log('Search response:', response.data);
                setResults(response.data);
            })
            .catch((error) => {
                console.error('Search error', error);
                
                // If the search endpoint doesn't exist, show specific error
                if (error.response?.status === 404) {
                    console.log('Search endpoint not found (404)');
                    console.log('Error message:', error.response?.data?.message);
                    
                    // Check if this is a "route does not exist" error
                    if (error.response?.data?.message === "This route does not exist") {
                        const authToken = localStorage.getItem('authToken');
                        const endpoint = authToken ? 'search-available-books' : 'browse-available-books';
                        throw new Error(`The '${endpoint}' endpoint is not implemented in your backend yet. Please add the route to your bookCopy.routes.js file.`);
                    }
                } else if (error.response?.status === 401) {
                    alert('Please log in again');
                    navigate('/login');
                    return;
                }
                
                throw error;
            })
            .catch((error) => {
                console.error('Final search error', error);
                console.error('Error details:', {
                    code: error.code,
                    message: error.message,
                    response: error.response?.status,
                    responseData: error.response?.data
                });
                
                if (error.code === 'ECONNREFUSED' || error.message.includes('ECONNREFUSED')) {
                    alert('Backend server is not running. Please start your backend server on http://localhost:5005 and try again.');
                    setResults([]);
                } else if (error.message.includes('API routes not implemented')) {
                    alert('Backend server is running but API routes are not set up yet. Please implement the book search endpoints in your backend.');
                    setResults([]);
                } else if (error.response?.status === 401) {
                    alert('Please log in again');
                    navigate('/login');
                } else {
                    alert(`Error searching for books: ${error.message || 'Please check if the backend API routes are properly implemented.'}`);
                    setResults([]);
                }
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const beginReserve = (bookData) => {
        navigate('/reserve', {
            state: {
                book: bookData.bookInfo,
                availableCopies: bookData.copies
            }
        });
    };

    return (
        <div>
            {/* Authentication status banner */}
            {!localStorage.getItem('authToken') && (
                <div style={{ 
                    backgroundColor: '#e7f3ff', 
                    border: '1px solid #b3d7ff', 
                    padding: '10px', 
                    marginBottom: '20px',
                    borderRadius: '5px'
                }}>
                    <p style={{ margin: 0 }}>
                        <strong>Browsing Mode:</strong> You can search available books, but you'll need to{' '}
                        <button 
                            onClick={() => navigate('/login')}
                            style={{ 
                                background: 'none', 
                                border: 'none', 
                                color: '#007bff', 
                                textDecoration: 'underline',
                                cursor: 'pointer'
                            }}
                        >
                            log in
                        </button> to see owner details and borrow books.
                    </p>
                </div>
            )}
            
            <form onSubmit={doSearch}>
                <input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search for available books to borrow"
                />
                <button type="submit" >
                    Search Available Books
                </button>
            </form>

            {loading && <div>Searching available books...</div>}

            <div style={{ marginTop: '20px' }}>
                {results.map((bookData) => {
                    return (
                        <div key={bookData.externalId} >
                            <div>
                                {bookData.coverUrl && (
                                    <img
                                        src={bookData.coverUrl}
                                        alt={bookData.title}
                                        width="80"
                                    />
                                )}
                                <div>
                                    <h3>{bookData.title}</h3>
                                    {bookData.authors && bookData.authors.length > 0 && (
                                        <p><strong>Authors:</strong> {bookData.authors.join(', ')}</p>
                                    )}
                                    
                                    {/* Show different info based on authentication status */}
                                    {bookData.copies ? (
                                        // Logged in user - show detailed copy info
                                        <>
                                            <p><strong>Available Copies:</strong> {bookData.copies.length}</p>
                                            {bookData.copies.length > 0 && (
                                                <button
                                                    onClick={() => beginReserve(bookData)}
                                                >
                                                    Reserve This Book
                                                </button>
                                            )}
                                        </>
                                    ) : (
                                        // Non-logged-in user - show count and login prompt
                                        <>
                                            <p><strong>Available Copies:</strong> {bookData.availableCount}</p>
                                            <button
                                                onClick={() => navigate('/login')}
                                                style={{ backgroundColor: '#007bff', color: 'white' }}
                                            >
                                                Login to Borrow This Book
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {!loading && results.length === 0 && searchTerm && (
                <p>No available books found. Try a different search term.</p>
            )}
        </div>
    );
}

export default SearchBooksToBorrow;
