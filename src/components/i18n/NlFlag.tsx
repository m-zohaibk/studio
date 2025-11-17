import React from 'react';

const NlFlag = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9 6" {...props}>
    <rect width="9" height="6" fill="#21468B" />
    <rect width="9" height="4" fill="#fff" />
    <rect width="9" height="2" fill="#AE1C28" />
  </svg>
);

export default NlFlag;
