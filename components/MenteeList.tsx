import React, { useState, useCallback, useMemo } from 'react';
import { UserProfile, UserRole } from '../types';
import ProfileCard from './ProfileCard';
import { ALL_SKILLS } from '../constants';
import SearchIcon from './icons/SearchIcon';
import DocumentSearchIcon from './icons/DocumentSearchIcon';
import ChevronDownIcon from './icons/ChevronDownIcon';

interface MenteeListProps {
  currentUser: UserProfile;
  allUsers: UserProfile[];
  onStartChat: (participants: UserProfile[]) => void;
}

interface FilterControlsProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedSkills: string[];
  handleToggleSkill: (skill: string) => void;
  setSelectedSkills: (skills: string[]) => void;
  isSkillsExpanded: boolean;
  setIsSkillsExpanded: (isExpanded: boolean) => void;
  selectedInterests: string[];
  handleToggleInterest: (interest: string) => void;
  setSelectedInterests: (interests: string[]) => void;
  isInterestsExpanded: boolean;
  setIsInterestsExpanded: (isExpanded: boolean) => void;
}

const renderFilterPills = (
  title: string,
  items: string[],
  selectedValues: string[],
  onToggle: (value: string) => void,
  onClear: () => void,
  isExpanded: boolean,
  toggleExpand: () => void,
  color: 'indigo' | 'teal'
) => {
  const activeClasses = color === 'indigo' ? 'bg-indigo-600 text-white' : 'bg-teal-500 text-white';
  const inactiveClasses = 'bg-slate-700 text-slate-300 hover:bg-slate-600';
  const compactPillClasses = color === 'indigo' 
      ? 'bg-indigo-500/20 text-indigo-300' 
      : 'bg-teal-500/20 text-teal-300';
    
  return (
      <div>
          <button
              onClick={toggleExpand}
              className="w-full flex justify-between items-center py-2 text-left rounded-md"
              aria-expanded={isExpanded}
          >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider flex-shrink-0">{title}</h4>
                  {!isExpanded && selectedValues.length > 0 && (
                      <div className="flex items-center gap-1.5 truncate">
                          {selectedValues.slice(0, 2).map(value => (
                              <span key={value} className={`px-2 py-0.5 text-xs font-medium rounded-full whitespace-nowrap ${compactPillClasses}`}>
                                  {value}
                              </span>
                          ))}
                          {selectedValues.length > 2 && (
                              <span className="text-xs text-slate-400 flex-shrink-0">
                                  +{selectedValues.length - 2} more
                              </span>
                          )}
                      </div>
                  )}
              </div>
              <ChevronDownIcon className={`h-5 w-5 text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
          {isExpanded && (
              <div className="pt-2 flex flex-wrap gap-2">
                  <button
                      onClick={onClear}
                      className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                          selectedValues.length === 0 ? activeClasses : inactiveClasses
                      }`}
                  >
                      All
                  </button>
                  {items.map(item => (
                      <button
                          key={item}
                          onClick={() => onToggle(item)}
                          className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                              selectedValues.includes(item) ? activeClasses : inactiveClasses
                          }`}
                      >
                          {item}
                      </button>
                  ))}
              </div>
          )}
      </div>
  );
};

const FilterControls: React.FC<FilterControlsProps> = ({
  searchTerm,
  setSearchTerm,
  selectedSkills,
  handleToggleSkill,
  setSelectedSkills,
  isSkillsExpanded,
  setIsSkillsExpanded,
  selectedInterests,
  handleToggleInterest,
  setSelectedInterests,
  isInterestsExpanded,
  setIsInterestsExpanded,
}) => (
  <div className="mb-8 p-6 bg-slate-900/70 backdrop-blur-lg rounded-xl shadow-lg space-y-4 sticky top-28 z-40 border border-slate-700/60">
      <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <SearchIcon className="h-5 w-5 text-slate-400" />
          </span>
          <input
              type="text"
              placeholder="Search mentees by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-800 text-white rounded-md border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
              aria-label="Search by name"
          />
      </div>
      {renderFilterPills('Filter by Skill', ALL_SKILLS, selectedSkills, handleToggleSkill, () => setSelectedSkills([]), isSkillsExpanded, () => setIsSkillsExpanded(!isSkillsExpanded), 'indigo')}
      <div className="border-t border-slate-800"></div>
      {renderFilterPills('Filter by Interest', ALL_SKILLS, selectedInterests, handleToggleInterest, () => setSelectedInterests([]), isInterestsExpanded, () => setIsInterestsExpanded(!isInterestsExpanded), 'teal')}
  </div>
);

const MenteeList: React.FC<MenteeListProps> = ({ currentUser, allUsers, onStartChat }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [isSkillsExpanded, setIsSkillsExpanded] = useState(true);
  const [isInterestsExpanded, setIsInterestsExpanded] = useState(false);

  const mentees = useMemo(() => allUsers.filter(u => (u.role === UserRole.MENTEE || u.role === UserRole.BOTH) && u.id !== currentUser.id), [allUsers, currentUser.id]);

  const handleToggleSkill = useCallback((skill: string) => {
    setSelectedSkills(prev => 
        prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  }, []);
  
  const handleToggleInterest = useCallback((interest: string) => {
    setSelectedInterests(prev =>
        prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    );
  }, []);

  const filteredMentees = useMemo(() => {
    return mentees.filter(user => {
      const nameMatch = user.name.toLowerCase().includes(searchTerm.toLowerCase());
      const skillMatch = selectedSkills.length === 0 ? true : selectedSkills.every(skill => user.skills.includes(skill));
      const interestMatch = selectedInterests.length === 0 ? true : selectedInterests.every(interest => user.interests.includes(interest));
      return nameMatch && skillMatch && interestMatch;
    });
  }, [mentees, searchTerm, selectedSkills, selectedInterests]);

  const EmptyState = () => (
    <div className="text-center py-16 px-6 bg-slate-900 rounded-xl border-2 border-dashed border-slate-800">
        <DocumentSearchIcon className="mx-auto h-16 w-16 text-slate-600" />
        <h4 className="mt-4 text-xl font-semibold text-white">No Mentees Found</h4>
        <p className="text-slate-400 mt-2">Try adjusting your search or filter criteria.</p>
    </div>
  );
  
  return (
    <>
        <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold text-white">Browse All Mentees</h2>
            <p className="mt-4 text-lg text-slate-400">Connect with fellow learners and find collaborators.</p>
        </div>
        <FilterControls 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedSkills={selectedSkills}
          handleToggleSkill={handleToggleSkill}
          setSelectedSkills={setSelectedSkills}
          isSkillsExpanded={isSkillsExpanded}
          setIsSkillsExpanded={setIsSkillsExpanded}
          selectedInterests={selectedInterests}
          handleToggleInterest={handleToggleInterest}
          setSelectedInterests={setSelectedInterests}
          isInterestsExpanded={isInterestsExpanded}
          setIsInterestsExpanded={setIsInterestsExpanded}
        />
        {filteredMentees.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredMentees.map(mentee => (
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
            <EmptyState />
        )}
    </>
  );
};

export default MenteeList;
