import SearchBooksToBorrow from "../components/SearchBooksToBorrow";

function Copies() {
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Find Books to Borrow</h1>
      <p style={{ marginBottom: '20px', color: '#666' }}>
        Search through available book copies that other users have added to their lending libraries. 
        Find books you'd like to borrow and make a reservation request.
      </p>
      <SearchBooksToBorrow />
    </div>
  );
}

export default Copies;
