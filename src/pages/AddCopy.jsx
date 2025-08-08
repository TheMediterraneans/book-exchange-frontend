
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../components/addCopy.css";

function AddCopy({ addBookCopy }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedBook, setSelectedBook] = useState(null);
    const [maxDuration, setMaxDuration] = useState(14);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    // Function to search books using the same logic as BookSearch
    const doSearch = (e) => {
        e.preventDefault();
        
        if (!searchTerm.trim()) return;
        
        setIsLoading(true);
        setSearchResults([]);
        setSelectedBook(null);

        axios.get('http://localhost:5005/api/search-books', { params: { q: searchTerm } })
            .then((response) => {
                setSearchResults(response.data);
            })
            .catch((err) => {
                console.error('Search error', err);
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
        alert('Error adding book to library. Please try again.');
    } finally {
        setIsSubmitting(false);
    }
};

    const clearSelection = () => {
        setSelectedBook(null);
    };

    return (
        <div className="add-copy-container">
            <h1>Add Book to Your Library</h1>
            
            <form onSubmit={handleSubmit} className="add-copy-form">
                {/* Book Search Section */}
                <div className="search-section">
                    <label htmlFor="book-search">Search for a book:</label>
                    <div className="search-input-group">
                        <input
                            id="book-search"
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Enter book title, author, or ISBN..."
                            className="search-input"
                        />
                        <button 
                            type="button" 
                            onClick={doSearch}
                            className="search-btn"
                        >
                            Search
                        </button>
                    </div>
                    
                    {selectedBook && (
                        <button 
                            type="button" 
                            onClick={clearSelection}
                            className="clear-selection-btn"
                        >
                            Change Book
                        </button>
                    )}
                </div>

                {/* Search Results */}
                {isLoading && (
                    <div className="loading">Searching books...</div>
                )}

                {searchResults.length > 0 && !selectedBook && (
                    <div className="search-results">
                        <h3>Search Results:</h3>
                        <ul className="book-list">
                            {searchResults.map((book) => {
                                const externalId = book.key || book.id;
                                
                                return (
                                    <li 
                                        key={externalId} 
                                        onClick={() => handleBookSelect(book)}
                                        className="book-item"
                                    >
                                        <div className="book-info">
                                            {book.coverUrl && (
                                                <img 
                                                    src={book.coverUrl} 
                                                    alt={book.title}
                                                    className="book-thumbnail"
                                                />
                                            )}
                                            <div className="book-details">
                                                <h4>{book.title}</h4>
                                                {book.authors && book.authors.length > 0 && (
                                                    <p>by {book.authors.join(', ')}</p>
                                                )}
                                                {book.publishedYear && (
                                                    <p>Published: {book.publishedYear}</p>
                                                )}
                                                <p className="source-tag">Source: {book.source}</p>
                                            </div>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                )}

                {/* Selected Book Display */}
                {selectedBook && (
                    <div className="selected-book">
                        <h3>Selected Book:</h3>
                        <div className="book-preview">
                            {selectedBook.coverUrl && (
                                <img 
                                    src={selectedBook.coverUrl} 
                                    alt={selectedBook.title}
                                    className="book-thumbnail-large"
                                />
                            )}
                            <div className="book-details">
                                <h4>{selectedBook.title}</h4>
                                {selectedBook.authors && selectedBook.authors.length > 0 && (
                                    <p><strong>Authors:</strong> {selectedBook.authors.join(', ')}</p>
                                )}
                                {selectedBook.publishedYear && (
                                    <p><strong>Published:</strong> {selectedBook.publishedYear}</p>
                                )}
                                <p><strong>Source:</strong> {selectedBook.source}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Duration Setting */}
                <div className="duration-section">
                    <label htmlFor="max-duration">Maximum loan duration (days):</label>
                    <input
                        id="max-duration"
                        type="number"
                        min="1"
                        max="30"
                        value={maxDuration}
                        onChange={(e) => setMaxDuration(e.target.value)}
                        className="duration-input"
                    />
                    <small>Choose how many days you're willing to lend this book (1-30 days)</small>
                </div>

                {/* Submit Button */}
                <button 
                    type="submit" 
                    disabled={!selectedBook || isSubmitting}
                    className="submit-btn"
                >
                    {isSubmitting ? 'Adding to Library...' : 'Add to My Library'}
                </button>
            </form>
        </div>
    );
}

export default AddCopy;
