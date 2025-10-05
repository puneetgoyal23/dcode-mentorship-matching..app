export enum UserRole {
  MENTOR = 'Mentor',
  MENTEE = 'Mentee',
  BOTH = 'Both',
}

export enum View {
  LOGIN = 'login',
  PROFILE_SETUP = 'profile_setup',
  DASHBOARD = 'dashboard',
  MENTORS = 'mentors',
  MENTEES = 'mentees',
  COMMUNITIES = 'communities',
  CHAT = 'chat',
  CHATS_LIST = 'chats_list',
  AI_ASSISTANT_CHAT = 'ai_assistant_chat',
}

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  avatar: string;
  skills: string[];
  interests: string[];
  bio: string;
  password?: string;
  rating?: number;
  ratingCount?: number;
  githubUrl?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: Date;
  readBy?: { [userId:string]: boolean };
}

export interface Conversation {
  id: string;
  participants: UserProfile[];
  messages: ChatMessage[];
  isGroupChat: boolean;
}

export interface MatchResult {
    mentorId: string;
    reason: string;
}

// Community Feature Types
export interface CommunityReply {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  text: string;
  timestamp: Date;
}

export interface CommunityPost {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  text: string;
  timestamp: Date;
  replies: CommunityReply[];
}

export interface Community {
  id: string;
  name: string;
  description: string;
  memberIds: string[];
  posts: CommunityPost[];
}
