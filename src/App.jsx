import { useState } from 'react'
import { Routes, Route } from "react-router-dom"
import Homepage from './pages/Homepage'
import Footer from './components/Footer'
import SearchResult from './components/SearchResult'
import Navbar from './components/Navbar'
import BookDetailPage from './pages/BookDetailPage'

import './App.css'

function App() {
  
  return (
    <>
      
      <h1>Book Exchange App</h1>


      <Routes>
        <Route path="/" element={<Homepage />} />
      </Routes>


      
    </>
  )
}

export default App
