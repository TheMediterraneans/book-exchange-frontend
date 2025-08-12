import SearchBooksToBorrow from "../components/SearchBooksToBorrow";

function Copies() {
    return (
        <div>
            <h1>Find available copies to borrow</h1>
            <p>
                Search through available book copies that other users have added to their lending libraries.
                <br />Find books you'd like to borrow and make a reservation request.
            </p>
            <SearchBooksToBorrow />
        </div>
    );
}

export default Copies;
