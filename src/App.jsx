import { useState } from 'react'
import { Routes, Route } from "react-router-dom"
import Homepage from './pages/Homepage'
import Footer from './components/Footer'

import Navbar from './components/Navbar'
import BookDetailPage from './pages/BookDetailPage'
import BooksList from './pages/BooksList'
import PageNotFound from './pages/PageNotFound'

import './App.css'
import SignupPage from './pages/SignupPage'
import LoginPage from './pages/LoginPage'

function App() {
  
  return (
    <>
      
      <h1>Book Exchange App</h1>


      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/*" element={<PageNotFound/>} />
        <Route path="/signup" element={<SignupPage/>} />
        <Route path="/login" element={<LoginPage/>} />
        
      </Routes>


      
    </>
  )
}

export default App
