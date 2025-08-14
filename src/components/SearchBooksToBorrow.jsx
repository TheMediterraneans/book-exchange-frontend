import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

function SearchBooksToBorrow() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const performSearch = useCallback((term) => {
        if (!term.trim()) {
            setResults([]);
            return;
        }

        const authToken = localStorage.getItem('authToken');
        const isLoggedIn = !!authToken;

        setLoading(true);
        setResults([]);

        // choose search endpoint based on user authentication status
        const endpoint = isLoggedIn
            ?` ${import.meta.env.VITE_SERVER_URL}/api/search-available-books`  // Full details with owner info
            : `${import.meta.env.VITE_SERVER_URL}/api/browse-available-books`; // Public version without owner info

        const headers = isLoggedIn
            ? { Authorization: `Bearer ${authToken}` }
            : {}; // no auth header for public search endpoint

        axios.get(endpoint, {
            params: { q: term },
            headers: headers
        })
            .then((response) => {
                setResults(response.data);
            })
            .catch((error) => {
                console.error('Search error', error);

                // If the search endpoint doesn't exist, show specific error
                if (error.response?.status === 404) {
                    // Check if this is a "route does not exist" error
                    // if (error.response?.data?.message === "This route does not exist") {
                    //     const authToken = localStorage.getItem('authToken');
                    //     const endpoint = authToken ? 'search-available-books' : 'browse-available-books';
                    //     throw new Error(`The '${endpoint}' endpoint is not implemented in your backend yet. Please add the route to your bookCopy.routes.js file.`);
                    // }
                } else if (error.response?.status === 401) {
                    alert('Please log in again');
                    navigate('/login');
                    return;
                }

                throw error;
            })
            .catch((error) => {
                console.error('Final search error', error);

                if (error.code === 'ECONNREFUSED' || error.message.includes('ECONNREFUSED')) {
                    alert(`Backend server is not running. Please start your backend server on ${import.meta.env.VITE_SERVER_URL} and try again.`);
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
    }, [navigate]);

    // Initialize search term from URL parameters on mount
    useEffect(() => {
        const urlSearchTerm = searchParams.get('q');
        if (urlSearchTerm) {
            setSearchTerm(urlSearchTerm);
            performSearch(urlSearchTerm);
        }
    }, [searchParams, performSearch]);

    const doSearch = (e) => {
        e.preventDefault();

        if (!searchTerm.trim()) {
            return;
        }

        // Update URL with search term
        setSearchParams({ q: searchTerm });
        // Perform the search
        performSearch(searchTerm);
    };

    const beginReserve = (bookData) => {
        navigate('/reservation', {
            state: {
                book: {
                    externalId: bookData.externalId,
                    title: bookData.title,
                    authors: bookData.authors,
                    coverUrl: bookData.coverUrl,
                    publishedYear: bookData.publishedYear
                },
                selectedCopy: bookData.selectedCopy
            }
        });
    };

    const viewBookDetails = (bookData) => {
        navigate('/book-detail', {
            state: { 
                book: {
                    key: bookData.externalId,
                    title: bookData.title,
                    authors: bookData.authors,
                    coverUrl: bookData.coverUrl,
                    publishedYear: bookData.publishedYear,
                    source: 'database'
                },
                fromDatabase: true,
                availableCopies: bookData.copies || [], // detailed copy info for logged-in users
                availableCount: bookData.availableCount || 0, // count for non-logged-in users
                isLoggedIn: !!localStorage.getItem('authToken') // pass login status
            }
        });
    };

    return (
        <div>
            {/* Styled Search Container - matching AddCopy page */}
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
                {/* Book Search Section */}
                <div className="mb-4">
                    <label htmlFor="book-search" className="block text-sm text-gray-300 mb-2">
                        Search for a book
                    </label>
                    <div className="flex gap-3">
                        <input
                            id="book-search"
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyUp={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    doSearch(e);
                                }
                            }}
                            placeholder="Enter book title, author, or ISBN"
                            className="w-full rounded-md border border-gray-700 bg-black text-white px-3 py-2 outline-none focus:ring-2 focus:ring-teal-500"
                        />
                        <button 
                            type="button"
                            onClick={doSearch}
                            disabled={loading}
                            className="rounded-md bg-purple-600 hover:bg-purple-700 disabled:opacity-50 px-4 py-2 font-medium"
                        >
                            {loading ? 'Searching...' : 'Search'}
                        </button>
                    </div>
                </div>
            </div>

            {loading && <div style={{ 
                textAlign: 'center', 
                padding: '2rem',
                color: 'rgb(209, 213, 219)' 
            }}>
                Searching available books...
            </div>}

            <div>
                {results.flatMap((bookData) => {
                    // show each copy as a separate entry
                    if (bookData.copies) {
                        return bookData.copies.map((copy, index) => (
                            <div key={copy._id} style={{
                                border: '2px solid #ddd',
                                padding: '15px',
                                margin: '15px 0',
                                borderRadius: '8px',
                                backgroundColor: copy.isOwnedByCurrentUser ? '#f0f8ff' : '#fff'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px', color: 'black' }}>
                                    {bookData.coverUrl && (
                                        <img
                                            src={bookData.coverUrl}
                                            alt={bookData.title}
                                            width="80"
                                            style={{ borderRadius: '4px' }}
                                        />
                                    )}
                                    <div>
                                        <h3 style={{ fontFamily: 'Sreda, serif', fontWeight: 'bold', fontSize: '1.5rem' }}>{bookData.title}</h3>
                                        {bookData.authors && bookData.authors.length > 0 && (
                                            <p><strong>Authors:</strong> {bookData.authors.join(', ')}</p>
                                        )}
                                        <p><strong>Owner:</strong> {copy.isOwnedByCurrentUser ? 'You' : copy.owner.name}</p>
                                        <p><strong>Max Duration:</strong> {copy.maxDuration} days</p>

                                        <div style={{ display: 'flex', gap: '10px', marginTop: '10px', alignItems: 'center' }}>
                                            <button
                                                onClick={() => viewBookDetails(bookData)}
                                                style={{
                                                    backgroundColor: '#6c757d',
                                                    color: 'white',
                                                    padding: '8px 16px',
                                                    border: 'none',
                                                    borderRadius: '4px',
                                                    cursor: 'pointer',
                                                    fontSize: '14px'
                                                }}
                                            >
                                                View Details
                                            </button>

                                            {copy.isOwnedByCurrentUser ? (
                                                <span style={{
                                                    color: '#666',
                                                    fontStyle: 'italic',
                                                    padding: '8px',
                                                    backgroundColor: '#e9ecef',
                                                    borderRadius: '4px'
                                                }}>
                                                    This is your copy
                                                </span>
                                            ) : (
                                                <button
                                                    onClick={() => beginReserve({
                                                        ...bookData,
                                                        selectedCopy: copy
                                                    })}
                                                    style={{
                                                        backgroundColor: '#28a745',
                                                        color: 'white',
                                                        padding: '8px 16px',
                                                        border: 'none',
                                                        borderRadius: '4px',
                                                        cursor: 'pointer',
                                                        fontSize: '14px'
                                                    }}
                                                >
                                                    Borrow from {copy.owner.name}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ));
                    } else {
                        // Non-logged-in user - show grouped book entry
                        return (
                            <div key={bookData.externalId} style={{
                                border: '2px solid #ddd',
                                padding: '15px',
                                margin: '15px 0',
                                borderRadius: '8px',
                                maxWidth: '56rem',
                            }}>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px', width: '100%' }}>
                                    {bookData.coverUrl && (
                                        <img
                                            src={bookData.coverUrl}
                                            alt={bookData.title}
                                            width="80"
                                            style={{ borderRadius: '4px' }}
                                        />
                                    )}
                                    <div>
                                        <h3>{bookData.title}</h3>
                                        {bookData.authors && bookData.authors.length > 0 && (
                                            <p><strong>Authors:</strong> {bookData.authors.join(', ')}</p>
                                        )}
                                        <p><strong>Available Copies:</strong> {bookData.availableCount}</p>
                                        
                                        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                            <button
                                                onClick={() => viewBookDetails(bookData)}
                                                style={{
                                                    backgroundColor: '#6c757d',
                                                    color: 'white',
                                                    padding: '8px 16px',
                                                    border: 'none',
                                                    borderRadius: '4px',
                                                    cursor: 'pointer',
                                                    fontSize: '14px'
                                                }}
                                            >
                                                View Details
                                            </button>
                                            
                                            <button
                                                onClick={() => navigate('/login')}
                                                style={{
                                                    backgroundColor: '#007bff',
                                                    color: 'white',
                                                    padding: '8px 16px',
                                                    border: 'none',
                                                    borderRadius: '4px',
                                                    cursor: 'pointer',
                                                    fontSize: '14px'
                                                }}
                                            >
                                                Login to Borrow This Book
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    }
                })}
            </div>

            {!loading && results.length === 0 && searchTerm && (
                <p style={{ 
                    textAlign: 'center', 
                    color: 'rgb(209, 213, 219)',
                    padding: '2rem' 
                }}>
                    No available books found. Try a different search term.
                </p>
            )}
        </div>
    );
}

export default SearchBooksToBorrow;