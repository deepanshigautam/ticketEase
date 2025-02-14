import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { auth } from './firebase'; // Import Firebase auth
import { onAuthStateChanged } from 'firebase/auth'; // Listen for auth state changes
import Login from './components/Login';
import Dashboard from './components/Dashboard';

const App = () => {
  const [user, setUser] = useState(null); // State to track the user

  useEffect(() => {
    // Set up listener for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser); // Set user if logged in
      } else {
        setUser(null); // Set user to null if logged out
      }
    });

    // Cleanup the listener when the component is unmounted
    return () => unsubscribe();
  }, []);

  return (
    <Router>
     <Routes>
  <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
  <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/" replace />} />
</Routes>

    </Router>
  );
};

export default App;
