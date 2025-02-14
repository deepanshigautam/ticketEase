import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../services/firebase';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const userId = user.uid;
      
      const userRef = doc(db, 'users', userId);
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        const userRole = docSnap.data().role;
        if (userRole === 'Customer') {
          navigate('/customer-dashboard');
        } else if (userRole === 'Agent') {
          navigate('/agent-dashboard');
        }
      } else {
        console.log('User document not found in Firestore');
        navigate('/login');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
      console.log('Error during login:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 transition-all duration-500">
      <div className="relative bg-white p-8 rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 hover:scale-[1.01]">
        {/* Decorative elements */}
        <div className="absolute -top-4 -left-4 w-16 h-16 bg-gray-900 rounded-lg opacity-5"></div>
        <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-gray-900 rounded-lg opacity-5"></div>
        
        <div className="mb-8 text-center relative">
          <h2 className="text-4xl font-bold text-gray-800 mb-2">Welcome Back</h2>
          <p className="text-gray-600 text-lg">Please sign in to continue</p>
          <div className="h-1 w-20 bg-gray-800 mx-auto mt-4 rounded-full"></div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="transform transition-all duration-300 hover:translate-x-1">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all duration-300"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="transform transition-all duration-300 hover:translate-x-1">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all duration-300"
              placeholder="Enter your password"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-500 px-4 py-3 rounded-lg text-sm animate-shake">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-gray-800 text-white py-4 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all duration-300 transform hover:-translate-y-1 font-medium relative overflow-hidden ${
              isLoading ? 'opacity-75 cursor-not-allowed' : ''
            }`}
          >
            <span className={`transition-all duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
              Sign In
            </span>
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </button>

          <div className="text-center mt-6">
            <a href="#" className="text-sm text-gray-600 hover:text-gray-800 transition-colors duration-300">
              Forgot your password?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;