import BookSearch from '../components/BookSearch';

function AllBooks() {
  return (
    <div>
      <h1>Search for books to borrow...</h1>
      <p>
        Use the search bar below to look for books and find out if there are available copies to reserve. 
        {/* <br />You can later view your reservations in your profile. */}
      </p>
      <BookSearch />
    </div>
  );
}

export default AllBooks;
