import React, { useState } from 'react';
import { UserProfile, UserRole } from '../types';
import AddUserModal from './AddUserModal';
import PlusIcon from './icons/PlusIcon';
import AcademicCapIcon from './icons/AcademicCapIcon';
import UserIcon from './icons/UserIcon';
import PasswordLoginModal from './PasswordLoginModal';
import ArrowsRightLeftIcon from './icons/ArrowsRightLeftIcon';

interface LoginProps {
  onLogin: (user: UserProfile) => void;
  users: UserProfile[];
  onUserAdded: (user: UserProfile) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, users, onUserAdded }) => {
  const [selectionView, setSelectionView] = useState<'main' | 'mentor' | 'mentee' | 'both'>('main');
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [roleForCreation, setRoleForCreation] = useState<UserRole | null>(null);

  const [selectedUserForLogin, setSelectedUserForLogin] = useState<UserProfile | null>(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const handleOpenAddUserModal = (role: UserRole) => {
    setRoleForCreation(role);
    setIsAddUserModalOpen(true);
  };

  const handleUserCreated = (newUser: UserProfile) => {
    onUserAdded(newUser);
    setIsAddUserModalOpen(false);
    setRoleForCreation(null);
  };

  const handleProfileSelect = (user: UserProfile) => {
    setSelectedUserForLogin(user);
    setIsPasswordModalOpen(true);
  };

  const renderUserSelection = (role: UserRole) => {
    const filteredUsers = users.filter(u => u.role === role);
    
    let title = '';
    let buttonText = '';
    switch (role) {
        case UserRole.MENTOR:
            title = 'Mentor Login';
            buttonText = 'Create New Mentor Profile';
            break;
        case UserRole.MENTEE:
            title = 'Mentee Login';
            buttonText = 'Create New Mentee Profile';
            break;
        case UserRole.BOTH:
            title = 'Dual Role Login';
            buttonText = 'Create New Dual Role Profile';
            break;
    }


    return (
        <div className="w-full max-w-md p-8 space-y-6 bg-slate-900/80 backdrop-blur-lg rounded-xl shadow-2xl border border-slate-700/60">
            <div className="text-center">
                <button onClick={() => setSelectionView('main')} className="text-sm text-indigo-400 hover:underline mb-4">&larr; Back to Role Selection</button>
                <h2 className="text-3xl font-extrabold text-white">{title}</h2>
                <p className="mt-2 text-slate-400">Select your profile to continue</p>
            </div>
            <div className="space-y-4 max-h-72 overflow-y-auto pr-2 -mr-2">
            {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                <button
                    key={user.id}
                    onClick={() => handleProfileSelect(user)}
                    className="w-full flex items-center p-4 bg-slate-800 rounded-lg hover:bg-indigo-600/50 transition-all duration-200 group ring-1 ring-slate-700 hover:ring-indigo-500"
                >
                    <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full mr-4 border-2 border-slate-600 group-hover:border-indigo-400 transition-colors" />
                    <div className="text-left">
                    <p className="font-semibold text-lg text-white">{user.name}</p>
                    <p className="text-sm text-indigo-400 font-medium">{user.role}</p>
                    </div>
                </button>
                ))
            ) : (
                <p className="text-center text-slate-500 py-8">No {role} profiles found. Create one below.</p>
            )}
            </div>
            <div className="border-t border-slate-700 pt-6">
                <button
                    onClick={() => handleOpenAddUserModal(role)}
                    className="w-full flex items-center justify-center p-3 bg-slate-800 rounded-lg hover:bg-teal-600/50 transition-all duration-200 group ring-1 ring-slate-700 hover:ring-teal-500"
                >
                    <PlusIcon className="w-6 h-6 mr-2 text-teal-300" />
                    <span className="font-semibold text-white">{buttonText}</span>
                </button>
            </div>
        </div>
    );
  };

  // FIX: Changed `icon` prop from a ReactElement to a component (`React.FC`) to resolve typing issues with `React.cloneElement`.
  // The component is now instantiated directly with the required className.
  const MainSelectionButton: React.FC<{onClick: () => void, icon: React.FC<React.SVGProps<SVGSVGElement>>, text: string, color: 'indigo' | 'teal' | 'purple'}> = ({onClick, icon: Icon, text, color}) => {
    const colorClasses = {
        indigo: 'from-slate-800 to-slate-900 ring-indigo-500/50 group-hover:from-indigo-900/50 group-hover:to-slate-900',
        teal: 'from-slate-800 to-slate-900 ring-teal-500/50 group-hover:from-teal-900/50 group-hover:to-slate-900',
        purple: 'from-slate-800 to-slate-900 ring-purple-500/50 group-hover:from-purple-900/50 group-hover:to-slate-900',
    }
    const iconColorClasses = {
        indigo: 'text-indigo-400',
        teal: 'text-teal-400',
        purple: 'text-purple-400',
    }
    return (
        <button
            onClick={onClick}
            className={`w-full p-6 bg-gradient-to-br rounded-xl transition-all duration-300 group relative overflow-hidden ring-1 ring-slate-700 hover:ring-2 ${colorClasses[color]}`}
        >
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-center sm:text-left">
                <Icon className={`w-12 h-12 transition-colors ${iconColorClasses[color]}`} />
                <span className="font-semibold text-2xl text-white">{text}</span>
            </div>
        </button>
    )
  }

  const renderMainSelection = () => (
    <div className="w-full max-w-lg p-8 space-y-8 bg-slate-900/80 backdrop-blur-lg rounded-xl shadow-2xl text-center border border-slate-700/60">
        <div>
            <h2 className="text-4xl font-extrabold text-white">Welcome to DCODE</h2>
            <p className="mt-3 text-lg text-slate-400">The open-source mentorship platform.</p>
        </div>
        <div className="space-y-6">
             <MainSelectionButton
                onClick={() => setSelectionView('mentor')}
                icon={AcademicCapIcon}
                text="I'm a Mentor"
                color="indigo"
            />
            <MainSelectionButton
                onClick={() => setSelectionView('mentee')}
                icon={UserIcon}
                text="I'm a Mentee"
                color="teal"
            />
            <MainSelectionButton
                onClick={() => setSelectionView('both')}
                icon={ArrowsRightLeftIcon}
                text="I can do Both"
                color="purple"
            />
        </div>
        <p className="text-slate-500 text-sm pt-4">Select a role to log in or create a new profile.</p>
    </div>
  );

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-180px)]">
        {selectionView === 'main' && renderMainSelection()}
        {selectionView === 'mentor' && renderUserSelection(UserRole.MENTOR)}
        {selectionView === 'mentee' && renderUserSelection(UserRole.MENTEE)}
        {selectionView === 'both' && renderUserSelection(UserRole.BOTH)}
      </div>
      {isAddUserModalOpen && roleForCreation && (
        <AddUserModal 
            onClose={() => setIsAddUserModalOpen(false)}
            onAddUser={handleUserCreated}
            defaultRole={roleForCreation}
        />
      )}
      {isPasswordModalOpen && selectedUserForLogin && (
        <PasswordLoginModal
            user={selectedUserForLogin}
            onClose={() => setIsPasswordModalOpen(false)}
            onLogin={onLogin}
        />
      )}
    </>
  );
};

export default Login;