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
    return <div>Loading your books...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
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
    <div>
      <h1>Welcome to your books!</h1>
      
      <button 
        onClick={handleLogout}
        style={{
          backgroundColor: "#dc3545",
          color: "white",
          border: "none",
          padding: "8px 16px",
          borderRadius: "4px",
          cursor: "pointer",
          marginBottom: "20px"
        }}
      >
        Logout
      </button>
      
      {/* books content here */}
      <div>
        <h2>Your Books ({myBooks.length})</h2>
        
        <Link to="/mybooks/add">
          <button style={{
            backgroundColor: "purple",
            color: "white",
            border: "none",
            padding: "8px 16px",
            borderRadius: "4px",
            cursor: "pointer",
            marginBottom: "20px"
          }}>
            Add a new book to your library
          </button>
        </Link>

        {myBooks.length === 0 ? (
          <p>You don't have any books in your library yet. Add your first book!</p>
        ) : (
                     <div className="books-grid">
             {myBooks.map((book) => (
               <div key={book._id} className="book-card">
                 {book.coverUrl && (
                   <img 
                     src={book.coverUrl} 
                     alt={book.title}
                     className="book-cover"
                   />
                 )}
                 <div className="book-info">
                   <h3>{book.title}</h3>
                  
                    {book.authors && book.authors.length > 0 && (
                     <p className="book-authors">by {book.authors.join(', ')}</p>
                   )}
                    {book.publishedYear && (
                     <p className="book-year">Published: {book.publishedYear}</p>
                   )}
                   <p className="book-status">
                     <strong>Status:</strong> 
                     <span className={book.isAvailable ? "status-available" : "status-unavailable"}>
                       {book.isAvailable ? " Available" : " Not Available"}
                     </span>
                   </p>

                   <p>
                  <strong>Max Duration:</strong> {book.maxDuration || 14} days
                  </p>
                  {!book.isAvailable && book.reservation && (
                    <div className="reservation-info">
                      <p className="reservation-start">
                        <strong>Reserved from:</strong> {" "}
                        {new Date(book.reservation.startDate).toLocaleDateString()}
                      </p>
                      {book.reservation.endDate && (
                        <p className="reservation-end">
                          <strong>Until:</strong> {" "}
                          {new Date(book.reservation.endDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  )}
                 </div>
                 <button onClick={() => handleDelete(book._id)} 
                 style={{
                    backgroundColor: "#dc3545",
                    color: "white",
                    border: "none",
                    padding: "8px 16px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    marginTop: "10px"
                  }}>
                   Delete book from your library
                 </button>
               </div>
             ))}
           </div>
        )}
      </div>

      <section>
        <h2>Your Reservations</h2>
        
        {loading && <p>Loading reservations...</p>}
        
        {error && (
          <div style={{ color: 'red', padding: '10px', backgroundColor: '#fee' }}>
            {error}
          </div>
        )}
        
        {!loading && !error && reservations.length === 0 && (
          <p>You haven't made any reservations yet.</p>
        )}
        
        {!loading && !error && reservations.length > 0 && (
          <div>
            {reservations.map((reservation) => (
              <div key={reservation._id}>
                <h3>Book Copy ID: {reservation.book?._id?.slice(-6) || 'Unknown'}</h3>
                <p><strong>Start Date:</strong> {new Date(reservation.startDate).toLocaleDateString()}</p>
                <p><strong>End Date:</strong> {new Date(reservation.endDate).toLocaleDateString()}</p>
                <p><strong>Status:</strong> {
                  new Date() > new Date(reservation.endDate) ? 
                  'Overdue' : 
                  new Date() < new Date(reservation.startDate) ? 
                  'Upcoming' : 
                  'Active'
                }</p>
                
                {/* Display book copy details if available */}
                {reservation.book && (
                  <div>
                    <p><strong>Copy Details:</strong></p>
                    <p>ID: {reservation.book._id}</p>
                    {reservation.book.title && <p>Title: {reservation.book.title}</p>}
                    {reservation.book.externalId && <p>External ID: {reservation.book.externalId}</p>}
                    {reservation.book.condition && <p>Condition: {reservation.book.condition}</p>}
                    {reservation.book.location && <p>Location: {reservation.book.location}</p>}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default UserBooksPage;