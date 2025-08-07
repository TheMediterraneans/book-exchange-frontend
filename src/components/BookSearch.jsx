import { useState } from 'react';
import axios from 'axios';

function BookSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [copiesForBook, setCopiesForBook] = useState({});  // { externalId: [{BookCopy}] }
  const [selectedCopy, setSelectedCopy] = useState(null);
  const [pickupDate, setPickupDate] = useState('');

  const doSearch = (e) => {
    e.preventDefault();

    setCopiesForBook({}); // clear previous results

    axios.get('http://localhost:5005/api/search-books', { params: { q: searchTerm } })
      .then((response) => {
        setResults(response.data);

        // fetch available copies for each book
        response.data.forEach((book) => {
          // choose correct externalId for the book:
          const externalId = book.key || book.id;
          if (!externalId)
            return;
          axios.get('http://localhost:5005/api/mybooks', { params: { externalId: externalId } })
            .then((copyResponse) => {
              setCopiesForBook((prev) => {
                const newMap = { ...prev };
                newMap[externalId] = copyResponse.data; // array of BookCopy or []
                return newMap;
              });
            })
            .catch((err) => {
              console.error('Error fetching copies for book:', externalId, err);
              // set empty array for books with no copies or errors
              setCopiesForBook((prev) => {
                const newMap = { ...prev };
                newMap[externalId] = [];
                return newMap;
              });
            });
        });
      })
      .catch((err) => { console.error('Search error', err); });
  };

  const beginReserve = (copy) => {
    setSelectedCopy(copy);
    setPickupDate('');
  };

  const submitReserve = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5005/api/reservations', {
      bookCopyId: selectedCopy._id,
      externalId: selectedCopy.externalId,
      pickupDate: pickupDate,
    })
      .then(() => {
        alert('Reservation created!');
        setSelectedCopy(null);
      })
      .catch((err) => { console.error('Reserve error', err); });
  };

  return (
    <div>
      <form onSubmit={doSearch}>
        <input
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); }}
          placeholder="Search for a book..."
        />
        <button type="submit">Search</button>
      </form>
      <hr />
      {results.map((b) => {
        const externalId = b.key || b.id;
        const copies = copiesForBook[externalId] || [];

        //console.log('Book:', b.title, 'externalId:', externalId, 'copies:', copies);

        return (
          <div key={externalId}>
            <strong>{b.title}</strong> — {b.authors && b.authors.join(', ')}
            {b.coverUrl && <img src={b.coverUrl} alt={b.title} width="60" />}
            <br />
            {copies.length > 0 ? (
              <span>
                <button style={{ backgroundColor: '#007bff',color: '#fff'}} onClick={() => { beginReserve(copies[0]); }} >
                  Reserve
                </button>
                <span>{copies.length} available</span>
              </span>
            ) : (
              <span>No copies in library</span>
            )}
          </div>
        );
      })}
      {selectedCopy && (
        <form onSubmit={submitReserve}>
          <h3>Reserve: {selectedCopy.title}</h3>
          <label>Pickup date:
            <input type="date" value={pickupDate} onChange={(e) => { setPickupDate(e.target.value); }} required />
          </label>
          <button type="submit">Confirm Reservation</button>
          <button type="button" onClick={() => { setSelectedCopy(null); }}>Cancel</button>
        </form>
      )}
    </div>
  );
}

export default BookSearch;
