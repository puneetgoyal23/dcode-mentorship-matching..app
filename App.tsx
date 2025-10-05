import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { UserProfile, Conversation, View, Community, CommunityPost, CommunityReply, ChatMessage } from './types';
import { MOCK_USERS, MOCK_COMMUNITIES } from './constants';
import Header from './components/Header';
import Login from './components/Login';
import ProfileSetup from './components/ProfileSetup';
import Dashboard from './components/Dashboard';
import ChatWindow from './components/ChatWindow';
import FeedbackModal from './components/FeedbackModal';
import CommunityDashboard from './components/CommunityDashboard';
import MentorList from './components/MentorList';
import MenteeList from './components/MenteeList';
import LogoutConfirmationModal from './components/LogoutConfirmationModal';
import AIAssistantChatWindow from './components/AIAssistantChatWindow';
import { getAIAssistantResponse } from './services/geminiService';
import LoadingIndicator from './components/LoadingIndicator';
import ChatListView from './components/ChatListView';

const USERS_STORAGE_KEY = 'dcode-app-users';
const CONVERSATIONS_STORAGE_KEY = 'dcode-app-conversations';

// Function to get initial users from localStorage or fall back to mock data
const getInitialUsers = (): UserProfile[] => {
  try {
    const storedUsers = window.localStorage.getItem(USERS_STORAGE_KEY);
    if (storedUsers) {
      return JSON.parse(storedUsers);
    }
  } catch (error) {
    console.error("Failed to parse users from localStorage:", error);
  }
  // If nothing in localStorage or parsing fails, initialize with mock data
  window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(MOCK_USERS));
  return MOCK_USERS;
};

// Function to get initial conversations from localStorage
const getInitialConversations = (): { [id: string]: Conversation } => {
  try {
    const storedConversations = window.localStorage.getItem(CONVERSATIONS_STORAGE_KEY);
    if (storedConversations) {
      const parsed = JSON.parse(storedConversations);
      // Revive date strings back into Date objects
      Object.values(parsed).forEach((convo: any) => {
        if (convo.messages) {
            convo.messages.forEach((msg: any) => {
                msg.timestamp = new Date(msg.timestamp);
            });
        }
      });
      return parsed;
    }
  } catch (error) {
    console.error("Failed to parse conversations from localStorage:", error);
  }
  return {};
};


const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [allUsers, setAllUsers] = useState<UserProfile[]>(getInitialUsers);
  const [currentView, setCurrentView] = useState<View>(View.LOGIN);
  
  // Chat state
  const [conversations, setConversations] = useState<{ [id: string]: Conversation }>(getInitialConversations);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [aiAssistantConversation, setAIAssistantConversation] = useState<ChatMessage[]>([]);
  
  // Modal states
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isAppLoading, setIsAppLoading] = useState(false);

  // Community state
  const [communities, setCommunities] = useState<Community[]>(MOCK_COMMUNITIES);
  const [activeCommunity, setActiveCommunity] = useState<Community | null>(null);

  // Effect to save users to localStorage whenever they change
  useEffect(() => {
    try {
      window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(allUsers));
    } catch (error) {
      console.error("Failed to save users to localStorage:", error);
    }
  }, [allUsers]);

  // Effect to save conversations to localStorage whenever they change
  useEffect(() => {
    try {
      window.localStorage.setItem(CONVERSATIONS_STORAGE_KEY, JSON.stringify(conversations));
    } catch (error) {
      console.error("Failed to save conversations to localStorage:", error);
    }
  }, [conversations]);

  // Effect to listen for storage changes from other tabs to enable real-time chat
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === CONVERSATIONS_STORAGE_KEY && event.newValue) {
        try {
          const newConversations = JSON.parse(event.newValue);
          // Revive date strings back into Date objects
          Object.values(newConversations).forEach((convo: any) => {
            if (convo.messages) {
                convo.messages.forEach((msg: any) => {
                    msg.timestamp = new Date(msg.timestamp);
                });
            }
          });
          setConversations(newConversations);
        } catch (error) {
          console.error("Failed to parse conversations from storage event:", error);
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const totalUnreadCount = useMemo(() => {
    if (!currentUser) return 0;
    return Object.values(conversations).reduce((total, convo) => {
      const unreadInConvo = convo.messages.filter(msg => 
        msg.senderId !== currentUser.id && (!msg.readBy || !msg.readBy[currentUser.id])
      ).length;
      return total + unreadInConvo;
    }, 0);
  }, [conversations, currentUser]);
  
  const handleLogin = useCallback((user: UserProfile) => {
    setCurrentUser(user);
    if (user.skills.length === 0) {
      setCurrentView(View.PROFILE_SETUP);
    } else {
      setCurrentView(View.DASHBOARD);
    }
  }, []);

  const handleUserUpdate = useCallback((updatedUser: UserProfile) => {
    if (currentUser?.id === updatedUser.id) {
        setCurrentUser(updatedUser);
    }
    setAllUsers(prevUsers => 
      prevUsers.map(u => u.id === updatedUser.id ? updatedUser : u)
    );
    if (currentView === View.PROFILE_SETUP) {
        setCurrentView(View.DASHBOARD);
    }
  }, [currentUser, currentView]);

  const handleUserAdded = useCallback((newUser: UserProfile) => {
    setAllUsers(prevUsers => [...prevUsers, newUser]);
  }, []);

  // Navigation Handlers
  const handleNavigateToDashboard = useCallback(() => {
    setActiveConversationId(null);
    setActiveCommunity(null);
    setCurrentView(View.DASHBOARD);
  }, []);
  
  const handleNavigateToCommunities = useCallback(() => {
    setActiveConversationId(null);
    setActiveCommunity(null);
    setCurrentView(View.COMMUNITIES);
  }, []);

  const handleNavigateToMentors = useCallback(() => {
    setActiveConversationId(null);
    setActiveCommunity(null);
    setCurrentView(View.MENTORS);
  }, []);

  const handleNavigateToMentees = useCallback(() => {
    setActiveConversationId(null);
    setActiveCommunity(null);
    setCurrentView(View.MENTEES);
  }, []);
  
  const handleNavigateToChatsList = useCallback(() => {
    setActiveConversationId(null);
    setActiveCommunity(null);
    setCurrentView(View.CHATS_LIST);
  }, []);

  const handleNavigateToProfileSetup = useCallback(() => {
    setCurrentView(View.PROFILE_SETUP);
  }, []);

  const handleNavigateToAIAssistant = useCallback(() => {
    setCurrentView(View.AI_ASSISTANT_CHAT);
  }, []);

  // Chat Handlers
  const handleSelectConversation = useCallback((conversationId: string) => {
    setActiveConversationId(conversationId);
    setCurrentView(View.CHAT);
  }, []);

  const handleStartChat = useCallback((participants: UserProfile[]) => {
    if (!currentUser) return;
    
    const conversationId = [currentUser.id, ...participants.map(p => p.id)].sort().join('-');
    
    if (!conversations[conversationId]) {
      const newConversation: Conversation = {
        id: conversationId,
        participants: [currentUser, ...participants],
        messages: [],
        isGroupChat: participants.length > 1,
      };
      setConversations(prev => ({
        ...prev,
        [conversationId]: newConversation,
      }));
    }
    
    setActiveConversationId(conversationId);
    setCurrentView(View.CHAT);
  }, [currentUser, conversations]);

  const handleSendChatMessage = (messageText: string) => {
    if (!currentUser || !activeConversationId) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      text: messageText,
      timestamp: new Date(),
      readBy: { [currentUser.id]: true }, // Mark as read by sender
    };

    setConversations(prev => {
      const currentConversation = prev[activeConversationId];
      if (!currentConversation) return prev;

      const updatedConversation: Conversation = {
        ...currentConversation,
        messages: [...currentConversation.messages, userMessage],
      };

      return {
        ...prev,
        [activeConversationId]: updatedConversation,
      };
    });
  };

  const handleMarkAsRead = useCallback((conversationId: string) => {
    if (!currentUser) return;
    const currentUserId = currentUser.id;

    setConversations(prev => {
      const conversation = prev[conversationId];
      if (!conversation) return prev;

      let hasChanges = false;
      const updatedMessages = conversation.messages.map(msg => {
        if (msg.senderId !== currentUserId && (!msg.readBy || !msg.readBy[currentUserId])) {
          hasChanges = true;
          return {
            ...msg,
            readBy: {
              ...(msg.readBy || {}),
              [currentUserId]: true,
            },
          };
        }
        return msg;
      });

      if (!hasChanges) {
        return prev;
      }
      
      const updatedConversation = {
        ...conversation,
        messages: updatedMessages,
      };

      return {
        ...prev,
        [conversationId]: updatedConversation,
      };
    });
  }, [currentUser]);

  const handleSendAIAssistantMessage = async (messageText: string) => {
    if (!currentUser) return;
    
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      text: messageText,
      timestamp: new Date(),
    };

    const updatedHistory = [...aiAssistantConversation, userMessage];
    setAIAssistantConversation(updatedHistory);
    
    setIsAppLoading(true);
    try {
      const aiResponseText = await getAIAssistantResponse(updatedHistory);

      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        senderId: 'ai-assistant',
        senderName: 'DCODE AI',
        text: aiResponseText,
        timestamp: new Date(),
      };
      
      setAIAssistantConversation(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("AI Assistant API call failed:", error);
      // Optionally add an error message to the chat
    } finally {
      setIsAppLoading(false);
    }
  };

  // Logout Handler
  const handleLogout = useCallback(() => {
    setCurrentUser(null);
    setActiveConversationId(null);
    setActiveCommunity(null);
    setAIAssistantConversation([]);
    setCurrentView(View.LOGIN);
    setIsLogoutModalOpen(false);
  }, []);

  // Feedback Handlers
  const handleFeedbackSubmit = useCallback((feedback: string) => {
    console.log("--- User Feedback Received ---");
    console.log(feedback);
    console.log(`User: ${currentUser?.name} (${currentUser?.id})`);
    console.log("----------------------------");
    setIsFeedbackModalOpen(false);
  }, [currentUser]);

  // Community Handlers
  const handleCreateCommunity = useCallback((name: string, description: string) => {
    if (!currentUser) return;
    const newCommunity: Community = {
      id: `comm-${Date.now()}`,
      name,
      description,
      memberIds: [currentUser.id],
      posts: [],
    };
    setCommunities(prev => [newCommunity, ...prev]);
  }, [currentUser]);
  
  const handleJoinCommunity = useCallback((communityId: string) => {
    if (!currentUser) return;
    setCommunities(prev => prev.map(c => 
      c.id === communityId ? { ...c, memberIds: [...c.memberIds, currentUser.id] } : c
    ));
  }, [currentUser]);

  const handleViewCommunity = useCallback((communityId: string) => {
    const community = communities.find(c => c.id === communityId);
    if (community) {
      setActiveCommunity(community);
    }
  }, [communities]);

  const handleBackToCommunitiesList = useCallback(() => {
    setActiveCommunity(null);
  }, []);

  const handlePostToCommunity = useCallback((communityId: string, text: string) => {
    if (!currentUser) return;
    const newPost: CommunityPost = {
      id: `post-${Date.now()}`,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      text,
      timestamp: new Date(),
      replies: [],
    };
    const updatedCommunities = communities.map(c => {
      if (c.id === communityId) {
        return { ...c, posts: [newPost, ...c.posts] };
      }
      return c;
    });
    setCommunities(updatedCommunities);
    setActiveCommunity(updatedCommunities.find(c => c.id === communityId) || null);
  }, [currentUser, communities]);

  const handleReplyToPost = useCallback((communityId: string, postId: string, text: string) => {
    if (!currentUser) return;
    const newReply: CommunityReply = {
      id: `reply-${Date.now()}`,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      text,
      timestamp: new Date(),
    };
    const updatedCommunities = communities.map(c => {
      if (c.id === communityId) {
        const updatedPosts = c.posts.map(p => {
          if (p.id === postId) {
            return { ...p, replies: [...p.replies, newReply] };
          }
          return p;
        });
        return { ...c, posts: updatedPosts };
      }
      return c;
    });
    setCommunities(updatedCommunities);
    setActiveCommunity(updatedCommunities.find(c => c.id === communityId) || null);
  }, [currentUser, communities]);

  const renderContent = () => {
    if (!currentUser) {
      return <Login onLogin={handleLogin} users={allUsers} onUserAdded={handleUserAdded} />;
    }

    switch (currentView) {
      case View.PROFILE_SETUP:
        return <ProfileSetup user={currentUser} onProfileUpdate={handleUserUpdate} />;
      case View.DASHBOARD:
        return <Dashboard
          currentUser={currentUser}
          allUsers={allUsers}
          onStartChat={handleStartChat}
          onUserUpdate={handleUserUpdate}
          onNavigateToCommunities={handleNavigateToCommunities}
          onNavigateToProfileSetup={handleNavigateToProfileSetup}
          onNavigateToAIAssistant={handleNavigateToAIAssistant}
          onSetIsLoading={setIsAppLoading}
        />;
      case View.CHATS_LIST:
        return <ChatListView
          conversations={Object.values(conversations)}
          currentUser={currentUser}
          onSelectConversation={handleSelectConversation}
        />;
      case View.CHAT: {
        const activeConversation = activeConversationId ? conversations[activeConversationId] : null;
        if (activeConversation) {
          return <ChatWindow 
            conversation={activeConversation} 
            currentUser={currentUser} 
            onBack={handleNavigateToChatsList} 
            onSendMessage={handleSendChatMessage}
            onMarkAsRead={handleMarkAsRead}
          />;
        }
        setCurrentView(View.DASHBOARD); // Fallback
        return null;
      }
      case View.AI_ASSISTANT_CHAT:
        return <AIAssistantChatWindow
          conversation={aiAssistantConversation}
          currentUser={currentUser}
          onSendMessage={handleSendAIAssistantMessage}
          onBack={handleNavigateToDashboard}
          isLoading={isAppLoading}
        />;
      case View.MENTORS:
        return <MentorList
          currentUser={currentUser}
          allUsers={allUsers}
          onStartChat={handleStartChat}
          onUserUpdate={handleUserUpdate}
        />;
      case View.MENTEES:
         return <MenteeList
          currentUser={currentUser}
          allUsers={allUsers}
          onStartChat={handleStartChat}
        />;
      case View.COMMUNITIES:
        return <CommunityDashboard
          currentUser={currentUser}
          allUsers={allUsers}
          allCommunities={communities}
          activeCommunity={activeCommunity}
          onViewCommunity={handleViewCommunity}
          onJoinCommunity={handleJoinCommunity}
          onCreateCommunity={handleCreateCommunity}
          onBackToList={handleBackToCommunitiesList}
          onPostSubmit={handlePostToCommunity}
          onReplySubmit={handleReplyToPost}
        />;
      default:
        return <Login onLogin={handleLogin} users={allUsers} onUserAdded={handleUserAdded} />;
    }
  };

  return (
    <div className="min-h-screen">
      <LoadingIndicator isLoading={isAppLoading} />
      <Header 
        currentUser={currentUser} 
        onLogout={() => setIsLogoutModalOpen(true)} 
        currentView={currentView}
        totalUnreadCount={totalUnreadCount}
        onOpenFeedback={() => setIsFeedbackModalOpen(true)}
        onNavigateToDashboard={handleNavigateToDashboard}
        onNavigateToMentors={handleNavigateToMentors}
        onNavigateToMentees={handleNavigateToMentees}
        onNavigateToCommunities={handleNavigateToCommunities}
        onNavigateToChatsList={handleNavigateToChatsList}
      />
      <main className="container mx-auto p-4 md:p-8 relative z-10">
        <div className="pt-20 md:pt-24"> {/* Offset for sticky header */}
            {renderContent()}
        </div>
      </main>
      {isFeedbackModalOpen && (
        <FeedbackModal
          onClose={() => setIsFeedbackModalOpen(false)}
          onSubmit={handleFeedbackSubmit}
        />
      )}
      {isLogoutModalOpen && (
        <LogoutConfirmationModal
          onClose={() => setIsLogoutModalOpen(false)}
          onConfirm={handleLogout}
        />
      )}
    </div>
  );
};

export default App;
