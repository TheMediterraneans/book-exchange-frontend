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
import ReservationForm from './pages/ReservationForm'
import ProtectedRoute from './components/ProtectedRoutes'

function App() {
  
  return (
    <AuthProvider>
      
      <Navbar />

      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/*" element={<PageNotFound/>} />
        <Route path="/all-books" element={<AllBooks/>} />
        <Route path="/signup" element={<SignupPage/>} />
        <Route path="/login" element={<LoginPage/>} />
        <Route path='/mybooks' element={<UserBooksPage/>} />
        <Route path="/reserve" element={<ReservationForm/>} />
        
      </Routes>

      <Footer />

      
    </AuthProvider>
  )
}

export default App
