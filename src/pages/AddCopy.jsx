
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

            {/*<style jsx>{`
                .add-copy-container {
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 20px;
                }

                .add-copy-form {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }

                .search-section {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }

                .search-input {
                    padding: 10px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    font-size: 16px;
                }

                .search-input:disabled {
                    background-color: #f5f5f5;
                }

                .clear-selection-btn {
                    align-self: flex-start;
                    padding: 5px 10px;
                    background-color: #6c757d;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                }

                .loading {
                    text-align: center;
                    color: #666;
                    padding: 20px;
                }

                .search-results {
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    max-height: 400px;
                    overflow-y: auto;
                }

                .book-list {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }

                .book-item {
                    padding: 15px;
                    border-bottom: 1px solid #eee;
                    cursor: pointer;
                    transition: background-color 0.2s;
                }

                .book-item:hover {
                    background-color: #f8f9fa;
                }

                .book-item:last-child {
                    border-bottom: none;
                }

                .book-info {
                    display: flex;
                    gap: 15px;
                }

                .book-thumbnail {
                    width: 60px;
                    height: 80px;
                    object-fit: cover;
                    border-radius: 4px;
                }

                .book-thumbnail-large {
                    width: 120px;
                    height: 160px;
                    object-fit: cover;
                    border-radius: 4px;
                }

                .book-details h4 {
                    margin: 0 0 5px 0;
                    color: #333;
                }

                .book-details p {
                    margin: 0 0 3px 0;
                    color: #666;
                    font-size: 14px;
                }

                .selected-book {
                    border: 2px solid #28a745;
                    border-radius: 4px;
                    padding: 15px;
                    background-color: #f8fff9;
                }

                .book-preview {
                    display: flex;
                    gap: 15px;
                }

                .description {
                    margin-top: 10px !important;
                }

                .duration-section {
                    display: flex;
                    flex-direction: column;
                    gap: 5px;
                }

                .duration-input {
                    width: 100px;
                    padding: 8px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                }

                .duration-section small {
                    color: #666;
                    font-size: 12px;
                }

                .submit-btn {
                    padding: 12px 24px;
                    background-color: #007bff;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    font-size: 16px;
                    cursor: pointer;
                    transition: background-color 0.2s;
                }

                .submit-btn:hover:not(:disabled) {
                    background-color: #0056b3;
                }

                .submit-btn:disabled {
                    background-color: #6c757d;
                    cursor: not-allowed;
                }
            `}</style>*/}
        </div>
    );
}

export default AddCopy;
