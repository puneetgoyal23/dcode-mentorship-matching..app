import React from 'react';
import { UserProfile, UserRole } from '../types';
import SkillBadge from './SkillBadge';
import ChatBubbleIcon from './icons/ChatBubbleIcon';
import CalendarIcon from './icons/CalendarIcon';
import SparklesIcon from './icons/SparklesIcon';
import StarIcon from './icons/StarIcon';
import GitHubIcon from './icons/GitHubIcon';

interface ProfileCardProps {
  user: UserProfile;
  currentUserRole: UserRole;
  onStartChat: () => void;
  onBookSession: () => void;
  onRateSession: () => void;
  matchReason?: string;
}

function ProfileCard({ user, currentUserRole, onStartChat, onBookSession, onRateSession, matchReason }: ProfileCardProps) {
  
  const renderRating = () => {
    if ((user.role !== UserRole.MENTOR && user.role !== UserRole.BOTH) || !user.rating) return null;
    
    return (
        <div className="flex items-center gap-1 text-amber-400 flex-shrink-0">
            <StarIcon className="h-4 w-4" />
            <span className="font-bold text-sm text-white">{user.rating.toFixed(1)}</span>
            <span className="text-xs text-slate-400">({user.ratingCount})</span>
        </div>
    );
  };

  const canBookOrRate = [UserRole.MENTEE, UserRole.BOTH].includes(currentUserRole) &&
                       [UserRole.MENTOR, UserRole.BOTH].includes(user.role) &&
                       currentUserRole !== user.role; // Prevent booking/rating yourself if you're also 'Both'

  return (
    <div className="bg-slate-900 rounded-xl shadow-lg flex flex-col h-full border border-slate-800 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1 group relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
      <div className="p-[1px] rounded-xl h-full flex flex-col bg-slate-900">
        <div className="rounded-xl h-full flex flex-col">
          {matchReason && (
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 text-sm font-semibold flex items-center gap-2">
              <SparklesIcon className="h-4 w-4 flex-shrink-0" />
              <p><span className="font-bold">AI Match:</span> {matchReason}</p>
            </div>
          )}
          <div className="p-6 flex-grow flex flex-col relative">
            <div className="flex items-start mb-4">
                <img className="w-20 h-20 rounded-full mr-6 border-4 border-slate-700" src={user.avatar} alt={user.name} />
                <div className="flex-grow">
                    <div className="flex justify-between items-center">
                        <h3 className="text-2xl font-bold text-white">{user.name}</h3>
                        {renderRating()}
                    </div>
                    <p className="text-indigo-400 font-semibold">{user.role}</p>
                </div>
            </div>
            <p className="text-slate-300 mb-4 text-sm flex-grow">{user.bio}</p>
            
            <div className="space-y-4 mb-6">
                <div>
                    <h4 className="font-semibold text-slate-400 text-xs uppercase tracking-wider mb-2">Skills</h4>
                    <div className="flex flex-wrap gap-2">
                        {user.skills.slice(0, 5).map(skill => <SkillBadge key={skill} skill={skill} color="indigo" />)}
                    </div>
                </div>
                <div>
                    <h4 className="font-semibold text-slate-400 text-xs uppercase tracking-wider mb-2">Interests</h4>
                    <div className="flex flex-wrap gap-2">
                        {user.interests.slice(0, 5).map(interest => <SkillBadge key={interest} skill={interest} color="teal" />)}
                    </div>
                </div>
            </div>
            
            <div className="mt-auto pt-6 flex items-center space-x-3 border-t border-slate-800">
                <button
                  onClick={onStartChat}
                  className="flex-1 btn btn-secondary"
                >
                  <ChatBubbleIcon className="h-5 w-5 mr-2" />
                  Chat
                </button>
                 {user.githubUrl && (
                    <a
                        href={user.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="View GitHub Profile"
                        className="p-3 font-semibold text-white bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors border border-slate-700"
                    >
                        <GitHubIcon className="h-5 w-5" />
                    </a>
                )}
                {canBookOrRate && (
                  <>
                    <button
                      onClick={onBookSession}
                      className="flex-1 btn bg-teal-600 hover:bg-teal-500 text-white"
                    >
                      <CalendarIcon className="h-5 w-5 mr-2" />
                      Book
                    </button>
                     <button
                        onClick={onRateSession}
                        title="Rate Session"
                        className="p-3 font-semibold text-white bg-slate-800 rounded-lg hover:bg-amber-500/20 hover:text-amber-400 transition-colors border border-slate-700"
                    >
                        <StarIcon className="h-5 w-5" />
                    </button>
                  </>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const Skeleton: React.FC = () => (
    <div className="bg-slate-800 rounded-xl shadow-lg overflow-hidden p-6 animate-pulse border border-slate-700">
        <div className="flex items-center mb-4">
            <div className="w-20 h-20 rounded-full mr-6 bg-slate-700"></div>
            <div>
                <div className="h-7 w-36 bg-slate-700 rounded mb-2"></div>
                <div className="h-5 w-24 bg-slate-700 rounded"></div>
            </div>
        </div>
        <div className="space-y-3 mb-4">
            <div className="h-4 bg-slate-700 rounded"></div>
            <div className="h-4 bg-slate-700 rounded w-5/6"></div>
        </div>
        <div className="space-y-4 mb-6">
            <div>
                <div className="h-4 w-16 bg-slate-700 rounded mb-2"></div>
                <div className="flex flex-wrap gap-2">
                    <div className="h-6 w-20 bg-slate-700 rounded-full"></div>
                    <div className="h-6 w-24 bg-slate-700 rounded-full"></div>
                    <div className="h-6 w-16 bg-slate-700 rounded-full"></div>
                </div>
            </div>
        </div>
        <div className="h-10 w-full bg-slate-700 rounded-lg mt-auto"></div>
    </div>
);

ProfileCard.Skeleton = Skeleton;


export default ProfileCard;
