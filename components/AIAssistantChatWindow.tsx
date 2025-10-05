import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, ChatMessage } from '../types';
import CodeIcon from './icons/CodeIcon';
import PaperAirplaneIcon from './icons/PaperAirplaneIcon';

interface AIAssistantChatWindowProps {
  conversation: ChatMessage[];
  currentUser: UserProfile;
  onSendMessage: (messageText: string) => Promise<void>;
  onBack: () => void;
  isLoading: boolean;
}

const AIAssistantChatWindow: React.FC<AIAssistantChatWindowProps> = ({ conversation, currentUser, onSendMessage, onBack, isLoading }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(conversation);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // Update messages when conversation prop changes
  useEffect(() => {
    setMessages(conversation);
  }, [conversation]);

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '' || isLoading) return;
    
    const textToSend = newMessage;
    setNewMessage('');
    
    await onSendMessage(textToSend);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-180px)] max-w-4xl mx-auto bg-slate-900/80 backdrop-blur-lg rounded-xl shadow-2xl overflow-hidden border border-slate-700/60">
      <div className="p-4 bg-slate-950/50 backdrop-blur-sm flex items-center justify-between border-b border-slate-700/60 flex-shrink-0">
        <div className="flex items-center">
          <button onClick={onBack} className="mr-4 text-slate-400 hover:text-white transition-colors">&larr; Back</button>
           <div className="flex items-center justify-center h-8 w-8 rounded-full bg-indigo-500/20 ring-1 ring-indigo-500/30 mr-3">
             <CodeIcon className="h-5 w-5 text-indigo-300" />
           </div>
          <h2 className="text-xl font-bold">DCODE AI Assistant</h2>
        </div>
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex items-end gap-3 ${msg.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}>
              {msg.senderId !== currentUser.id && (
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-indigo-500/20 flex-shrink-0 self-start ring-1 ring-indigo-500/30">
                    <CodeIcon className="h-5 w-5 text-indigo-300" />
                </div>
              )}
              <div className={`flex flex-col max-w-lg ${msg.senderId === currentUser.id ? 'items-end' : 'items-start'}`}>
                <div className={`px-4 py-2.5 rounded-2xl shadow-md ${msg.senderId === currentUser.id ? 'bg-gradient-to-br from-indigo-600 to-indigo-700 text-white rounded-br-none' : 'bg-slate-700 text-slate-100 rounded-bl-none'}`}>
                   {msg.senderId !== currentUser.id && <p className="text-xs font-bold text-indigo-300 mb-1">{msg.senderName}</p>}
                  <p className="text-sm break-words whitespace-pre-wrap">{msg.text}</p>
                </div>
                <p className="text-xs text-slate-500 mt-1.5 px-1">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      <div className="p-4 bg-slate-950/50 border-t border-slate-700/60">
        <form onSubmit={handleSendMessage} className="flex items-center gap-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Ask about mentorship, open source, etc."
            className="flex-1 w-full px-4 py-2.5 bg-slate-800 text-white rounded-full border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />
          <button
            type="submit"
            disabled={isLoading || newMessage.trim() === ''}
            className="flex items-center justify-center h-11 w-11 bg-indigo-600 text-white rounded-full hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500 transition-colors flex-shrink-0 disabled:bg-slate-700 disabled:cursor-not-allowed"
            aria-label="Send message"
          >
            <PaperAirplaneIcon className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIAssistantChatWindow;
