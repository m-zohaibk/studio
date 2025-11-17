import React from 'react';

const UkFlag = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30" {...props}>
    <clipPath id="a">
      <path d="M0 0h60v30H0z" />
    </clipPath>
    <path d="M0 0v30h60V0z" fill="#012169" />
    <path d="m0 0 60 30m0-30L0 30" stroke="#fff" strokeWidth="6" clipPath="url(#a)" />
    <path d="m0 0 60 30m0-30L0 30" stroke="#C8102E" strokeWidth="4" clipPath="url(#a)" />
    <path d="M30 0v30M0 15h60" stroke="#fff" strokeWidth="10" />
    <path d="M30 0v30M0 15h60" stroke="#C8102E" strokeWidth="6" />
  </svg>
);

export default UkFlag;
