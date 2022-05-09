import React, { useState } from 'react';
import { HelpCircle } from 'react-feather';
import { LogoProps } from './Logo.props';

const BAD_SRCS: { [tokenAddress: string]: true } = {};

/**
 * Renders an image by sequentially trying a list of URIs, and then eventually a fallback triangle alert
 */
const Logo: React.FC<LogoProps> = ({ srcs, alt, ...rest }) => {
  const [, refresh] = useState<number>(0);

  const src: string | undefined = srcs.find(src => !BAD_SRCS[src]);

  if (src) {
    return (
      <img
        {...rest}
        alt={alt}
        src={src}
        onError={() => {
          if (src) BAD_SRCS[src] = true;
          refresh(i => i + 1);
        }}
      />
    );
  }

  return <HelpCircle {...rest} />;
};

export default Logo;
