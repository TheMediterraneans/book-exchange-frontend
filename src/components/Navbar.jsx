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
    <nav className="bg-grey-900 border-b border-purple-700 text-white px-6 py-4 flex justify-between items-center">
      <div>
        <section className="main-title">
          <h1 className="cursor-pointer select-none text-4xl font-playfair tracking-wide" onClick={() => navigate("/")}>
            BookBros-just lend it! (this is a test name for fun :P)
          </h1>
        </section>
      </div>

      <div className="flex items-center space-x-6 text-sm md:text-base">
        {user ? (
          <>
            <span className="hidden sm:inline-block">Welcome, <span className="font-semibold">{user.name}</span>!</span>
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
              <span className="nav-button">Offer Books to Lend</span>

            </button>
            <button
              onClick={handleAddBooksClick}
              className="underline hover:text-purple-300 transition"
            >
              <span className="nav-button"> Add Books</span>
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
