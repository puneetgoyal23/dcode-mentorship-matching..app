import React, { useState } from 'react';

interface CreateCommunityModalProps {
  onClose: () => void;
  onCreate: (name: string, description: string) => void;
}

const CreateCommunityModal: React.FC<CreateCommunityModalProps> = ({ onClose, onCreate }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && description.trim()) {
      onCreate(name, description);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-slate-900/80 backdrop-blur-lg p-6 rounded-xl shadow-2xl w-full max-w-lg border border-slate-700/60" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Create a New Community</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors text-2xl font-bold">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="comm-name" className="block text-sm font-medium text-slate-300 mb-1">Community Name</label>
            <input
              id="comm-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Python Developers"
              className="w-full form-input"
              required
            />
          </div>
          <div>
            <label htmlFor="comm-desc" className="block text-sm font-medium text-slate-300 mb-1">Description</label>
            <textarea
              id="comm-desc"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this community about?"
              className="w-full form-input"
              required
            />
          </div>
          <div className="flex justify-start gap-3 pt-4">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Create Community
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCommunityModal;
