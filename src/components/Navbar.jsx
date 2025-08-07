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

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <nav style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "1rem",
      backgroundColor: "#f8f9fa",
      borderBottom: "1px solid #dee2e6"
    }}>
      <div>
        <h2>My Books App</h2>
      </div>
      
      <div>
        {user ? (
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <span>Welcome, {user.name}!</span>
            <a href="/mybooks">My Books</a>
            <button 
              onClick={handleLogout}
              style={{
                backgroundColor: "#dc3545",
                color: "white",
                border: "none",
                padding: "8px 16px",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              Logout
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", gap: "1rem" }}>
            <a href="/login">Login</a>
            <a href="/signup">Sign Up</a>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;