import React from 'react';

interface SkillBadgeProps {
  skill: string;
  color?: 'indigo' | 'teal';
}

const SkillBadge: React.FC<SkillBadgeProps> = ({ skill, color = 'indigo' }) => {
  const colorClasses = {
    indigo: 'bg-indigo-500/20 text-indigo-300',
    teal: 'bg-teal-500/20 text-teal-300',
  };

  return (
    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${colorClasses[color]}`}>
      {skill}
    </span>
  );
};

export default SkillBadge;