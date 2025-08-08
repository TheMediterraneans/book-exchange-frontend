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
    
    // update local state if there are books in the library
    // setMyBooks(prevBooks => [...prevBooks, newBookCopy]);
    
    return newBookCopy;
  } catch (error) {
    console.error("Error adding book copy:", error);
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
        <Route path="/mybooks" element={<UserBooksPage/>} />
        <Route path="/reserve" element={<ReservationPage/>} />
        <Route path="/mybooks/add" element={<AddCopy addBookCopy={addBookCopy} />} />
        
      </Routes>

      <Footer />


    </AuthProvider>
  )
}

export default App