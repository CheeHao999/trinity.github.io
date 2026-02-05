import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import client from '../shared/api/client';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const response = await client.post('/auth/forgot-password', { email });
      setMessage(response.data.message);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 animate-fade-in">
      <div className="border-2 border-white bg-surface p-10 relative">
        <div className="absolute top-0 left-0 bg-white text-black px-4 py-1 font-bold uppercase tracking-widest text-xs">
          Account Recovery
        </div>
        
        <h2 className="text-4xl font-black text-center mb-10 uppercase tracking-tighter mt-4 text-white">Forgot Password</h2>
        
        {message && (
          <div className="bg-green-900/20 text-green-400 p-4 border-l-4 border-green-500 mb-8 font-medium text-sm">
            {message}
          </div>
        )}

        {error && (
          <div className="bg-red-900/20 text-red-400 p-4 border-l-4 border-red-500 mb-8 font-medium text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="group">
            <label htmlFor="email" className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 group-focus-within:text-white transition-colors">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-800 focus:border-white outline-none transition-colors bg-background text-white font-medium"
              placeholder="student@university.edu"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-mappa mt-8"
          >
            {loading ? 'Submitting...' : 'Request Reset'}
          </button>
        </form>
        
        <div className="mt-8 text-center text-sm font-medium text-gray-500">
          Remember your password? <Link to="/" className="text-white font-bold uppercase tracking-wide hover:underline decoration-2 underline-offset-4 ml-1">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
