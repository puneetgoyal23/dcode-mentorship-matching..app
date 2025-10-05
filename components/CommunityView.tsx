import React, { useState } from 'react';
import { Community, UserProfile } from '../types';
import CommunityPost from './CommunityPost';
import PlusIcon from './icons/PlusIcon';

interface CommunityViewProps {
  community: Community;
  currentUser: UserProfile;
  allUsers: UserProfile[];
  onBack: () => void;
  onPost: (communityId: string, text: string) => void;
  onReply: (communityId: string, postId: string, text: string) => void;
}

const CommunityView: React.FC<CommunityViewProps> = ({ community, currentUser, allUsers, onBack, onPost, onReply }) => {
  const [newPostText, setNewPostText] = useState('');
  const members = community.memberIds.map(id => allUsers.find(u => u.id === id)).filter(Boolean) as UserProfile[];

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPostText.trim()) {
      onPost(community.id, newPostText);
      setNewPostText('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <button onClick={onBack} className="mb-6 font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
        &larr; Back to all communities
      </button>

      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-xl p-6 mb-8">
        <h2 className="text-3xl font-extrabold text-white">{community.name}</h2>
        <p className="mt-2 text-slate-400">{community.description}</p>
        <div className="mt-4 flex items-center">
            <div className="flex -space-x-2 overflow-hidden mr-3">
             {members.slice(0, 5).map(p => (
               <img key={p.id} className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-900" src={p.avatar} alt={p.name} title={p.name} />
             ))}
           </div>
           <span className="text-sm font-medium text-slate-400">{community.memberIds.length} {community.memberIds.length === 1 ? 'member' : 'members'}</span>
        </div>
      </div>
      
      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-xl p-6 mb-8">
        <form onSubmit={handlePostSubmit} className="flex items-start space-x-4">
          <img src={currentUser.avatar} alt={currentUser.name} className="w-11 h-11 rounded-full flex-shrink-0 mt-1" />
          <textarea
            rows={3}
            value={newPostText}
            onChange={(e) => setNewPostText(e.target.value)}
            placeholder="Start a new post in this community..."
            className="flex-1 w-full px-4 py-2 bg-slate-800 text-white rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={!newPostText.trim()}
            className="btn btn-primary px-6"
          >
            Post
          </button>
        </form>
      </div>

      <div className="space-y-6">
        {community.posts.length > 0 ? (
          community.posts.map(post => (
            <CommunityPost
              key={post.id}
              post={post}
              currentUser={currentUser}
              onReply={(postId, text) => onReply(community.id, postId, text)}
            />
          ))
        ) : (
          <div className="text-center py-16 px-6 bg-slate-900 rounded-xl border-2 border-dashed border-slate-800">
            <h4 className="text-xl font-semibold text-white">It's quiet in here...</h4>
            <p className="text-slate-400 mt-2">Be the first one to start a conversation in the {community.name} community.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityView;
