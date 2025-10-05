import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Conversation, UserProfile, ChatMessage, UserRole } from '../types';
import { generateIcebreakers } from '../services/geminiService';
import SparklesIcon from './icons/SparklesIcon';
import PaperAirplaneIcon from './icons/PaperAirplaneIcon';
import CheckIcon from './icons/CheckIcon';
import CheckDoubleIcon from './icons/CheckDoubleIcon';

interface ChatWindowProps {
  conversation: Conversation;
  currentUser: UserProfile;
  onBack: () => void;
  onSendMessage: (messageText: string) => void;
  onMarkAsRead: (conversationId: string) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ conversation, currentUser, onBack, onSendMessage, onMarkAsRead }) => {
  const [newMessage, setNewMessage] = useState('');
  const [icebreakers, setIcebreakers] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<number | null>(null);
  const [isOtherUserTyping, setIsOtherUserTyping] = useState(false);
  
  const typingKey = `typing-${conversation.id}`;
  const otherParticipants = conversation.participants.filter(p => p.id !== currentUser.id);
  const chatTitle = conversation.isGroupChat ? "Group Chat" : otherParticipants.map(p => p.name).join(', ');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [conversation.messages, isOtherUserTyping]);

  useEffect(() => {
    const fetchIcebreakers = async () => {
      if (
        conversation.messages.length === 0 &&
        currentUser.role !== UserRole.MENTOR &&
        !conversation.isGroupChat &&
        otherParticipants.length > 0
      ) {
        try {
          const suggestions = await generateIcebreakers(currentUser, otherParticipants[0]);
          setIcebreakers(suggestions);
        } catch(error) {
          console.error("Failed to fetch icebreakers:", error);
        }
      }
    };
    fetchIcebreakers();
  }, [conversation.id, conversation.messages.length, conversation.isGroupChat, currentUser, otherParticipants]);
  
  useEffect(() => {
    if (newMessage.trim().length > 0 && icebreakers.length > 0) {
        setIcebreakers([]);
    }
  }, [newMessage, icebreakers]);

  // Typing indicator listener
  useEffect(() => {
    const handleTypingEvent = (event: StorageEvent) => {
      if (event.key === typingKey) {
        if (event.newValue && event.newValue !== currentUser.id) {
          setIsOtherUserTyping(true);
        } else {
          setIsOtherUserTyping(false);
        }
      }
    };
    
    window.addEventListener('storage', handleTypingEvent);

    const initialTypingUser = window.localStorage.getItem(typingKey);
    if (initialTypingUser && initialTypingUser !== currentUser.id) {
        setIsOtherUserTyping(true);
    }

    return () => {
      window.removeEventListener('storage', handleTypingEvent);
      if (window.localStorage.getItem(typingKey) === currentUser.id) {
        window.localStorage.removeItem(typingKey);
      }
    };
  }, [typingKey, currentUser.id]);

  // Read receipts marker
  useEffect(() => {
    onMarkAsRead(conversation.id);
  }, [conversation.id, conversation.messages, onMarkAsRead]);

  const handleTypingChange = (text: string) => {
    setNewMessage(text);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    if (text.trim().length > 0) {
        window.localStorage.setItem(typingKey, currentUser.id);
    } else {
        window.localStorage.removeItem(typingKey);
    }

    typingTimeoutRef.current = window.setTimeout(() => {
      window.localStorage.removeItem(typingKey);
    }, 2000); // Stop typing after 2s of inactivity
  };
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;
    if (icebreakers.length > 0) {
        setIcebreakers([]);
    }

    onSendMessage(newMessage);
    handleTypingChange(''); // Clear input and typing indicator
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    window.localStorage.removeItem(typingKey);
  };

  const handleSelectIcebreaker = (text: string) => {
    onSendMessage(text);
    setIcebreakers([]); 
  };

  const renderIcebreakers = () => {
    if (icebreakers.length > 0) {
      return (
        <div className="px-4 pb-4 pt-3 border-t border-slate-700/60 bg-slate-900/50">
           <div className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-3">
              <SparklesIcon className="h-5 w-5 text-indigo-400" />
              <span>AI-Powered Icebreakers</span>
          </div>
          <div className="space-y-2">
            {icebreakers.map((text, i) => (
              <button
                key={i}
                onClick={() => handleSelectIcebreaker(text)}
                className="w-full text-left px-4 py-2 text-sm bg-slate-800/80 text-slate-200 rounded-lg hover:bg-indigo-600 hover:text-white transition-all duration-200 ring-1 ring-slate-700"
              >
                {text}
              </button>
            ))}
          </div>
        </div>
      );
    }
    return null;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-180px)] max-w-4xl mx-auto bg-slate-900/80 backdrop-blur-lg rounded-xl shadow-2xl overflow-hidden border border-slate-700/60">
      <div className="p-4 bg-slate-950/50 backdrop-blur-sm flex items-center justify-between border-b border-slate-700/60 flex-shrink-0">
        <div className="flex items-center">
          <button onClick={onBack} className="mr-4 text-slate-400 hover:text-white transition-colors">&larr; Back to Messages</button>
           <div className="flex -space-x-2 overflow-hidden mr-3">
             {conversation.participants.slice(0, 3).map(p => (
               <img key={p.id} className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-800" src={p.avatar} alt={p.name} />
             ))}
           </div>
          <h2 className="text-xl font-bold">{chatTitle}</h2>
        </div>
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="space-y-4">
          {conversation.messages.map((msg) => {
            const isSentByUser = msg.senderId === currentUser.id;
            const otherParticipantIds = otherParticipants.map(p => p.id);
            const isRead = msg.readBy && otherParticipantIds.every(id => msg.readBy?.[id]);

            return (
                <div key={msg.id} className={`flex items-end gap-3 ${isSentByUser ? 'justify-end' : 'justify-start'}`}>
                {!isSentByUser && (
                    <img src={conversation.participants.find(p => p.id === msg.senderId)?.avatar} alt={msg.senderName} className="h-8 w-8 rounded-full self-start flex-shrink-0"/>
                )}
                <div className={`flex flex-col max-w-lg ${isSentByUser ? 'items-end' : 'items-start'}`}>
                    <div className={`px-4 py-2.5 rounded-2xl shadow-md ${isSentByUser ? 'bg-gradient-to-br from-indigo-600 to-indigo-700 text-white rounded-br-none' : 'bg-slate-700 text-slate-100 rounded-bl-none'}`}>
                    {!isSentByUser && <p className="text-xs font-bold text-indigo-300 mb-1">{msg.senderName}</p>}
                    <p className="text-sm break-words whitespace-pre-wrap">{msg.text}</p>
                    </div>
                    <div className="text-xs text-slate-500 mt-1.5 px-1 flex items-center gap-1.5">
                      <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</span>
                      {isSentByUser && (
                        isRead ? <CheckDoubleIcon className="h-4 w-4 text-teal-400" /> : <CheckIcon className="h-4 w-4 text-slate-500" />
                      )}
                    </div>
                </div>
                </div>
            )
          })}
          {isOtherUserTyping && (
            <div className="flex items-end gap-3 justify-start">
              <img src={otherParticipants[0]?.avatar} alt="typing user" className="h-8 w-8 rounded-full self-start flex-shrink-0"/>
              <div className="flex flex-col max-w-lg items-start">
                <div className="px-4 py-3 rounded-2xl shadow-md bg-slate-700 text-slate-100 rounded-bl-none">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 bg-slate-400 rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                    <span className="h-2 w-2 bg-slate-400 rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                    <span className="h-2 w-2 bg-slate-400 rounded-full animate-pulse"></span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {renderIcebreakers()}

      <div className="p-4 bg-slate-950/50 border-t border-slate-700/60">
        <form onSubmit={handleSendMessage} className="flex items-center gap-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => handleTypingChange(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 w-full px-4 py-2.5 bg-slate-800 text-white rounded-full border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />
          <button
            type="submit"
            className="flex items-center justify-center h-11 w-11 bg-indigo-600 text-white rounded-full hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500 transition-colors flex-shrink-0"
            aria-label="Send message"
          >
            <PaperAirplaneIcon className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;
