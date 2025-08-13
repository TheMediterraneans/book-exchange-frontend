import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

function EditReservationPage() {
    const location = useLocation();
    const navigate = useNavigate();

    const { reservation } = location.state || {};  // get reservation data

    const [requestedDays, setRequestedDays] = useState(7);
    const [loading, setLoading] = useState(false);

    // redirect if no data was passed
    useEffect(() => {
        if (!reservation) {
            navigate('/mybooks');
        } else {
            // Calculate current duration from the reservation dates
            const currentDuration = Math.ceil(
                (new Date(reservation.endDate) - new Date(reservation.startDate)) / (1000 * 60 * 60 * 24)
            );
            setRequestedDays(currentDuration);
        }
    }, [reservation, navigate]);

    const handleSubmit = (e) => {
        e.preventDefault();

        setLoading(true);

        const authToken = localStorage.getItem('authToken');  // get auth token from localStorage

        // Calculate new end date based on start date and new duration
        const newEndDate = new Date(reservation.startDate);
        newEndDate.setDate(newEndDate.getDate() + parseInt(requestedDays));

        axios.put(`${import.meta.env.VITE_SERVER_URL}/api/reservations/${reservation._id}`, {
            requestedDays: parseInt(requestedDays),
            endDate: newEndDate.toISOString()
        }, {
            headers: {
                Authorization: `Bearer ${authToken}`
            }
        })
            .then(() => {
                alert('Reservation updated successfully!');
                navigate('/mybooks'); // navigate back to user's books page
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

    if (!reservation) {
        return <div>Loading...</div>;
    }

    // Calculate max allowed duration from the book copy
    const maxAllowedDays = reservation.book?.maxDuration || 30;

    // Calculate current status
    const currentDate = new Date();
    const startDate = new Date(reservation.startDate);
    const endDate = new Date(reservation.endDate);
    const status = currentDate > endDate ? 'Overdue' :
        currentDate < startDate ? 'Upcoming' : 'Active';

    return (
        <div>
            <h1>Edit Reservation</h1>

            <div>
                <h2>{reservation.book?.title || `Book Copy #${reservation.book?._id?.slice(-6)}`}</h2>
                {reservation.book?.authors && reservation.book.authors.length > 0 && (
                    <p><strong>Authors:</strong> {reservation.book.authors.join(', ')}</p>
                )}
                {reservation.book?.coverUrl && (
                    <img src={reservation.book.coverUrl} alt={reservation.book.title} width="100" />
                )}

                <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #ccc', borderRadius: '5px' }}>
                    <h3>Reservation Details</h3>
                    <p><strong>Owner:</strong> {reservation.book?.owner?.name || reservation.book?.owner?.email || 'Owner info not available'}</p>
                    {reservation.book?.owner?.email && reservation.book?.owner?.name && (
                        <p><strong>Owner Email:</strong> {reservation.book.owner.email}</p>
                    )}
                    <p><strong>Start Date:</strong> {new Date(reservation.startDate).toLocaleDateString()}</p>
                    <p><strong>Current End Date:</strong> {new Date(reservation.endDate).toLocaleDateString()}</p>
                    <p><strong>Status:</strong>
                        <span style={{
                            color: status === 'Overdue' ? '#dc3545' :
                                status === 'Active' ? '#28a745' : '#ffc107',
                            fontWeight: 'bold',
                            marginLeft: '5px'
                        }}>
                            {status}
                        </span>
                    </p>
                    <p><strong>Maximum Allowed Duration:</strong> {maxAllowedDays} days</p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div style={{ marginTop: '20px' }}>
                    <label>
                        <strong>New Loan Duration (days):</strong>
                        <br />
                        <input
                            type="number"
                            min="1"
                            max={maxAllowedDays}
                            value={requestedDays}
                            onChange={(e) => setRequestedDays(e.target.value)}
                            required
                            style={{
                                padding: '8px',
                                marginTop: '5px',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                width: '100px'
                            }}
                        />
                    </label>
                    <div style={{ marginTop: '5px' }}>
                        <small>Current: {Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))} days | Maximum: {maxAllowedDays} days</small>
                    </div>
                    {requestedDays && (
                        <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                            <strong>New end date will be:</strong> {
                                (() => {
                                    const newEnd = new Date(reservation.startDate);
                                    newEnd.setDate(newEnd.getDate() + parseInt(requestedDays));
                                    return newEnd.toLocaleDateString();
                                })()
                            }
                        </div>
                    )}
                </div>

                <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            backgroundColor: '#28a745',
                            color: 'white',
                            border: 'none',
                            padding: '10px 20px',
                            borderRadius: '4px',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            opacity: loading ? 0.6 : 1
                        }}
                    >
                        {loading ? 'Updating...' : 'Update Reservation'}
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate('/mybooks')}
                        style={{
                            backgroundColor: '#6c757d',
                            color: 'white',
                            border: 'none',
                            padding: '10px 20px',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

export default EditReservationPage;
