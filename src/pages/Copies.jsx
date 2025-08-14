// Copies.jsx
import { useState } from "react";
import SearchBooksToBorrow from "../components/SearchBooksToBorrow";

function Copies() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    console.log("Searching for:", searchQuery);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <h1
        style={{
          marginLeft: "20px",
          fontFamily: "Sreda, serif",
          fontSize: "2rem",
          fontWeight: "bold",
        }}
      >
        Find available copies to borrow
      </h1>
      <p
        style={{
          marginLeft: "20px",
          fontFamily: "Sreda, serif",
          fontSize: "1rem",
        }}
      >
        Search through available book copies that other users have added to
        their lending libraries.
        <br />
        Find books you'd like to borrow and make a reservation request.
      </p>

      <div className="mt-6 max-w-4xl mx-auto">
        <SearchBooksToBorrow className="w-full" />
      </div>
    </div>
  );
}

export default Copies;
