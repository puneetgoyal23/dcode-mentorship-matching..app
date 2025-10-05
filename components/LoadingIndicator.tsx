import React from 'react';
import SpinnerIcon from './icons/SpinnerIcon';

interface LoadingIndicatorProps {
  isLoading: boolean;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ isLoading }) => {
  if (!isLoading) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex flex-col items-center justify-center z-[9999]">
      <SpinnerIcon className="h-12 w-12 text-indigo-400" />
      <p className="mt-4 text-lg font-semibold text-slate-200">Loading...</p>
    </div>
  );
};

export default LoadingIndicator;
