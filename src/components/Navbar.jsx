import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function Navbar() {
  const navigate = useNavigate();
  const { user, logout, loading } = useAuth();

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      logout();
      navigate("/login");
    }
  };

  const handleAddBooksClick = () => {
    if (user) {
      navigate("/mybooks/add");
    } else {
      const confirmLogin = window.confirm("You need to be logged in to add books. Would you like to go to the login page?");
      if (confirmLogin) {
        navigate("/login");
      }
    }
  };

  if (loading) {
    return <div className="text-white p-4">Loading...</div>;
  }

  return (
    
  <nav className="z-50 font-['Sreda'] bg-indigo-500 border-b border-purple-700 text-white px-6 py-4 flex justify-between items-center"> {/*font-['Lato','Helvetica_Neue',Helvetica,Arial,sans-serif] text-3xl , font-['Sreda']*/}
  
    <div>
      <section className="main-title">
        <div className="flex items-center gap-3 cursor-pointer select-none" onClick={() => navigate("/")}>
          <img 
            src="/book-logo.png" 
            alt="Books Inc Logo" 
            className="w-8 h-8 md:w-10 md:h-10"
          />
          <h1 className="text-4xl font-bold tracking-wide">
            Books.Inc
          </h1>
        </div>
      </section>
    </div>

    <div className="flex items-center space-x-6 text-sm md:text-base">
      {user ? (
        <>
          <span className="hidden sm:inline-block">Welcome, <span className="font-bold">{user.name}</span>!</span>
          <button
            onClick={() => navigate("/copies")}
            className="hover:text-purple-300 transition"
          >
            Borrow Books
          </button>
          <button
            onClick={() => navigate("/mybooks/add")}
            className="hover:text-purple-300 transition"
          >
            Lend Books
          </button>
          <button
            onClick={() => navigate("/mybooks")}
            className="hover:text-purple-300 transition"
          >
            My Books
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded-md transition"
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <button
            onClick={() => navigate("/copies")}
            className="hover:text-purple-300 transition"
          >
            <span className="nav-button">Borrow Books</span>
          </button>
          <button
            onClick={handleAddBooksClick}
            className="hover:text-purple-300 transition"
          >
            <span className="nav-button">Lend Books</span>
          </button>
          <button
            onClick={() => navigate("/login")}
            className="hover:text-purple-300 transition"
          >
            <span className="nav-button"> Login</span>
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="hover:text-purple-300 transition"
          >
            <span className="nav-button">Sign Up</span>
          </button>
        </>
      )}
    </div>
  </nav>
);
}

export default Navbar;
