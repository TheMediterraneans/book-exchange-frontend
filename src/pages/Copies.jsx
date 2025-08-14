import { useState } from "react";
import SearchBooksToBorrow from "../components/SearchBooksToBorrow";

function Copies() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    // Add your search logic here
    console.log("Searching for:", searchQuery);
  };

  return (
    <div>
      <h1 style={{ marginLeft: "20px", fontFamily: "Sreda, sans-serif" }}>
        Find available copies to borrow
      </h1>
      <p style={{ marginLeft: "20px", fontFamily: "Sreda, sans-serif" }}>
        Search through available book copies that other users have added to
        their lending libraries.
        <br />
        Find books you'd like to borrow and make a reservation request.
      </p>

      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 max-w-4xl mx-auto mt-6">
        {/* Book Search Section */}
        <div className="mb-4">
          <label
            htmlFor="book-search"
            className="block text-sm text-gray-300 mb-2"
          >
            Search for a book
          </label>
          <div className="flex gap-3">
            <SearchBooksToBorrow />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Copies;
