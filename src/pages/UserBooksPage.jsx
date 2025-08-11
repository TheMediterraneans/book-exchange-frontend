import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import "./UserBooksPage.css";


function UserBooksPage(props) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [myBooks, setMyBooks] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reservationsLoading, setReservationsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reservationsError, setReservationsError] = useState(null);

  const { onDelete } = props;

  // Fetch user's books when component mounts
  useEffect(() => {
    fetchMyBooks();
    fetchReservations();
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

  const fetchReservations = async () => {
    try {
      const storedToken = localStorage.getItem("authToken");

      if (!storedToken) {
        throw new Error("No authentication token found");
      }

      const response = await fetch("http://localhost:5005/api/reservations", {
        headers: {
          "Authorization": `Bearer ${storedToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch reservations");
      }

      const userReservations = await response.json();
      setReservations(userReservations);
    } catch (error) {
      console.error("Error fetching reservations:", error);
      setReservationsError(error.message);
    } finally {
      setReservationsLoading(false);
    }
  };

  const handleLogout = () => {
    logout(); // automatically redirect due to ProtectedRoute
  };

  if (isLoading) {
    console.log("UserBooksPage: Loading books...");
    return <div>Loading your books...</div>;
  }

  if (error) {
    console.log("UserBooksPage: Error loading books:", error);
    return <div>Error: {error}</div>;
  }

  const handleDeleteReservation = async (reservationId) => {
    try {
      const storedToken = localStorage.getItem("authToken");

      if (!storedToken) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(`http://localhost:5005/api/reservations/${reservationId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${storedToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to cancel reservation");
      }

      // Remove the reservation from the state
      setReservations(prevReservations =>
        prevReservations.filter(reservation => reservation._id !== reservationId)
      );

      alert("Reservation cancelled successfully!");

    } catch (error) {
      console.error("Error cancelling reservation:", error);
      alert(`Error: ${error.message}`);
    }
  };

  const handleEditReservation = (reservation) => {
    navigate('/edit-reservation', {
      state: { reservation }
    });
  };

  const handleDelete = async (bookId) => {
    try {
      await onDelete(bookId);
      setMyBooks(prevBooks => prevBooks.filter(book => book._id !== bookId));
    } catch (error) {
      setError(error.message || "Failed to delete book from the library")
    }



  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Welcome to your books!</h1>

      {/* Your books content here */}
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
                <span><h3>{book.title}</h3></span>
                <div className="book-info">


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

                  {/* Removed Max Duration display as requested */}
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

        {reservationsLoading && <p>Loading reservations...</p>}

        {reservationsError && (
          <div style={{ color: 'red', padding: '10px', backgroundColor: '#fee' }}>
            {reservationsError}
          </div>
        )}

        {!reservationsLoading && !reservationsError && reservations.length === 0 && (
          <p>You haven't made any reservations yet.</p>
        )}

        {!reservationsLoading && !reservationsError && reservations.length > 0 && (
          <div className="books-grid">
            {reservations.map((reservation) => {
              const status = new Date() > new Date(reservation.endDate) ?
                'Overdue' :
                new Date() < new Date(reservation.startDate) ?
                  'Upcoming' :
                  'Active';

              const statusClass = status === 'Overdue' ? 'status-unavailable' :
                status === 'Active' ? 'status-available' :
                  'status-pending';

              return (
                <div key={reservation._id} className="book-card">
                  <div className="book-info">
                    {/* Show book cover if available */}
                    {reservation.book?.coverUrl && (
                      <img
                        src={reservation.book.coverUrl}
                        alt={reservation.book.title || 'Book cover'}
                        className="book-cover"
                      />
                    )}

                    <h3 className="book-title">
                      {reservation.book?.title || `Reserved Book Copy #${reservation.book?._id?.slice(-6) || 'Unknown'}`}
                    </h3>

                    {reservation.book?.authors && reservation.book.authors.length > 0 && (
                      <p className="book-authors">
                        <strong>Authors:</strong> {reservation.book.authors.join(', ')}
                      </p>
                    )}

                    <p className="book-status">
                      <strong>Reservation Status:</strong>
                      <span className={statusClass}>
                        {' '}{status}
                      </span>
                    </p>

                    <p className="reservation-dates">
                      <strong>From:</strong> {new Date(reservation.startDate).toLocaleDateString()}
                      <br />
                      <strong>Until:</strong> {new Date(reservation.endDate).toLocaleDateString()}
                    </p>

                    {/* Show duration */}
                    <p className="reservation-duration">
                      <strong>Duration:</strong> {
                        Math.ceil((new Date(reservation.endDate) - new Date(reservation.startDate)) / (1000 * 60 * 60 * 24))
                      } days
                    </p>

                    {/* Show book copy owner info */}
                    {reservation.book?.owner ? (
                      <p className="book-owner">
                        <strong>Owner:</strong> {reservation.book.owner.name || reservation.book.owner.email || 'Unknown'}
                      </p>
                    ) : (
                      <p className="book-owner">
                        <strong>Owner:</strong> <span style={{ fontStyle: 'italic', color: '#666' }}>Owner info not available</span>
                      </p>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <button
                      onClick={() => handleEditReservation(reservation)}
                      style={{
                        backgroundColor: "#007bff",
                        color: "white",
                        border: "none",
                        padding: "8px 16px",
                        borderRadius: "4px",
                        cursor: "pointer",
                        flex: 1
                      }}
                    >
                      Edit Reservation
                    </button>

                    <button
                      onClick={() => handleDeleteReservation(reservation._id)}
                      style={{
                        backgroundColor: "#dc3545",
                        color: "white",
                        border: "none",
                        padding: "8px 16px",
                        borderRadius: "4px",
                        cursor: "pointer",
                        flex: 1
                      }}
                    >
                      Cancel Reservation
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

export default UserBooksPage;