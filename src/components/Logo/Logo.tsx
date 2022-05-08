import React, { useState } from 'react';
import { HelpCircle } from 'react-feather';
import { LogoProps } from './Logo.props';

/**
 * Renders an logo and fallback if url invalid
 */
const Logo: React.FC<LogoProps> = ({ src, alt, ...rest }) => {
  const [isError, setIsError] = useState(false);

  if (!isError) {
    return (
      <img
        {...rest}
        alt={alt}
        src={src}
        onError={() => {
          setIsError(true);
        }}
      />
    );
  }

  return <HelpCircle {...rest} />;
};

export default Logo;
