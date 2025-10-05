import React, { useState, useCallback, useMemo } from 'react';
import { UserProfile, UserRole, MatchResult } from '../types';
import ProfileCard from './ProfileCard';
import { suggestMatches } from '../services/geminiService';
import SparklesIcon from './icons/SparklesIcon';
import BookingCalendar from './BookingCalendar';
import RatingModal from './RatingModal';
import UsersIcon from './icons/UsersIcon';
import UserIcon from './icons/UserIcon';
import ChatBubbleLeftRightIcon from './icons/ChatBubbleLeftRightIcon';

interface DashboardProps {
  currentUser: UserProfile;
  allUsers: UserProfile[];
  onStartChat: (participants: UserProfile[]) => void;
  onUserUpdate: (user: UserProfile) => void;
  onNavigateToCommunities: () => void;
  onNavigateToProfileSetup: () => void;
  onNavigateToAIAssistant: () => void;
  onSetIsLoading: (isLoading: boolean) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ currentUser, allUsers, onStartChat, onUserUpdate, onNavigateToCommunities, onNavigateToProfileSetup, onNavigateToAIAssistant, onSetIsLoading }) => {
  const [suggestedMentors, setSuggestedMentors] = useState<{ profile: UserProfile, reason: string }[]>([]);
  
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingMentor, setBookingMentor] = useState<UserProfile | null>(null);

  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [ratingMentor, setRatingMentor] = useState<UserProfile | null>(null);

  const mentors = useMemo(() => allUsers.filter(u => (u.role === UserRole.MENTOR || u.role === UserRole.BOTH) && u.id !== currentUser.id), [allUsers, currentUser.id]);
  const myMentees = useMemo(() => allUsers.filter(u => (u.role === UserRole.MENTEE || u.role === UserRole.BOTH) && u.id !== currentUser.id), [allUsers, currentUser.id]);

  // Booking Modal Handlers
  const handleOpenBookingModal = (mentor: UserProfile) => {
    setBookingMentor(mentor);
    setIsBookingModalOpen(true);
  };
  const handleCloseBookingModal = () => {
    setBookingMentor(null);
    setIsBookingModalOpen(false);
  };
  const handleConfirmBooking = (mentor: UserProfile, date: Date, time: string) => {
    console.log(`Booking confirmed with ${mentor.name} on ${date.toDateString()} at ${time}.`);
    setTimeout(() => {
        handleCloseBookingModal();
    }, 2000);
  };

  // Rating Modal Handlers
  const handleOpenRatingModal = (mentor: UserProfile) => {
    setRatingMentor(mentor);
    setIsRatingModalOpen(true);
  };
  const handleCloseRatingModal = () => {
    setRatingMentor(null);
    setIsRatingModalOpen(false);
  };
  const handleConfirmRating = (mentorToRate: UserProfile, rating: number, review: string) => {
      // FIX: Corrected typo from `mentorTorate` to `mentorToRate`.
      const oldRatingTotal = (mentorToRate.rating || 0) * (mentorToRate.ratingCount || 0);
      const newRatingCount = (mentorToRate.ratingCount || 0) + 1;
      const newAverageRating = (oldRatingTotal + rating) / newRatingCount;

      const updatedMentor: UserProfile = {
          ...mentorToRate,
          rating: newAverageRating,
          ratingCount: newRatingCount,
      };
      
      onUserUpdate(updatedMentor);
      console.log(`Rated ${mentorToRate.name} with ${rating} stars. Review: ${review}`);
      
      setTimeout(() => {
          handleCloseRatingModal();
      }, 2000);
  };

  const findMatches = useCallback(async () => {
    onSetIsLoading(true);
    setSuggestedMentors([]);
    try {
      const results: MatchResult[] = await suggestMatches(currentUser, mentors);
      const matchedProfiles = results
        .map(result => {
          const profile = mentors.find(m => m.id === result.mentorId);
          return profile ? { profile, reason: result.reason } : null;
        })
        .filter((match): match is { profile: UserProfile, reason: string } => match !== null);
        
      setSuggestedMentors(matchedProfiles);
    } catch (error) {
      console.error("Failed to find matches:", error);
    } finally {
      onSetIsLoading(false);
    }
  }, [currentUser, mentors, onSetIsLoading]);
  
  const ProfileCompletionPrompt = () => {
    const totalSkillsAndInterests = (currentUser.skills?.length || 0) + (currentUser.interests?.length || 0);

    if (totalSkillsAndInterests >= 3) {
      return null;
    }

    return (
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl shadow-lg p-6 mb-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border border-slate-700">
        <div className="flex items-center gap-5 text-left">
          <div className="bg-indigo-500/10 p-4 rounded-full flex-shrink-0 ring-1 ring-indigo-500/30">
            <UserIcon className="h-8 w-8 text-indigo-300" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Enhance Your Profile</h3>
            <p className="text-slate-400 mt-1 max-w-md">Add more skills or interests for better mentor recommendations.</p>
          </div>
        </div>
        <button
          onClick={onNavigateToProfileSetup}
          className="btn btn-secondary flex-shrink-0"
        >
          Edit Profile
        </button>
      </div>
    );
  };

  const PromoCards = () => (
    <div className="grid md:grid-cols-2 gap-8 mb-12">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl shadow-lg p-6 flex flex-col items-start gap-6 border border-slate-700">
        <div className="flex items-center gap-5 text-left">
          <div className="bg-teal-500/10 p-4 rounded-full flex-shrink-0 ring-1 ring-teal-500/30">
            <UsersIcon className="h-8 w-8 text-teal-300" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">Explore Communities</h3>
            <p className="text-slate-400 mt-1 max-w-md">Join groups to connect with peers, ask questions, and grow together.</p>
          </div>
        </div>
        <button
          onClick={onNavigateToCommunities}
          className="btn bg-teal-600 hover:bg-teal-500 text-white mt-auto"
        >
          Go to Hub
        </button>
      </div>
       <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl shadow-lg p-6 flex flex-col items-start gap-6 border border-slate-700">
        <div className="flex items-center gap-5 text-left">
          <div className="bg-purple-500/10 p-4 rounded-full flex-shrink-0 ring-1 ring-purple-500/30">
            <ChatBubbleLeftRightIcon className="h-8 w-8 text-purple-300" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">Ask DCODE AI</h3>
            <p className="text-slate-400 mt-1 max-w-md">Get instant advice on mentorship, open-source practices, and more.</p>
          </div>
        </div>
        <button
          onClick={onNavigateToAIAssistant}
          className="btn bg-purple-600 hover:bg-purple-500 text-white mt-auto"
        >
          Start Chat
        </button>
      </div>
    </div>
  );

  const renderMenteeDashboard = () => (
    <div>
      <div className="text-left mb-12">
        <h2 className="text-4xl font-extrabold text-white">Welcome, {currentUser.name}</h2>
        <p className="mt-4 text-lg text-slate-400">Ready to find your mentor and accelerate your growth?</p>
      </div>

      <ProfileCompletionPrompt />

      <PromoCards />

      <div className="text-left mb-8">
        <button
          onClick={findMatches}
          className="inline-flex items-center px-8 py-4 font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500 transition-all transform hover:scale-105"
        >
          <SparklesIcon className="h-6 w-6 mr-3"/>
          Get AI-Powered Matches
        </button>
      </div>
      
      {suggestedMentors.length > 0 && (
        <div>
            <h3 className="text-3xl font-bold mb-6 text-left text-white">Recommended Mentors For You</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {suggestedMentors.map(({ profile, reason }) => (
                <ProfileCard 
                    key={profile.id} 
                    user={profile} 
                    currentUserRole={currentUser.role}
                    onStartChat={() => onStartChat([profile])} 
                    onBookSession={() => handleOpenBookingModal(profile)}
                    onRateSession={() => handleOpenRatingModal(profile)}
                    matchReason={reason} 
                />
            ))}
            </div>
        </div>
      )}
    </div>
  );
  
  const renderMentorDashboard = () => (
     <div>
      <div className="text-left mb-12">
        <h2 className="text-4xl font-extrabold text-white">Welcome Back, {currentUser.name}!</h2>
        <p className="mt-4 text-lg text-slate-400">Guide and support the next generation of developers.</p>
      </div>

      <ProfileCompletionPrompt />

      <PromoCards />

       <h3 className="text-3xl font-bold mt-12 mb-6 text-left text-white">Your Mentees</h3>
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
         {myMentees.map(mentee => (
           <ProfileCard 
                key={mentee.id} 
                user={mentee} 
                currentUserRole={currentUser.role}
                onStartChat={() => onStartChat([mentee])} 
                onBookSession={() => {}}
                onRateSession={() => {}}
            />
         ))}
       </div>
     </div>
  );

  const renderBothDashboard = () => (
    <div>
      <div className="text-left mb-12">
        <h2 className="text-4xl font-extrabold text-white">Welcome, {currentUser.name}</h2>
        <p className="mt-4 text-lg text-slate-400">Embrace both sides of your journey: learning and guiding.</p>
      </div>

      <ProfileCompletionPrompt />
      
      <PromoCards />

      {/* Mentee Section */}
      <div className="text-left my-8">
        <button
          onClick={findMatches}
          className="inline-flex items-center px-8 py-4 font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500 transition-all transform hover:scale-105"
        >
          <SparklesIcon className="h-6 w-6 mr-3"/>
          Find Mentors
        </button>
      </div>
      
      {suggestedMentors.length > 0 && (
        <div className="mb-16">
            <h3 className="text-3xl font-bold mb-6 text-left text-white">Recommended Mentors For You</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {suggestedMentors.map(({ profile, reason }) => (
                <ProfileCard 
                    key={profile.id} 
                    user={profile} 
                    currentUserRole={currentUser.role}
                    onStartChat={() => onStartChat([profile])} 
                    onBookSession={() => handleOpenBookingModal(profile)}
                    onRateSession={() => handleOpenRatingModal(profile)}
                    matchReason={reason} 
                />
            ))}
            </div>
        </div>
      )}

      {/* Mentor Section */}
      <div className="border-t border-slate-700 pt-12">
        <h3 className="text-3xl font-bold mb-6 text-left text-white">Your Mentees</h3>
        {myMentees.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {myMentees.map(mentee => (
                <ProfileCard 
                        key={mentee.id} 
                        user={mentee} 
                        currentUserRole={currentUser.role}
                        onStartChat={() => onStartChat([mentee])} 
                        onBookSession={() => {}}
                        onRateSession={() => {}}
                    />
                ))}
            </div>
        ) : (
            <p className="text-slate-500">You don't have any mentees yet.</p>
        )}
      </div>
    </div>
  );

  const renderCurrentDashboard = () => {
    switch(currentUser.role) {
      case UserRole.MENTEE:
        return renderMenteeDashboard();
      case UserRole.MENTOR:
        return renderMentorDashboard();
      case UserRole.BOTH:
        return renderBothDashboard();
      default:
        return <p>Invalid user role.</p>;
    }
  }

  return (
    <>
      {renderCurrentDashboard()}
      
      {isBookingModalOpen && bookingMentor && (
        <BookingCalendar
          mentor={bookingMentor}
          onClose={handleCloseBookingModal}
          onConfirm={handleConfirmBooking}
        />
      )}

      {isRatingModalOpen && ratingMentor && (
        <RatingModal
            mentor={ratingMentor}
            onClose={handleCloseRatingModal}
            onSubmit={handleConfirmRating}
        />
      )}
    </>
  );
};

export default Dashboard;