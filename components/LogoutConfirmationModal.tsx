import React from 'react';
import ExclamationTriangleIcon from './icons/ExclamationTriangleIcon';

interface LogoutConfirmationModalProps {
  onClose: () => void;
  onConfirm: () => void;
}

const LogoutConfirmationModal: React.FC<LogoutConfirmationModalProps> = ({ onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-slate-900/80 backdrop-blur-lg p-8 rounded-xl shadow-2xl w-full max-w-md border border-slate-700/60" onClick={e => e.stopPropagation()}>
        <div className="flex items-start space-x-4">
          <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-900/50 sm:mx-0">
            <ExclamationTriangleIcon className="h-6 w-6 text-red-400" aria-hidden="true" />
          </div>
          <div className="mt-0 text-left">
            <h3 className="text-lg leading-6 font-bold text-white" id="modal-title">
              Confirm Logout
            </h3>
            <div className="mt-2">
              <p className="text-sm text-slate-400">
                Are you sure you want to log out? You will be returned to the login screen.
              </p>
            </div>
          </div>
        </div>
        <div className="mt-8 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="btn bg-red-600 hover:bg-red-700 text-white font-semibold"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutConfirmationModal;
