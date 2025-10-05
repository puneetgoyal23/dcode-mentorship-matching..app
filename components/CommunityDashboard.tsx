import React, { useState } from 'react';
import { Community, UserProfile } from '../types';
import PlusIcon from './icons/PlusIcon';
import UsersIcon from './icons/UsersIcon';
import CreateCommunityModal from './CreateCommunityModal';
import CommunityView from './CommunityView';

interface CommunityDashboardProps {
  currentUser: UserProfile;
  allUsers: UserProfile[];
  allCommunities: Community[];
  activeCommunity: Community | null;
  onViewCommunity: (communityId: string) => void;
  onJoinCommunity: (communityId: string) => void;
  onCreateCommunity: (name: string, description: string) => void;
  onBackToList: () => void;
  onPostSubmit: (communityId: string, text: string) => void;
  onReplySubmit: (communityId: string, postId: string, text: string) => void;
}

const CommunityDashboard: React.FC<CommunityDashboardProps> = (props) => {
  const { currentUser, allCommunities, activeCommunity, onViewCommunity, onJoinCommunity, onCreateCommunity, onBackToList, onPostSubmit, onReplySubmit, allUsers } = props;
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  if (activeCommunity) {
    return <CommunityView 
      community={activeCommunity} 
      currentUser={currentUser}
      allUsers={allUsers}
      onBack={onBackToList}
      onPost={onPostSubmit}
      onReply={onReplySubmit}
    />;
  }

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h2 className="text-4xl font-extrabold text-white">Communities Hub</h2>
          <p className="mt-2 text-lg text-slate-400">Join the conversation, share knowledge, and grow together.</p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="btn btn-primary"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Create Community
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {allCommunities.map(community => {
          const isMember = community.memberIds.includes(currentUser.id);
          return (
            <div key={community.id} className="bg-slate-900 rounded-xl shadow-lg flex flex-col h-full p-6 border border-slate-800 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1 hover:border-indigo-500/30">
              <h3 className="text-2xl font-bold text-white">{community.name}</h3>
              <p className="text-slate-400 mt-2 flex-grow text-sm">{community.description}</p>
              <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-800">
                 <div className="flex items-center space-x-2 text-sm text-slate-400">
                    <UsersIcon className="h-5 w-5" />
                    <span>{community.memberIds.length} {community.memberIds.length === 1 ? 'member' : 'members'}</span>
                </div>
                 {isMember ? (
                  <button onClick={() => onViewCommunity(community.id)} className="btn bg-teal-600 hover:bg-teal-500 text-white text-sm">
                    View
                  </button>
                ) : (
                  <button onClick={() => onJoinCommunity(community.id)} className="btn btn-primary text-sm">
                    Join
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {isCreateModalOpen && (
        <CreateCommunityModal 
          onClose={() => setIsCreateModalOpen(false)}
          onCreate={onCreateCommunity}
        />
      )}
    </>
  );
};

export default CommunityDashboard;
