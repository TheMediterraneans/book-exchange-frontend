import { useState } from 'react'
import { Routes, Route } from "react-router-dom"
import Homepage from './pages/Homepage'
import Footer from './components/Footer'

import Navbar from './components/Navbar'
import PageNotFound from './pages/PageNotFound'
import AllBooks from './pages/AllBooks'


import SignupPage from './pages/SignupPage'
import LoginPage from './pages/LoginPage'
import UserBooksPage from './pages/UserBooksPage'
import ProtectedRoute from './components/ProtectedRoutes'
import { AuthProvider } from './contexts/AuthContext'

function App() {

  const createNewBookCopy = (newCopy) {
    
  }
  
  return (
    <AuthProvider>
      <Navbar/>
      
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/*" element={<PageNotFound/>} />
        <Route path="/all-books" element={<AllBooks/>} />
        <Route path="/signup" element={<SignupPage/>} />
        <Route path="/login" element={<LoginPage/>} />
        <Route path='/my-books' element={<UserBooksPage/>} />
        
      </Routes>

      <Footer />

      
    </AuthProvider>
  )
}

export default App
