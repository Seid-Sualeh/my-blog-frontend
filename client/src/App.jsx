import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './layouts/common/header/header';
import Footer from './layouts/common/footer/footer';
import Home from './pages/home';
import BlogDetail from './pages/blog-detail';
import BecomeWriter from './pages/become-writer';
import SignUp from './pages/auth/sign-up';
import SignIn from './pages/auth/sign-in';
import WriteBlog from './pages/write-blog';
import ProtectedRoute from './components/protected-route';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/blog/:id" element={<BlogDetail />} />
            <Route path="/become-a-writer" element={<BecomeWriter />} />
            <Route path="/auth/sign-up" element={<SignUp />} />
            <Route path="/auth/sign-in" element={<SignIn />} />
            <Route
              path="/blog/:writerId/write"
              element={
                <ProtectedRoute>
                  <WriteBlog />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
