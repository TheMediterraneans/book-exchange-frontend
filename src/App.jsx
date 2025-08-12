import { Routes, Route } from "react-router-dom"
import Homepage from './pages/Homepage'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import PageNotFound from './pages/PageNotFound'
import { AuthProvider } from './contexts/AuthContext'

import Copies from './pages/Copies'
import SignupPage from './pages/SignupPage'
import LoginPage from './pages/LoginPage'
import UserBooksPage from './pages/UserBooksPage'
import ReservationPage from './pages/ReservationPage'
import EditReservationPage from './pages/EditReservationPage'
import ProtectedRoute from './components/ProtectedRoutes'
import AddCopy from "./pages/AddCopy"
import BookDetailPage from './pages/BookDetailPage'

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
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/mybooks/${mybookId}`, {
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
        <Route path="/book-detail" element={<BookDetailPage />} />
        <Route path="/copies" element={<Copies/>} />
        <Route path="/signup" element={<SignupPage/>} />
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/mybooks" element={<ProtectedRoute><UserBooksPage onDelete={deleteCopy} /></ProtectedRoute>} />
        <Route path="/mybooks/:mybookId" element={<ProtectedRoute><UserBooksPage onDelete={deleteCopy} /></ProtectedRoute>} />
        <Route path="/reservation" element={<ProtectedRoute><ReservationPage/></ProtectedRoute>} />
        <Route path="/edit-reservation" element={<ProtectedRoute><EditReservationPage/></ProtectedRoute>} />
        <Route path="/mybooks/add" element={<ProtectedRoute><AddCopy /></ProtectedRoute>} />
        <Route path="/*" element={<PageNotFound />} />
      </Routes>
      <Footer />
    </AuthProvider>
  )
}

export default App