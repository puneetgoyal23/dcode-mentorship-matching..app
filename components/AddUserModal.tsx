import React, { useState } from 'react';
import { UserProfile, UserRole } from '../types';
import { ALL_SKILLS } from '../constants';

interface AddUserModalProps {
  onClose: () => void;
  onAddUser: (user: UserProfile) => void;
  defaultRole?: UserRole;
}

const AddUserModal: React.FC<AddUserModalProps> = ({ onClose, onAddUser, defaultRole }) => {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [role, setRole] = useState<UserRole>(defaultRole || UserRole.MENTEE);
  const [githubUrl, setGithubUrl] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const toggleSelection = (item: string, list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>) => {
    setList(prevList =>
      prevList.includes(item) ? prevList.filter(i => i !== item) : [...prevList, item]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !password.trim()) {
      alert("Please fill out all required fields.");
      return;
    }
    
    if (password.length < 8) {
      alert("Password must be at least 8 characters long.");
      return;
    }
    
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    if (selectedSkills.length === 0) {
      alert("Please select at least one skill to continue.");
      return;
    }

    const newUser: UserProfile = {
      id: `${role.toLowerCase()}-${Date.now()}`,
      name,
      role,
      bio,
      password,
      githubUrl,
      skills: selectedSkills,
      interests: selectedInterests,
      avatar: `https://i.pravatar.cc/150?u=${name}`,
      ...([UserRole.MENTOR, UserRole.BOTH].includes(role) && { rating: 0, ratingCount: 0 }),
    };

    onAddUser(newUser);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-slate-900/80 backdrop-blur-lg p-8 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-700/60" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Create New {role} Profile</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors text-2xl font-bold">&times;</button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
                <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full form-input"
                required
                />
            </div>
            <div>
                <label htmlFor="github" className="block text-sm font-medium text-slate-300 mb-1">GitHub Profile URL (Optional)</label>
                <input
                id="github"
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/your-username"
                className="w-full form-input"
                />
            </div>
          </div>
          
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-slate-300 mb-1">Bio (Optional)</label>
            <textarea
              id="bio"
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full form-input"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1">Password (min. 8 characters)</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full form-input"
                required
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-slate-300 mb-1">Confirm Password</label>
              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full form-input"
                required
              />
            </div>
          </div>

          {!defaultRole && (
            <div>
              <h3 className="text-sm font-medium text-slate-300 mb-2">Role</h3>
              <div className="flex gap-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="radio" name="role" value={UserRole.MENTEE} checked={role === UserRole.MENTEE} onChange={() => setRole(UserRole.MENTEE)} className="form-radio h-4 w-4 text-indigo-600 bg-slate-700 border-slate-600 focus:ring-indigo-500"/>
                  <span className="text-white">Mentee</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="radio" name="role" value={UserRole.MENTOR} checked={role === UserRole.MENTOR} onChange={() => setRole(UserRole.MENTOR)} className="form-radio h-4 w-4 text-indigo-600 bg-slate-700 border-slate-600 focus:ring-indigo-500"/>
                  <span className="text-white">Mentor</span>
                </label>
              </div>
            </div>
          )}

          <div>
            <h3 className="text-sm font-medium text-slate-300 mb-2">Select Skills <span className="text-red-400">*</span></h3>
            <div className="flex flex-wrap gap-2 p-3 bg-black/30 rounded-lg">
              {ALL_SKILLS.map(skill => (
                <button
                  type="button"
                  key={skill}
                  onClick={() => toggleSelection(skill, selectedSkills, setSelectedSkills)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${selectedSkills.includes(skill) ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-slate-300 mb-2">Select Interests</h3>
            <div className="flex flex-wrap gap-2 p-3 bg-black/30 rounded-lg">
              {ALL_SKILLS.map(interest => (
                <button
                  type="button"
                  key={interest}
                  onClick={() => toggleSelection(interest, selectedInterests, setSelectedInterests)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${selectedInterests.includes(interest) ? 'bg-teal-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-start gap-3 border-t border-slate-700 pt-6">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Create Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;
