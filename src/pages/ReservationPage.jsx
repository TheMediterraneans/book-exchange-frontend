import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function ReservationPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const { book, selectedCopy } = location.state || {}; // get book and selected copy data

  const [requestedDays, setRequestedDays] = useState(7);
  const [loading, setLoading] = useState(false);
  //const [isAvailable, setIsAvailable] = useState(true)

  // redirect if no data was passed
  useEffect(() => {
    if (!book || !selectedCopy) {
      navigate("/copies");
    }
  }, [book, selectedCopy, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    setLoading(true);

    const authToken = localStorage.getItem("authToken"); // get auth token from localStorage

    axios
      .post(
        `${import.meta.env.VITE_SERVER_URL}/api/reservations`,
        {
          bookCopyId: selectedCopy._id,
          requestedDays: parseInt(requestedDays),
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      )
      .then(() => {
        alert("Reservation created successfully!");
        navigate("/mybooks"); // navigate to user's books page to see reservations
      })
      .catch((err) => {
        if (err.response) {
          if (err.response.status === 401) {
            alert(
              "Error: Authentication failed. You may need to log in again."
            );
          } else {
            const errorMsg =
              err.response.data?.error ||
              err.response.data?.message ||
              "Server error";
            alert("Error: " + errorMsg);
          }
        } else {
          alert("Error: Could not connect to server.");
        }
      })
      .finally(() => {
        setLoading(false);
        //setIsAvailable(false)
      });
  };

  const goBack = () => {
    // go back in history to return to search results with preserved state
    navigate(-1);
  };

  if (!book || !selectedCopy) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 style={{
            fontFamily: "Sreda, serif",
            fontSize: "2rem", // ingrandisce il testo
            fontWeight: "bold",
            margin: 10
          }}>Reserve Book</h1>
      
      <button 
        onClick={goBack}
        style={{
          marginBottom: '20px',
          padding: '10px 20px',
          backgroundColor: '#f84404',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: '500'
        }}
      >
        ← Back to Search
      </button>

      <div>
        <h2
          style={{
            fontFamily: "Sreda, serif",
            fontSize: "1.5rem", // ingrandisce il testo
            fontWeight: "bold",
            margin: 10
          }}
        >
          {book.title}
        </h2>
        <p>
          <strong style={{
            margin: "10px"
          }}>Authors:</strong> {book.authors && book.authors.join(", ")}
        </p>
        <section style={{margin: "20px"}}>
        {book.coverUrl && (
          <img src={book.coverUrl} alt={book.title} width="100" />
        )}
        </section>

        <div
          style={{
            marginTop: "20px",
            marginLeft: '10px',
            padding: "15px",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        >
          <h3 style={{
            fontFamily: "Sreda, serif",
            fontSize: "1rem", // ingrandisce il testo
            fontWeight: "bold",
            
          }}>Copy Details</h3>
          <p>
            <strong>Owner:</strong> {selectedCopy.owner.name}
          </p>
          <p>
            <strong>Owner Email:</strong> {selectedCopy.owner.email}
          </p>
          <p>
            <strong>Maximum Duration:</strong> {selectedCopy.maxDuration} days
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div>
          <label>
            <strong style={{
            fontFamily: "Sreda, serif",
            fontSize: "1rem", // ingrandisce il testo
            fontWeight: "bold",
            margin: 10
          }}>Loan Duration (days):</strong>
            <br />
            <input
              type="number"
              min="1"
              max={selectedCopy.maxDuration}
              value={requestedDays}
              onChange={(e) => setRequestedDays(e.target.value)}
              required
              style={{
                    padding: "8px 12px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    fontSize: "14px",
                    width: "100px",
                    marginLeft: "10px"}}
            />
          </label>
          <small style={{marginLeft: "20"}}>Maximum {selectedCopy.maxDuration} days (set by owner)</small>
        </div>

        <div>
          <button style={{
                          backgroundColor: "ivory",
                          color: "#6854cc",
                          border: "3px solid #6854cc",
                          padding: "8px 16px",
                          borderRadius: "4px",
                          cursor: "pointer",
                          flex: 1,
                          marginLeft: "20px"
                        }}
                        type="submit" disabled={loading}>
            {loading ? "Creating..." : "Confirm Reservation"}
          </button>

          <button style={{
                    backgroundColor: "ivory",
                    color: "rgb(214, 49, 83, 1)",
                    border: "3px solid rgb(214, 49, 83, 1)",
                    padding: "8px 16px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    marginTop: "10px",
                    marginLeft: "20px"
                  }} type="button" onClick={() => navigate("/copies")}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default ReservationPage;
