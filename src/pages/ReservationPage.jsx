import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

function ReservationPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const { book, availableCopies } = location.state || {};  // get book and copies data passed from BookSearch

  const [selectedCopyId, setSelectedCopyId] = useState('');
  const [requestedDays, setRequestedDays] = useState(7);
  const [loading, setLoading] = useState(false);

  // redirect if no data was passed
  useEffect(() => {
    if (!book || !availableCopies) {
      navigate('/copies');
    }
  }, [book, availableCopies, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedCopyId) {
      alert('Please select a copy');
      return;
    }

    setLoading(true);

    const authToken = localStorage.getItem('authToken');  // get auth token from localStorage

    axios.post('http://localhost:5005/api/reservations', {
      bookCopyId: selectedCopyId,
      requestedDays: parseInt(requestedDays)
    }, {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    })
      .then(() => {
        alert('Reservation created successfully!');
        navigate('/mybooks'); // navigate to user's page to see new reservations
      })
      .catch((err) => {
        if (err.response) {
          if (err.response.status === 401) {
            alert('Error: Authentication failed. You may need to log in again.');
          } else {
            const errorMsg = err.response.data?.error || err.response.data?.message || 'Server error';
            alert('Error: ' + errorMsg);
          }
        } else {
          alert('Error: Could not connect to server.');
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (!book || !availableCopies) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Reserve Book</h1>

      <div>
        <h2>{book.title}</h2>
        <p><strong>Authors:</strong> {book.authors && book.authors.join(', ')}</p>
        {book.coverUrl && <img src={book.coverUrl} alt={book.title} width="100" />}
      </div>

      <form onSubmit={handleSubmit}>
        <div>
          <label>
            <strong>Select Copy:</strong>
            <br />
            <select
              value={selectedCopyId}
              onChange={(e) => setSelectedCopyId(e.target.value)}
              required
            >
              <option value="">Choose a copy...</option>
              {availableCopies.map((copy) => (
                <option key={copy._id} value={copy._id}>
                  Copy #{copy._id.slice(-6)}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div>
          <label>
            <strong>Loan Duration (days):</strong>
            <br />
            <input
              type="number"
              min="1"
              max="30"
              value={requestedDays}
              onChange={(e) => setRequestedDays(e.target.value)}
              required
            />
          </label>
          <small>Maximum 30 days</small>
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Confirm Reservation'}
          </button>

          <button
            type="button"
            onClick={() => navigate('/copies')}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default ReservationPage;
