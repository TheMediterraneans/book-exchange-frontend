import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function SearchBookToLend() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [copiesForBook, setCopiesForBook] = useState({});  // { externalId: [{BookCopy}] }
  const navigate = useNavigate();

  const doSearch = (e) => {
    e.preventDefault();

    setCopiesForBook({}); // clear previous results

    axios.get(`${import.meta.env.VITE_SERVER_URL}/api/search-books`, { params: { q: searchTerm } })
      .then((response) => {
        setResults(response.data);

        // fetch available copies for each book
        response.data.forEach((book) => {

          const externalId = book.key || book.id; // choose correct externalId for the book

          if (!externalId)
            return;
          axios.get(`${import.meta.env.VITE_SERVER_URL}/api/mybooks`, { params: { externalId: externalId } })
            .then((copyResponse) => {
              setCopiesForBook((prev) => {
                const newMap = { ...prev };
                newMap[externalId] = copyResponse.data; // array of BookCopy or empty array
                return newMap;
              });
            })
            .catch((error) => {
              console.error('Error fetching copies for book:', externalId, error);
              // set empty array for books with no copies or errors
              setCopiesForBook((prev) => {
                const newMap = { ...prev };
                newMap[externalId] = [];
                return newMap;
              });
            });
        });
      })
      .catch((error) => { console.error('Search error', error); });
  };

  const beginReserve = (book, copies) => {
    console.log('Navigating to reservation page with:', book, copies);
    navigate('/reservation', {
      state: {
        book: book,
        availableCopies: copies
      }
    });
  };

  const viewBookDetails = (book, copies) => {
    navigate('/book-detail', {
      state: { 
        book: book,
        fromDatabase: true,
        availableCopies: copies // pass copies info so BookDetailPage can determine actions
      }
    });
  };

  return (
    <div>
      <form onSubmit={doSearch}>
        <input
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); }}
          placeholder="Search for title, author, or ISBN"
        />
        <button type="submit">Search</button>
      </form>
      <hr />
      {results.map((book) => {

        const externalId = book.key || book.id;
        const copies = copiesForBook[externalId] || [];

        //console.log('Book:', book.title, 'externalId:', externalId, 'copies:', copies);

        return (
          <div key={externalId}>
            <strong>{book.title}</strong> — {book.authors && book.authors.join(', ')}
            {book.coverUrl && <img src={book.coverUrl} alt={book.title} width="60" />}
            <br />
            
            {/* Always show View Details button for every book */}
            <button onClick={() => viewBookDetails(book, copies)}>
              View Details
            </button>
            
            {/* Show copy count info */}
            <span style={{ marginLeft: '10px', color: '#666' }}>
              {copies.length > 0 ? `(${copies.length} copies available)` : '(No copies available)'}
            </span>
          </div>
        );
      })}

    </div>
  );
}

export default SearchBookToLend;
