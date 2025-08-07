import { useState } from 'react'
import { Routes, Route } from "react-router-dom"
import Homepage from './pages/Homepage'
import Footer from './components/Footer'

import Navbar from './components/Navbar'
import BookDetailPage from './pages/BookDetailPage'

import PageNotFound from './pages/PageNotFound'


import SignupPage from './pages/SignupPage'
import LoginPage from './pages/LoginPage'
import UserBooksPage from './pages/UserBooksPage'

function App() {
  
  return (
    <>
      
      <h1>Book Exchange App</h1>


      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/*" element={<PageNotFound/>} />
        <Route path="/signup" element={<SignupPage/>} />
        <Route path="/login" element={<LoginPage/>} />
        <Route path='/mybooks' element={<UserBooksPage/>} />
        
      </Routes>


      
    </>
  )
}

export default App
