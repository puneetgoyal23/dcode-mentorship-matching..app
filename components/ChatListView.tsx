import React from 'react';
import { Conversation, UserProfile } from '../types';
import ChatBubbleLeftEllipsisIcon from './icons/ChatBubbleLeftEllipsisIcon';

interface ChatListViewProps {
  conversations: Conversation[];
  currentUser: UserProfile;
  onSelectConversation: (conversationId: string) => void;
}

const formatTimestamp = (date: Date) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const msgDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  if (today.getTime() === msgDate.getTime()) {
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  }
  
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (yesterday.getTime() === msgDate.getTime()) {
    return 'Yesterday';
  }
  
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
};

const ChatListView: React.FC<ChatListViewProps> = ({ conversations, currentUser, onSelectConversation }) => {
    
  const sortedConversations = [...conversations].sort((a, b) => {
    const lastMsgA = a.messages[a.messages.length - 1];
    const lastMsgB = b.messages[b.messages.length - 1];
    if (!lastMsgA) return 1;
    if (!lastMsgB) return -1;
    return new Date(lastMsgB.timestamp).getTime() - new Date(lastMsgA.timestamp).getTime();
  });

  if (sortedConversations.length === 0) {
    return (
      <div className="text-center py-16 px-6 max-w-2xl mx-auto">
        <ChatBubbleLeftEllipsisIcon className="mx-auto h-16 w-16 text-slate-600" />
        <h2 className="mt-4 text-3xl font-extrabold text-white">No Messages Yet</h2>
        <p className="text-slate-400 mt-2">Start a conversation with a mentor or mentee to see it here.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-white">Messages</h1>
      </div>
      <div className="bg-slate-900/80 backdrop-blur-lg rounded-xl shadow-2xl overflow-hidden border border-slate-700/60">
        <ul className="divide-y divide-slate-800">
          {sortedConversations.map((convo) => {
            const otherParticipants = convo.participants.filter(p => p.id !== currentUser.id);
            const chatTitle = convo.isGroupChat ? "Group Chat" : otherParticipants.map(p => p.name).join(', ');
            const lastMessage = convo.messages[convo.messages.length - 1];
            const unreadCount = convo.messages.filter(msg => 
              msg.senderId !== currentUser.id && (!msg.readBy || !msg.readBy[currentUser.id])
            ).length;

            return (
              <li key={convo.id}>
                <button
                  onClick={() => onSelectConversation(convo.id)}
                  className="w-full text-left p-4 hover:bg-slate-800/50 transition-colors duration-200 flex items-center space-x-4"
                >
                  <div className="relative flex-shrink-0">
                    <div className="flex -space-x-3 overflow-hidden">
                        {otherParticipants.slice(0, 2).map(p => (
                            <img key={p.id} className="inline-block h-12 w-12 rounded-full ring-2 ring-slate-800" src={p.avatar} alt={p.name} />
                        ))}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <p className="text-lg font-bold text-white truncate">{chatTitle}</p>
                      {lastMessage && (
                        <p className="text-xs text-slate-500 flex-shrink-0 ml-2">
                          {formatTimestamp(new Date(lastMessage.timestamp))}
                        </p>
                      )}
                    </div>
                    <div className="flex justify-between items-start mt-1">
                        <p className={`text-sm truncate ${unreadCount > 0 ? 'text-slate-100 font-semibold' : 'text-slate-400'}`}>
                           {lastMessage ? (
                                <>
                                    {lastMessage.senderId === currentUser.id && "You: "}
                                    {lastMessage.text}
                                </>
                            ) : (
                                "No messages yet"
                            )}
                        </p>
                        {unreadCount > 0 && (
                            <span className="ml-3 flex-shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white shadow-md">
                                {unreadCount}
                            </span>
                        )}
                    </div>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default ChatListView;
