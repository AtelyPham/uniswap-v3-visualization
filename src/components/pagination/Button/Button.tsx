import classNames from 'classnames';
import React, { ButtonHTMLAttributes } from 'react';

const Button: React.FC<ButtonHTMLAttributes<HTMLButtonElement>> = ({
  children,
  className,
  ...rest
}) => {
  return (
    <button
      type="button"
      className={classNames(
        className,
        'relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50',
      )}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
