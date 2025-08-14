import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Homepage() {
    const [featuredBooks, setFeaturedBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        setTimeout(() => {
            setFeaturedBooks([
                {
                    id: 1,
                    title: "The Great Gatsby",
                    authors: ["F. Scott Fitzgerald"],
                    coverUrl: "https://covers.openlibrary.org/b/isbn/9780141182636-L.jpg",
                    availableCount: 3
                },
                {
                    id: 2,
                    title: "To Kill a Mockingbird",
                    authors: ["Harper Lee"],
                    coverUrl: "https://covers.openlibrary.org/b/isbn/9780061120084-L.jpg",
                    availableCount: 2
                },
                {
                    id: 3,
                    title: "1984",
                    authors: ["George Orwell"],
                    coverUrl: "https://covers.openlibrary.org/b/isbn/9780451524935-L.jpg",
                    availableCount: 1
                },
                {
                    id: 4,
                    title: "Pride and Prejudice",
                    authors: ["Jane Austen"],
                    coverUrl: "https://covers.openlibrary.org/b/isbn/9780141439518-L.jpg",
                    availableCount: 4
                }
            ]);
            setLoading(false);
        }, 1000);
    }, []);

    return (
        <div className="font-['Sreda'] min-h-screen bg-gray-900 text-white">
            {/* Hero Section */}
            <div className="text-center py-12">
                <h1 className="text-5xl font-bold mb-6">Welcome to Books.Inc</h1>
                <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-8">
                    Find your next book, borrow from others, share your library, and manage your reservations easily!
                </p>
                
                <div className="flex justify-center gap-4">
                    {!user ? (
                        
                        <Link to="/login"> 
                        <span className='get-started-button'>
                            <button className="bg-orange-600 hover:bg-orange-400 px-6 py-3 rounded-lg font-semibold">
                                Get Started
                            </button>
                            </span>
                        </Link>
                    ) : (
                        <>
                        <section className='logged-navigation-button'>
                            <Link to="/mybooks">
                                <button className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg font-semibold">
                                    My Library
                                </button>
                            </Link>
                            <Link to="/copies">
                                <button className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-semibold">
                                    Find Books to borrow
                                </button>
                            </Link>
                            </section>
                        </>
                    )}
                </div>
            </div>

            {/* Featured Books Section */}
            <div className="max-w-6xl mx-auto px-4 py-12">
                <h2 className="text-3xl font-bold text-center mb-6">Featured Books</h2>
                {loading ? (
                    <p className="text-center text-gray-400">Loading books...</p>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {featuredBooks.map((book) => (
                            <div key={book.id} className="bg-gray-800 rounded-lg p-4 flex flex-col items-center">
                                {book.coverUrl && (
                                    <img
                                        src={book.coverUrl}
                                        alt={book.title}
                                        className="w-32 h-48 object-cover mb-4 rounded"
                                    />
                                )}
                                <h3 className="text-lg font-semibold text-center">{book.title}</h3>
                                <p className="text-sm text-gray-300 mb-2">
                                    by {book.authors.join(', ')}
                                </p>
                                <span className="text-green-400 text-sm mb-2">
                                    {book.availableCount} Available
                                </span>
                                <Link to={user ? "/book-detail" : "/login"} className="text-blue-400 hover:underline text-sm">
                                    View Details
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Homepage;
