import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import "./UserBooksPage.css";


function UserBooksPage(props) {
  const { user, logout } = useAuth();
  const [myBooks, setMyBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const {onDelete} = props;

  // Fetch user's books when component mounts
  useEffect(() => {
    fetchMyBooks();
  }, []);

  const fetchMyBooks = async () => {
    try {
      const storedToken = localStorage.getItem("authToken");
      
      if (!storedToken) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/mybooks/`, {
        headers: {
          "Authorization": `Bearer ${storedToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch books");
      }

      const books = await response.json();
      setMyBooks(books);
    } catch (error) {
      console.error("Error fetching books:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout(); // automatically redirect due to ProtectedRoute
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-xl text-teal-400">Loading your books...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-red-400 text-xl">Error: {error}</div>
      </div>
    );
  }

   const handleDelete = async (bookId) => {
    try {
      await onDelete(bookId);
      setMyBooks(prevBooks => prevBooks.filter(book => book._id !== bookId));
    } catch (error) {
      setError(error.message || "Failed to delete book from the library")
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-white mb-6">Welcome to your Library</h1>
          
          <button 
            onClick={handleLogout}
            className="bg-red-700 hover:bg-red-800 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 mb-8"
          >
            Logout
          </button>
        </div>
        
        {/* Books Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-semibold text-white">
              Your Books <span className="text-teal-400">({myBooks.length})</span>
            </h2>
            
            <Link to="/mybooks/add">
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200">
                + Add New Book
              </button>
            </Link>
          </div>

          {myBooks.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📚</div>
              <p className="text-xl text-gray-300 mb-4">Your library is empty</p>
              <p className="text-gray-500">Start building your collection by adding your first book!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {myBooks.map((book) => (
                <div key={book._id} className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden hover:border-teal-500 transition-all duration-300 hover:shadow-2xl hover:shadow-teal-500/20">
                  {/* Book Cover */}
                  {book.coverUrl && (
                    <div className="aspect-[3/4] overflow-hidden">
                      <img 
                        src={book.coverUrl} 
                        alt={book.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  
                  {/* Book Info */}
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-white mb-3 line-clamp-2">{book.title}</h3>
                    
                    {book.authors && book.authors.length > 0 && (
                      <p className="text-sm text-gray-300 mb-2">
                        by <span className="text-teal-400">{book.authors.join(', ')}</span>
                      </p>
                    )}
                    
                    {book.publishedYear && (
                      <p className="text-sm text-gray-400 mb-3">
                        Published: <span className="text-purple-400">{book.publishedYear}</span>
                      </p>
                    )}
                    
                    {/* Status Badge */}
                    <div className="mb-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        book.isAvailable 
                          ? 'bg-green-900 text-green-300 border border-green-700' 
                          : 'bg-red-900 text-red-300 border border-red-700'
                      }`}>
                        {book.isAvailable ? '✓ Available' : '✗ Not Available'}
                      </span>
                    </div>

                    {/* Reservation Info */}
                    {!book.isAvailable && book.reservation && (
                      <div className="mb-4 p-3 bg-gray-800 rounded-lg border border-gray-700">
                        <p className="text-xs text-gray-300 mb-1">
                          <span className="text-purple-400">Reserved from:</span> {new Date(book.reservation.startDate).toLocaleDateString()}
                        </p>
                        {book.reservation.endDate && (
                          <p className="text-xs text-gray-300">
                            <span className="text-purple-400">Until:</span> {new Date(book.reservation.endDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    )}
                    
                    {/* Delete Button */}
                    <button 
                      onClick={() => handleDelete(book._id)} 
                      className="w-full bg-red-700 hover:bg-red-800 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200 mt-4"
                    >
                      Delete Book
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div><h1>Your reservations</h1></div>
    </div>
  );
}

export default UserBooksPage;