import React from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../services/firebase'; // Import Firebase auth
import { useNavigate } from 'react-router-dom';

const AgentDashboard = () => {
     // Logout function
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login'); // Redirect to login page after logging out
    } catch (error) {
      console.error('Error logging out: ', error);
    }
  };
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-100">
      <div className="max-w-md w-full mx-4 p-8 bg-white rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-zinc-900">Agent Dashboard</h1>
        <p className="mt-2 text-zinc-600">Welcome, Agent!</p>

        <div className="mt-6">
          <button className="bg-zinc-900 text-white py-2 px-4 rounded-lg hover:bg-zinc-800">
            View All Tickets
          </button>
        </div>
        <div className="mt-6">
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-500"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgentDashboard;
