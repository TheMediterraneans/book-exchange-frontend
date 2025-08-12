import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Homepage() {
    const [featuredBooks, setFeaturedBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    // Simulated featured books - replace with actual API call
    useEffect(() => {
        // Simulate API call
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
        <div className="min-h-screen bg-gray-900 text-white">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
                <div className="max-w-7xl mx-auto px-6 py-16">
                    <div className="text-center">
                        <h1 className="text-5xl md:text-6xl font-bold text-white mb-8">
                            Welcome to{' '}
                            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent">
                                My Books App
                            </span>
                        </h1>
                        
                        <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
                            Find your next book to read, borrow it from other users that share with you the love for books and readings!
                            <br />
                            Create your own library of books you want to share with others and manage your reservations!
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                            {!user ? (
                                <>
                                    <Link to="/login">
                                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25">
                                            Get Started
                                        </button>
                                    </Link>
                                    <Link to="/search">
                                        <button className="bg-gray-700 hover:bg-gray-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:shadow-lg border border-gray-600">
                                            Browse Books
                                        </button>
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link to="/mybooks">
                                        <button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25">
                                            My Library
                                        </button>
                                    </Link>
                                    <Link to="/search">
                                        <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:shadow-lg hover:shadow-green-500/25">
                                            Find Books
                                        </button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Why Choose My Books App?
                    </h2>
                    <p className="text-gray-400 text-lg">
                        Join our community of book lovers and start sharing today
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    {/* Feature 1 */}
                    <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 hover:border-blue-500 transition-all duration-300">
                        <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-6">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-4">Discover Books</h3>
                        <p className="text-gray-400">
                            Search through thousands of books and find your next great read from our community library.
                        </p>
                    </div>

                    {/* Feature 2 */}
                    <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 hover:border-purple-500 transition-all duration-300">
                        <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-6">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-4">Easy Reservations</h3>
                        <p className="text-gray-400">
                            Book your favorite titles with simple reservation system and flexible loan periods.
                        </p>
                    </div>

                    {/* Feature 3 */}
                    <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 hover:border-green-500 transition-all duration-300">
                        <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-6">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-4">Share & Connect</h3>
                        <p className="text-gray-400">
                            Build your lending library and connect with fellow book enthusiasts in your community.
                        </p>
                    </div>
                </div>
            </div>

            {/* Featured Books Section */}
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Featured Books
                    </h2>
                    <p className="text-gray-400 text-lg">
                        Popular titles currently available in our community
                    </p>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-16">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                        {featuredBooks.map((book) => (
                            <div key={book.id} className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300">
                                {book.coverUrl && (
                                    <div className="aspect-[3/4] overflow-hidden">
                                        <img 
                                            src={book.coverUrl} 
                                            alt={book.title}
                                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                )}
                                
                                <div className="p-6">
                                    <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                                        {book.title}
                                    </h3>
                                    
                                    <p className="text-sm text-gray-300 mb-3">
                                        by <span className="text-blue-400">{book.authors.join(', ')}</span>
                                    </p>
                                    
                                    <div className="flex items-center justify-between">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-900 text-green-300 border border-green-700">
                                            {book.availableCount} Available
                                        </span>
                                        
                                        <Link to={user ? "/search" : "/login"}>
                                            <button className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors duration-200">
                                                View Details →
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="text-center">
                    <Link to="/search">
                        <button className="bg-gray-700 hover:bg-gray-600 text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 border border-gray-600">
                            View All Books
                        </button>
                    </Link>
                </div>
            </div>

            {/* Stats Section */}
            <div className="bg-gray-800 border-y border-gray-700">
                <div className="max-w-7xl mx-auto px-6 py-16">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <div>
                            <div className="text-4xl font-bold text-blue-400 mb-2">1,200+</div>
                            <div className="text-gray-300">Books Available</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-purple-400 mb-2">350+</div>
                            <div className="text-gray-300">Active Users</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-green-400 mb-2">850+</div>
                            <div className="text-gray-300">Books Borrowed</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Homepage;