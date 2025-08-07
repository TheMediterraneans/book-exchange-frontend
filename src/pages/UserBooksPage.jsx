import { useAuth } from "../contexts/AuthContext";

function UserBooksPage() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    // Will automatically redirect due to ProtectedRoute
  };

  return (
    <div>
      <h1>Welcome to your books!</h1>
      <p>Email: {user.email}</p>
      
      <button 
        onClick={handleLogout}
        style={{
          backgroundColor: "#dc3545",
          color: "white",
          border: "none",
          padding: "8px 16px",
          borderRadius: "4px",
          cursor: "pointer",
          marginBottom: "20px"
        }}
      >
        Logout
      </button>
      
      {/* Your books content here */}
      <div>
        <h2>Your Books</h2>
        <p>Here will be your books...</p>
      </div>
    </div>
  );
}

export default UserBooksPage;