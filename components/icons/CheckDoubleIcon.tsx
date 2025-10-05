import React from 'react';

const CheckDoubleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4.5 12.75 9 17.25l9-13.5"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m8.5 12.75 9-13.5"
      style={{
          transform: 'translateX(4px)',
          opacity: 0.8
      }}
    />
  </svg>
);

export default CheckDoubleIcon;