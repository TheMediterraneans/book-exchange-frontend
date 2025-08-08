import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";

function UserBooksPage() {
  const { user, logout } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user's reservations when component mounts
  useEffect(() => {
    const fetchReservations = () => {
      const authToken = localStorage.getItem('authToken');
      
      if (!authToken) {
        setError('No authentication token found');
        setLoading(false);
        return;
      }

      axios.get('http://localhost:5005/api/reservations', {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      })
      .then((response) => {
        console.log('Reservations fetched:', response.data);
        setReservations(response.data);
        setError(null);
      })
      .catch((error) => {
        console.error('Error fetching reservations:', error);
        if (err.response?.status === 401) {
          setError('Authentication failed. Please log in again.');
        } else {
          setError('Failed to load reservations.');
        }
      })
      .finally(() => {
        setLoading(false);
      });
    };

    // Only fetch if user is available
    if (user) {
      fetchReservations();
    }
  }, [user]);


  return (
    <div>
      {/* Your books content here */}
      <div>
        <h2>Your Books</h2>
        <p>Here will be your books...</p>
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