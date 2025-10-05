import React, { useState } from 'react';
import PaperAirplaneIcon from './icons/PaperAirplaneIcon';

interface FeedbackModalProps {
  onClose: () => void;
  onSubmit: (feedback: string) => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ onClose, onSubmit }) => {
  const [feedback, setFeedback] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (feedback.trim() === '') return;
    setIsSubmitted(true);
    // Simulate API call and wait for confirmation screen
    setTimeout(() => {
      onSubmit(feedback);
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
          <h3 className="text-2xl font-bold text-white">Feedback Submitted!</h3>
          <p className="text-slate-400 mt-2">
            Thank you for helping us improve the DCODE Mentorship platform.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-slate-900/80 backdrop-blur-lg p-6 rounded-xl shadow-2xl w-full max-w-lg border border-slate-700/60" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white">Share Your Feedback</h2>
            <p className="text-slate-400 mt-1">Have a suggestion or found a bug? Let us know!</p>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors text-2xl font-bold">&times;</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="feedback" className="sr-only">
              Your Feedback
            </label>
            <textarea
              id="feedback"
              rows={6}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Tell us what you think..."
              className="w-full form-input"
              required
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
              disabled={feedback.trim() === ''}
              className="btn btn-primary"
            >
              <PaperAirplaneIcon className="h-5 w-5 mr-2 -ml-1"/>
              Submit 
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackModal;
