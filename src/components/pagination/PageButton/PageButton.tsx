import classNames from 'classnames';
import React, { ButtonHTMLAttributes } from 'react';

const PageButton: React.FC<ButtonHTMLAttributes<HTMLButtonElement>> = ({
  children,
  className,
  ...rest
}) => {
  return (
    <button
      className={classNames(
        className,
        'relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50',
      )}
      type="button"
      {...rest}
    >
      {children}
    </button>
  );
};

export default PageButton;
