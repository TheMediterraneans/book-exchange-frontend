import { Routes, Route } from "react-router-dom"
import Homepage from './pages/Homepage'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import PageNotFound from './pages/PageNotFound'
import { AuthProvider } from './contexts/AuthContext'
import AllBooks from './pages/AllBooks'
import SignupPage from './pages/SignupPage'
import LoginPage from './pages/LoginPage'
import UserBooksPage from './pages/UserBooksPage'
import ReservationPage from './pages/ReservationPage'
import ProtectedRoute from './components/ProtectedRoutes'
import AddCopy from "./pages/AddCopy"
// Remove the DeleteBookCopy import since it doesn't exist

function App() {
  
  const addBookCopy = async (bookCopyData) => {
    try {
      const storedToken = localStorage.getItem("authToken");
      
      console.log('Stored token:', storedToken);
      console.log('Book copy data being sent:', bookCopyData);
      
      if (!storedToken) {
        throw new Error("No authentication token found. Please log in again.");
      }
      
      const response = await fetch(`http://localhost:5005/api/mybooks/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${storedToken}`,
        },
        body: JSON.stringify(bookCopyData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add book to library");
      }
      
      const newBookCopy = await response.json();
      return newBookCopy;
    } catch (error) {
      console.error("Error adding book copy:", error);
      throw error;
    }
  };

  const deleteCopy = async (mybookId) => {
    try {
      const storedToken = localStorage.getItem("authToken");
      if (!storedToken) {
        throw new Error("No authentication token found. Please log in again.");
      }

      // Fix: Use the actual server URL, not the string literal
      const response = await fetch(`http://localhost:5005/api/mybooks/${mybookId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${storedToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete book copy");
      }

      return true;
    } catch (error) {
      console.error("Error deleting book copy:", error);
      throw error;
    }
  };

  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/*" element={<PageNotFound/>} />
        <Route path="/all-books" element={<AllBooks/>} />
        <Route path="/signup" element={<SignupPage/>} />
        <Route path="/login" element={<LoginPage/>} />
        {/* Fix: Pass deleteCopy to the main mybooks route */}
        <Route path="/mybooks" element={<ProtectedRoute><UserBooksPage onDelete={deleteCopy} /></ProtectedRoute>} />
        <Route path="/mybooks/:mybookId" element={<ProtectedRoute><UserBooksPage onDelete={deleteCopy} /></ProtectedRoute>} />
        <Route path="/reserve" element={<ProtectedRoute><ReservationPage/></ProtectedRoute>} />
        <Route path="/mybooks/add" element={<ProtectedRoute><AddCopy addBookCopy={addBookCopy} /></ProtectedRoute>} />
      </Routes>
      <Footer />
    </AuthProvider>
  )
}

export default App