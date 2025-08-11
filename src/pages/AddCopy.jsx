import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import "../components/addCopy.css";

function AddCopy() {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Check authentication status - but since this page is now protected, user will always be authenticated
    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (!token) {
            console.log("No token found, user should be redirected by ProtectedRoute");
        }
    }, []);

    const searchForBooks = (term) => {
        if (!term.trim()) {
            setSearchResults([]);
            return;
        }

        setIsLoading(true);
        
        axios.get('http://localhost:5005/api/search-books', { 
            params: { q: term } 
        })
            .then(response => {
                console.log('Search response:', response.data);
                setSearchResults(response.data);
            })
            .catch(error => {
                console.error('Search error:', error);
                setSearchResults([]);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const handleBookSelect = (book) => {
        setSelectedBook(book);
    };
    const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedBook) {
        alert('Please select a book first');
        return;
    }

    setIsSubmitting(true);
    try {
        // Debug: log the selected book to see its structure
        console.log('Selected book:', selectedBook);
        
        const externalId = selectedBook.key || selectedBook.id;
        console.log('External ID:', externalId);
        
        if (!externalId) {
            throw new Error('No valid external ID found for this book');
        }
        
        const bookCopyData = {
            externalId: externalId,
            title: selectedBook.title,
            authors: selectedBook.authors || [],
            coverUrl: selectedBook.coverUrl || null,
            publishedYear: selectedBook.publishedYear || null,
            maxDuration: parseInt(maxDuration)
        };

        console.log('Book copy data being sent:', bookCopyData);
        await addBookCopy(bookCopyData);
        
        // Reset form
        setSelectedBook(null);
        setSearchTerm('');
        setSearchResults([]);
        setMaxDuration(14);
        
        // Navigate back to library
        navigate('/mybooks');
    } catch (error) {
        console.error('Error adding book to library:', error);
        alert('Error adding book to library. Please try again.'); //alert to style
    } finally {
        setIsSubmitting(false);
    }
};

    const clearSelection = () => {
        setSelectedBook(null);
        // Navigate to book detail page with book data
        const externalId = book.key || book.id || 'unknown';
        const encodedId = encodeURIComponent(externalId);
        navigate(`/book/${encodedId}`, {
            state: {
                book: book
            }
        });
    };

    return (
        <div className="add-copy-container">
            <h1>Find Books you want to Lend...</h1>
            <div className="search-container">
                {/* Book Search Section */}
                <div className="search-section">
                    <label htmlFor="book-search">Search for a book:</label>
                    <input
                        id="book-search"
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyUp={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                searchForBooks(searchTerm);
                            }
                        }}
                        placeholder="Enter book title, author, or ISBN"
                        className="search-input"
                    />
                    <button 
                        type="button" 
                        onClick={() => searchForBooks(searchTerm)}
                        disabled={isLoading}
                        className="search-btn"
                    >
                        {isLoading ? 'Searching...' : 'Search'}
                    </button>
                </div>

                {/* Search Results */}
                {isLoading && (
                    <div className="loading">Searching books...</div> //add style
                )}
                {searchResults.length > 0 && !selectedBook && (
                    <div className="search-results">
                        <h3>Search Results:</h3>
                        <div className="results-grid">
                            {searchResults.map((book, index) => {
                                const externalId = book.key || book.id;
                                return (
                                    <div key={`${externalId}-${index}`} className="book-result">
                                        <div className="book-info">
                                            <h4>{book.title}</h4>
                                            <p><strong>Authors:</strong> {book.authors ? book.authors.join(', ') : 'Unknown'}</p>
                                            <p><strong>Year:</strong> {book.publishedYear || 'Unknown'}</p>
                                            <p><strong>Source:</strong> {book.source}</p>
                                            {book.coverUrl && (
                                                <img src={book.coverUrl} alt={book.title} className="book-cover" />
                                            )}
                                        </div>
                                        <div className="book-actions">
                                            <button
                                                type="button"
                                                onClick={() => handleBookSelect(book)}
                                                className="view-details-btn"
                                            >
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AddCopy;
