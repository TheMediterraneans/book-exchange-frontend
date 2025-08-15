# 📚 Books.Inc. - a book exchange platform

Connecting book lovers through sharing and borrowing! 📖✨

## Description

Books.Inc. is a web application that creates a community-driven book exchange platform. Users can add books to their personal lending library, discover available books from other readers, and reserve books for borrowing.

This application is meant to showcase our love for sharing knowledge and building connections through books!

## Technologies Used

- **Frontend**: React
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Build Tool**: Vite

## Features

- Browse a collection of books available for borrowing offered by the community
- Search for books by title, author, or ISBN with real-time results
- Add your own books to lend to other users with custom loan durations
- Reserve books from other users and manage your borrowing requests
- User authentication system with secure login and registration


## Installation & Setup

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Steps to Run Locally

1. **Clone the repository**
```bash
git clone https://github.com/TheMediterraneans/book-exchange-frontend.git
cd book-exchange-frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Configuration**
Create a `.env` file in the root directory and add:
```env
VITE_SERVER_URL=http://localhost:5005
```
*(Replace with your backend server URL if you prefer a different one)*

4. **Run the application**
```bash
npm run dev
```

5. **Open your browser**
Navigate to `http://localhost:5173` (or the different port shown in your terminal)

## Demo

🌐 **Live Demo**: https://books-inc.netlify.app/

## Future Improvements

- **Advanced search**: Filtering by genre, publication year, and rating
- **Geographic search**: Find books available nearby or at specific locations
- **Enriched book information**: Retrieve richer book details, allow users to provide information themselves
- **User interactions**: Users can rate and review books, add comments, notes, etc.
- **Wishlists**: Users can create wishlists of books they want to read


## Team

Created by **Luana + Zefi** as part of the Ironhack Web Development bootcamp.


# 🔗 Books.Inc. BACKEND

 **For more information about Books.Inc's backend, visit**: https://github.com/TheMediterraneans/book-exchange-backend

*The backend handles user authentication, book database management, reservation system logic, and external API integration.*
