import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

function SearchBookToLend() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [copiesForBook, setCopiesForBook] = useState({});  // { externalId: [{BookCopy}] }
  const navigate = useNavigate();

  const performSearch = useCallback((term) => {
    setCopiesForBook({}); // clear previous results

    axios.get(`${import.meta.env.VITE_SERVER_URL}/api/search-books`, { params: { q: term } })
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
  }, []);

  // Initialize search term from URL on component mount
  useEffect(() => {
    const urlSearchTerm = searchParams.get('q');
    if (urlSearchTerm) {
      setSearchTerm(urlSearchTerm);
      // Auto-run search if there's a search term in URL
      performSearch(urlSearchTerm);
    }
  }, [searchParams, performSearch]);

  const doSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      return;
    }
    
    // Update URL with search term
    setSearchParams({ q: searchTerm });
    // Perform the search
    performSearch(searchTerm);
  };

  const beginReserve = (book, copies) => {
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

        return (
          <div key={externalId}>
            <strong>{book.title}</strong> — {book.authors && book.authors.join(', ')}
            {book.coverUrl && <img src={book.coverUrl} alt={book.title} width="60" />}
            <br />
            
            <button onClick={() => viewBookDetails(book, copies)}>
              View Details
            </button>
            
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
