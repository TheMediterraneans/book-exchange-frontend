import { useState } from "react";
import SearchBooksToBorrow from "../components/SearchBooksToBorrow";

function Copies() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    console.log("Searching for:", searchQuery);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-6 z-50 font-['Sreda']">
          Find available copies to borrow...
        </h1>

        <SearchBooksToBorrow className="w-full" />
      </div>
    </div>
  );
}

export default Copies;
