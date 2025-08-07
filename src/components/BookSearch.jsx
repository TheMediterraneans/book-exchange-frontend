import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function BookSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [copiesForBook, setCopiesForBook] = useState({});  // { externalId: [{BookCopy}] }
  const navigate = useNavigate();

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

  const beginReserve = (book, copies) => {
    console.log('Navigating to reservation page with:', book, copies);
    navigate('/reserve', { 
      state: { 
        book: book, 
        availableCopies: copies 
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
    
    {/* Only show button if copies exist AND user is authenticated */}
    {copies.length > 0 && !!localStorage.getItem('authToken') ? (
      <span>
        <button
          onClick={() => {
            console.log('Reserve button clicked!', book.title, copies);
            beginReserve(book, copies);
          }}
        >
          Reserve this book
        </button>
        <span> ({copies.length} available)</span>
      </span>
    ) : copies.length > 0 ? (
      <span>
        <button onClick={() => alert('You need to be logged in to reserve a book')}>
          Login to Reserve
        </button>
        <span> ({copies.length} available)</span>
      </span>
    ) : (
      <span>No copies available</span>
    )}
  </div>
        );
      })}
      
    </div>
  );
}

export default BookSearch;
