import React, { useState } from 'react';
import { UserProfile } from '../types';
import StarIcon from './icons/StarIcon';

interface RatingModalProps {
  mentor: UserProfile;
  onClose: () => void;
  onSubmit: (mentor: UserProfile, rating: number, review: string) => void;
}

const RatingModal: React.FC<RatingModalProps> = ({ mentor, onClose, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;
    setIsSubmitted(true);
    // Simulate API call and wait for confirmation screen
    setTimeout(() => {
        onSubmit(mentor, rating, review);
    }, 1500);
  };

  if (isSubmitted) {
      return (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50">
              <div className="bg-slate-900 p-8 rounded-xl shadow-2xl text-center max-w-md border border-slate-700">
                 <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-500 mb-4">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                 </div>
                 <h3 className="text-2xl font-bold text-white">Thank You!</h3>
                 <p className="text-slate-400 mt-2">
                    Your feedback has been submitted and will help other mentees.
                 </p>
              </div>
          </div>
      )
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-slate-900/80 backdrop-blur-lg p-6 rounded-xl shadow-2xl w-full max-w-md border border-slate-700/60" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white">Rate your session with</h2>
            <p className="text-xl font-semibold text-indigo-400">{mentor.name}</p>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors text-2xl font-bold">&times;</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-400 mb-2">Your Rating</label>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <StarIcon
                  key={star}
                  className={`w-8 h-8 cursor-pointer transition-all ${
                    (hoverRating >= star || rating >= star) ? 'text-amber-400 scale-110' : 'text-slate-600 hover:text-slate-500'
                  }`}
                  filled={hoverRating >= star || rating >= star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                />
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="review" className="block text-sm font-medium text-slate-400 mb-2">
              Add a review (optional)
            </label>
            <textarea
              id="review"
              rows={4}
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="How was your session? What did you learn?"
              className="w-full px-4 py-2 bg-slate-800 text-white rounded-md border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
            />
          </div>

          <div className="flex justify-start gap-3">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={rating === 0}
              className="btn btn-primary"
            >
              Submit Feedback
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RatingModal;
