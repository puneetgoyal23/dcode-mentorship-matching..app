import React, { useState } from 'react';
import { UserProfile } from '../types';

interface PasswordLoginModalProps {
  user: UserProfile;
  onClose: () => void;
  onLogin: (user: UserProfile) => void;
}

const PasswordLoginModal: React.FC<PasswordLoginModalProps> = ({ user, onClose, onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === user.password) {
      setError('');
      onLogin(user);
    } else {
      setError('Incorrect password. Please try again.');
      setPassword('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-slate-900/80 backdrop-blur-lg p-8 rounded-xl shadow-2xl w-full max-w-sm border border-slate-700/60" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Login</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors text-2xl font-bold">&times;</button>
        </div>
        
        <div className="flex flex-col items-center mb-6">
            <img src={user.avatar} alt={user.name} className="w-20 h-20 rounded-full mb-3 border-4 border-slate-700"/>
            <p className="font-semibold text-xl text-white">{user.name}</p>
            <p className="text-sm text-indigo-400">{user.role}</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full form-input ${error ? 'ring-red-500 border-red-500' : ''}`}
              required
              autoFocus
            />
            {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
          </div>
          
          <div className="pt-2">
            <button type="submit" className="w-full btn btn-primary">
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordLoginModal;
