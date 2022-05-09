import React from 'react';
import { HiExternalLink } from 'react-icons/hi';

const ExternalLink = (props: { children: any; href: string }) => {
  return (
    <a
      className="no-underline hover:underline text-blue-600 cursor-pointer"
      href={props.href}
      target="_blank"
      rel="noreferrer"
    >
      {props.children} <HiExternalLink className="inline text-base -mt-1" />
    </a>
  );
};

export default ExternalLink;
