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
        
        axios.get(`${import.meta.env.VITE_SERVER_URL}/api/search-books`, { 
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
        // Navigate to BookDetailPage with book data via state
        // Using a static route to avoid issues with Open Library IDs containing slashes
        navigate('/book-detail', { 
            state: { book } 
        });
    };
    return (
        <div className="min-h-screen bg-black text-white">
            <div className="max-w-5xl mx-auto px-6 py-8">
                <h1 className="text-3xl font-bold mb-6">Offer books to fellow readers...</h1>

                <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
                    {/* Book Search Section */}
                    <div className="mb-4">
                        <label htmlFor="book-search" className="block text-sm text-gray-300 mb-2">Search for a book</label>
                        <div className="flex gap-3">
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
                                className="w-full rounded-md border border-gray-700 bg-black text-white px-3 py-2 outline-none focus:ring-2 focus:ring-teal-500"
                            />
                            <button 
                                type="button" 
                                onClick={() => searchForBooks(searchTerm)}
                                disabled={isLoading}
                                className="rounded-md bg-purple-600 hover:bg-purple-700 disabled:opacity-50 px-4 py-2 font-medium"
                            >
                                {isLoading ? 'Searching...' : 'Search'}
                            </button>
                        </div>
                    </div>

                    {/* Search Results */}
                    {isLoading && (
                        <div className="mt-4 text-teal-400">Searching books...</div>
                    )}

                    {searchResults.length > 0 && (
                        <div className="mt-8">
                            <h3 className="text-xl font-semibold mb-4">Search Results</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {searchResults.map((book, index) => {
                                    const externalId = book.key || book.id;
                                    return (
                                        <div key={`${externalId}-${index}`} className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden hover:border-teal-500 transition-all duration-300">
                                            {book.coverUrl && (
                                                <div className="aspect-[3/4] overflow-hidden">
                                                    <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                                                </div>
                                            )}
                                            <div className="p-4">
                                                <h4 className="text-lg font-semibold mb-1 line-clamp-2">{book.title}</h4>
                                                {book.authors && (
                                                    <p className="text-sm text-gray-300 mb-1">by <span className="text-teal-400">{book.authors.join(', ')}</span></p>
                                                )}
                                                <p className="text-sm text-gray-400">Year: <span className="text-purple-400">{book.publishedYear || 'Unknown'}</span></p>
                                                <p className="text-xs text-gray-500 mt-1">Source: {book.source}</p>
                                                <button
                                                    type="button"
                                                    onClick={() => handleBookSelect(book)}
                                                    className="mt-4 w-full rounded-md bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 font-medium"
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
        </div>
    );
}

export default AddCopy;
