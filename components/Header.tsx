import React from 'react';
import { UserProfile, View } from '../types';
import CodeIcon from './icons/CodeIcon';
import MegaphoneIcon from './icons/MegaphoneIcon';
import UsersIcon from './icons/UsersIcon';
import HomeIcon from './icons/HomeIcon';
import AcademicCapIcon from './icons/AcademicCapIcon';
import UserIcon from './icons/UserIcon';
import ChatBubbleLeftEllipsisIcon from './icons/ChatBubbleLeftEllipsisIcon';

interface HeaderProps {
  currentUser: UserProfile | null;
  currentView: View;
  totalUnreadCount: number;
  onLogout: () => void;
  onOpenFeedback: () => void;
  onNavigateToDashboard: () => void;
  onNavigateToMentors: () => void;
  onNavigateToMentees: () => void;
  onNavigateToCommunities: () => void;
  onNavigateToChatsList: () => void;
}

const NavButton: React.FC<{
  onClick: () => void;
  active: boolean;
  children: React.ReactNode;
  icon: React.ReactNode;
  badgeCount?: number;
}> = ({ onClick, active, children, icon, badgeCount = 0 }) => {
  return (
    <button
      onClick={onClick}
      className={`relative inline-flex items-center px-3 py-2 rounded-md text-sm font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 ${
        active
          ? 'bg-slate-700/80 text-indigo-300'
          : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-100'
      }`}
    >
      {icon}
      {children}
      {badgeCount > 0 && (
        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white shadow-md">
          {badgeCount > 9 ? '9+' : badgeCount}
        </span>
      )}
    </button>
  );
};


const Header: React.FC<HeaderProps> = ({
  currentUser,
  currentView,
  totalUnreadCount,
  onLogout,
  onOpenFeedback,
  onNavigateToDashboard,
  onNavigateToMentors,
  onNavigateToMentees,
  onNavigateToCommunities,
  onNavigateToChatsList,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-slate-950/70 backdrop-blur-xl shadow-lg z-50 border-b border-slate-700/40">
      <div className="container mx-auto px-4 md:px-8 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-6">
          <button onClick={currentUser ? onNavigateToDashboard : () => {}} className="flex items-center space-x-3" disabled={!currentUser}>
            <CodeIcon className="h-8 w-8 text-indigo-400" />
            <h1 className="hidden sm:block text-2xl font-bold tracking-tight text-slate-100">
              D<span className="text-indigo-400">CODE</span>
            </h1>
          </button>
          {currentUser && (
             <nav className="hidden md:flex items-center space-x-1 bg-slate-900/50 p-1 rounded-lg border border-slate-800">
                <NavButton onClick={onNavigateToDashboard} active={currentView === View.DASHBOARD} icon={<HomeIcon className="h-5 w-5 mr-2"/>}>
                    Home
                </NavButton>
                <NavButton onClick={onNavigateToChatsList} active={currentView === View.CHATS_LIST || currentView === View.CHAT} icon={<ChatBubbleLeftEllipsisIcon className="h-5 w-5 mr-2"/>} badgeCount={totalUnreadCount}>
                    Chats
                </NavButton>
                <NavButton onClick={onNavigateToMentors} active={currentView === View.MENTORS} icon={<AcademicCapIcon className="h-5 w-5 mr-2"/>}>
                    Mentors
                </NavButton>
                <NavButton onClick={onNavigateToMentees} active={currentView === View.MENTEES} icon={<UserIcon className="h-5 w-5 mr-2"/>}>
                    Mentees
                </NavButton>
                <NavButton onClick={onNavigateToCommunities} active={currentView === View.COMMUNITIES} icon={<UsersIcon className="h-5 w-5 mr-2"/>}>
                    Communities
                </NavButton>
            </nav>
          )}
        </div>
        {currentUser && (
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              onClick={onOpenFeedback}
              className="hidden sm:inline-flex items-center px-3 py-2 bg-slate-800/80 text-slate-300 rounded-md hover:bg-slate-700/80 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition-colors border border-slate-700"
              title="Give Feedback"
            >
              <MegaphoneIcon className="h-5 w-5 sm:mr-2" />
              <span className="hidden sm:inline">Feedback</span>
            </button>
            <div className="flex items-center space-x-3">
                <div className="text-right hidden lg:block">
                    <p className="font-semibold text-white">{currentUser.name}</p>
                    <p className="text-xs text-indigo-400">{currentUser.role}</p>
                </div>
                <img src={currentUser.avatar} alt={currentUser.name} className="h-10 w-10 rounded-full ring-2 ring-offset-2 ring-offset-slate-950 ring-slate-700"/>
            </div>
            <button
              onClick={onLogout}
              className="px-3 sm:px-4 py-2 bg-slate-800 text-slate-300 rounded-md hover:bg-red-600/80 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 transition-colors border border-slate-700 hover:border-red-600"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
