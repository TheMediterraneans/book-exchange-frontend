import { Link } from "react-router-dom"
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
function AddCopy({ addBookCopy }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedBook, setSelectedBook] = useState(null);
    const [maxDuration, setMaxDuration] = useState(14);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    // Function to search books from external APIs
    const searchBooks = async (query) => {
        if (!query.trim()) return;
        setIsLoading(true);
        try {
            // Replace with your actual API endpoint for book search
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/books/search?q=${encodeURIComponent(query)}`);
            const data = await response.json();
            setSearchResults(data.books || []);
        } catch (error) {
            console.error('Error searching books:', error);
            setSearchResults([]);
        } finally {
            setIsLoading(false);
        }
    };
    // Debounced search
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (searchTerm) {
                searchBooks(searchTerm);
            } else {
                setSearchResults([]);
            }
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [searchTerm]);
    const handleBookSelect = (book) => {
        setSelectedBook(book);
        setSearchResults([]); // Hide search results after selection
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedBook) {
            alert('Please select a book first');
            return;
        }
        setIsSubmitting(true);
        try {
            const bookCopyData = {
                apiBookId: selectedBook.id,
                maxDuration: parseInt(maxDuration)
            };
            await addBookCopy(bookCopyData);
            // Reset form
            setSelectedBook(null);
            setSearchTerm('');
            setMaxDuration(14);

            // Navigate back to library or show success message
            navigate('/my-library');
        } catch (error) {
            console.error('Error adding book to library:', error);
            alert('Error adding book to library. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };
    const clearSelection = () => {
        setSelectedBook(null);
        setSearchTerm('');
    };
    return (
        <div className="add-copy-container">
            <h1>Add Book to Your Library</h1>
            <form onSubmit={handleSubmit} className="add-copy-form">
                {/* Book Search Section */}
                <div className="search-section">
                    <label htmlFor="book-search">Search for a book:</label>
                    <input
                        id="book-search"
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Enter book title, author, or ISBN..."
                        disabled={selectedBook !== null}
                        className="search-input"
                    />
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
                            {searchResults.map((book) => (
                                <li
                                    key={book.id}
                                    onClick={() => handleBookSelect(book)}
                                    className="book-item"
                                >
                                    <div className="book-info">
                                        {book.thumbnail && (
                                            <img
                                                src={book.thumbnail}
                                                alt={book.title}
                                                className="book-thumbnail"
                                            />
                                        )}
                                        <div className="book-details">
                                            <h4>{book.title}</h4>
                                            {book.authors && (
                                                <p>by {book.authors.join(', ')}</p>
                                            )}
                                            {book.publishedDate && (
                                                <p>Published: {book.publishedDate}</p>
                                            )}
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                {/* Selected Book Display */}
                {selectedBook && (
                    <div className="selected-book">
                        <h3>Selected Book:</h3>
                        <div className="book-preview">
                            {selectedBook.thumbnail && (
                                <img
                                    src={selectedBook.thumbnail}
                                    alt={selectedBook.title}
                                    className="book-thumbnail-large"
                                />
                            )}
                            <div className="book-details">
                                <h4>{selectedBook.title}</h4>
                                {selectedBook.authors && (
                                    <p><strong>Authors:</strong> {selectedBook.authors.join(', ')}</p>
                                )}
                                {selectedBook.publishedDate && (
                                    <p><strong>Published:</strong> {selectedBook.publishedDate}</p>
                                )}
                                {selectedBook.description && (
                                    <p className="description">
                                        <strong>Description:</strong>
                                        {selectedBook.description.length > 200
                                            ? `${selectedBook.description.substring(0, 200)}...`
                                            : selectedBook.description
                                        }
                                    </p>
                                )}
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