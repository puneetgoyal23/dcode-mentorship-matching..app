import React from 'react';

const UsersIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m-7.5-2.952a4.5 4.5 0 0 1-9 0m9 0a4.5 4.5 0 0 0-9 0m9 0h0m-9 0h0m0 0v-4.682m5.156 5.156h.008m-5.164 0h.008m-5.164 0h.008m2.064 0h.008m-2.072 0h.008"
    />
  </svg>
);

export default UsersIcon;
