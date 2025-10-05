import React from 'react';

interface StarIconProps extends React.SVGProps<SVGSVGElement> {
  filled?: boolean;
}

const StarIcon: React.FC<StarIconProps> = ({ filled = true, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill={filled ? 'currentColor' : 'none'}
    stroke="currentColor"
    strokeWidth={1.5}
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.479.038.674.646.317.943l-4.096 3.792a.563.563 0 0 0-.163.502l1.24 5.385c.121.527-.429.956-.894.661l-4.843-2.91a.563.563 0 0 0-.621 0l-4.843 2.91c-.465.295-1.015-.134-.894-.661l1.24-5.385a.563.563 0 0 0-.163-.502l-4.096-3.792c-.357-.297-.162-.905.317-.943l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
    />
  </svg>
);

export default StarIcon;