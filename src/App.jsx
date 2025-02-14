import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { auth, db } from './services/firebase'; // Import Firebase and Firestore
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore'; // Import Firestore functions
import CustomerDashboard from './pages/CustomerDashboard';
import AgentDashboard from './pages/AgentDashboard';
import Login from './pages/Login';

const App = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Fetch the user role from Firestore using the user's UID
          const userRef = doc(db, 'users', user.uid);  // Reference to user document in Firestore
          const docSnap = await getDoc(userRef);

          if (docSnap.exists()) {
            const userRole = docSnap.data().role; // Get the role from the Firestore document

            // Navigate based on the user role
            if (userRole === 'Customer') {
              navigate('/customer-dashboard');
            } else if (userRole === 'Agent') {
              navigate('/agent-dashboard');
            }
          } else {
            console.log('User document not found in Firestore');
            navigate('/login');  // Redirect to login if the user document doesn't exist
          }
        } catch (error) {
          console.error('Error fetching user role:', error);
          navigate('/login');
        }
      } else {
        navigate('/login');  // Redirect to login if no user is authenticated
      }
    });

    return () => unsubscribe();  // Clean up the listener
  }, [navigate]);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/customer-dashboard" element={<CustomerDashboard />} />
      <Route path="/agent-dashboard" element={<AgentDashboard />} />
    </Routes>
  );
};

export default App;
