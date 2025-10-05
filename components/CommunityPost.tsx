import React, { useState } from 'react';
import { CommunityPost as Post, UserProfile, CommunityReply } from '../types';
import PaperAirplaneIcon from './icons/PaperAirplaneIcon';

interface CommunityPostProps {
  post: Post;
  currentUser: UserProfile;
  onReply: (postId: string, text: string) => void;
}

const formatTimestamp = (date: Date) => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

const CommunityPost: React.FC<CommunityPostProps> = ({ post, currentUser, onReply }) => {
  const [replyText, setReplyText] = useState('');
  const [showReplies, setShowReplies] = useState(false);

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (replyText.trim()) {
      onReply(post.id, replyText);
      setReplyText('');
    }
  };

  return (
    <div className="bg-slate-900/50 p-5 rounded-lg border border-slate-800">
      <div className="flex items-start space-x-4">
        <img src={post.authorAvatar} alt={post.authorName} className="w-11 h-11 rounded-full flex-shrink-0" />
        <div className="flex-1">
          <div className="flex items-baseline space-x-2">
            <p className="font-bold text-white">{post.authorName}</p>
            <p className="text-xs text-slate-500">{formatTimestamp(new Date(post.timestamp))}</p>
          </div>
          <p className="text-slate-300 mt-1 whitespace-pre-wrap">{post.text}</p>
        </div>
      </div>
      
      <div className="pl-14 mt-3">
        {post.replies.length > 0 && (
          <button onClick={() => setShowReplies(!showReplies)} className="text-sm font-semibold text-indigo-400 hover:underline">
            {showReplies ? 'Hide' : 'View'} {post.replies.length} {post.replies.length === 1 ? 'reply' : 'replies'}
          </button>
        )}

        {showReplies && (
          <div className="mt-4 space-y-4 border-l-2 border-slate-700 pl-4">
            {post.replies.map(reply => (
              <div key={reply.id} className="flex items-start space-x-3">
                <img src={reply.authorAvatar} alt={reply.authorName} className="w-8 h-8 rounded-full flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex items-baseline space-x-2">
                    <p className="font-semibold text-white text-sm">{reply.authorName}</p>
                    <p className="text-xs text-slate-500">{formatTimestamp(new Date(reply.timestamp))}</p>
                  </div>
                  <p className="text-slate-300 text-sm mt-0.5 whitespace-pre-wrap">{reply.text}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <form onSubmit={handleReplySubmit} className="mt-4 flex items-center space-x-3">
          <img src={currentUser.avatar} alt={currentUser.name} className="w-8 h-8 rounded-full" />
          <input
            type="text"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write a reply..."
            className="flex-1 w-full px-4 py-2 text-sm bg-slate-700/80 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 border border-slate-700"
          />
          <button type="submit" disabled={!replyText.trim()} className="p-2.5 bg-indigo-600 text-white rounded-full hover:bg-indigo-500 disabled:bg-indigo-800/50 disabled:cursor-not-allowed transition-colors">
            <PaperAirplaneIcon className="h-4 w-4"/>
          </button>
        </form>
      </div>
    </div>
  );
};

export default CommunityPost;
