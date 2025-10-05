import React, { useState } from 'react';
import { UserProfile } from '../types';
import { ALL_SKILLS } from '../constants';
import SkillBadge from './SkillBadge';

interface ProfileSetupProps {
  user: UserProfile;
  onProfileUpdate: (user: UserProfile) => void;
}

const ProfileSetup: React.FC<ProfileSetupProps> = ({ user, onProfileUpdate }) => {
  const [githubUrl, setGithubUrl] = useState(user.githubUrl || '');
  const [selectedSkills, setSelectedSkills] = useState<string[]>(user.skills);
  const [selectedInterests, setSelectedInterests] = useState<string[]>(user.interests);

  const toggleSelection = (item: string, list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSkills.length === 0) {
      alert("Please select at least one skill to complete your profile.");
      return;
    }
    onProfileUpdate({
      ...user,
      skills: selectedSkills,
      interests: selectedInterests,
      githubUrl,
    });
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-slate-900/80 backdrop-blur-lg rounded-xl shadow-2xl border border-slate-700/60">
      <h2 className="text-3xl font-bold text-center mb-2">Complete Your Profile</h2>
      <p className="text-center text-slate-400 mb-8">This helps us find the best matches for you, {user.name}.</p>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
            <label htmlFor="github" className="block text-lg font-semibold text-slate-200 mb-2">GitHub Profile URL</label>
            <input
            id="github"
            type="url"
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
            placeholder="https://github.com/your-username"
            className="w-full px-4 py-2 bg-slate-800 text-white rounded-md border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
            />
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">Your Skills <span className="text-red-400">*</span></h3>
          <div className="flex flex-wrap gap-2 p-4 bg-slate-950/50 rounded-lg">
            {ALL_SKILLS.map(skill => (
              <button
                type="button"
                key={skill}
                onClick={() => toggleSelection(skill, selectedSkills, setSelectedSkills)}
                className={`px-3 py-1.5 text-sm font-medium rounded-full transition-all duration-200 transform hover:scale-105 ${
                  selectedSkills.includes(skill)
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {skill}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">Your Interests</h3>
          <div className="flex flex-wrap gap-2 p-4 bg-slate-950/50 rounded-lg">
            {ALL_SKILLS.map(interest => (
              <button
                type="button"
                key={interest}
                onClick={() => toggleSelection(interest, selectedInterests, setSelectedInterests)}
                className={`px-3 py-1.5 text-sm font-medium rounded-full transition-all duration-200 transform hover:scale-105 ${
                  selectedInterests.includes(interest)
                    ? 'bg-teal-500 text-white shadow-lg'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>
        
        <button
          type="submit"
          className="w-full btn btn-primary"
        >
          Save and Continue
        </button>
      </form>
    </div>
  );
};

export default ProfileSetup;
