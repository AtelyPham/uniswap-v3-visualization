import React from 'react';
import { Error } from '../Error';
import { Spinner } from '../Spinner';
import { HiOutlineRefresh } from 'react-icons/hi';
import classNames from 'classnames';

const Button = (props: {
  children?: any;
  onClick?: () => any;
  isDisabled?: boolean;
}) => {
  const className = classNames({
    'bg-blue-300': !!props.isDisabled,
    'cursor-not-allowed': !!props.isDisabled,
    'bg-blue-600 hover:bg-blue-700': !props.isDisabled,
    'cursor-pointer': !props.isDisabled,
    'focus:ring-4 focus:outline-none focus:ring-blue-300': !props.isDisabled,
  });
  return (
    <div className="mb-2">
      <button
        type="button"
        onClick={props.onClick}
        disabled={!!props.isDisabled}
        className={classNames(
          'text-white font-medium rounded-lg text-sm px-3 py-2 text-center mr-2 inline-flex items-center shadow-lg',
          className,
        )}
      >
        {props.children}
      </button>
    </div>
  );
};

const Card = ({
  title,
  children,
  isLoading,
  isError,
  onRefresh,
}: {
  title: string;
  children?: any;
  isLoading?: boolean;
  isError?: boolean;
  onRefresh?: () => any;
}) => {
  return (
    <div className="px-5 container lg:max-w-5xl mb-7">
      <div className="flex justify-between items-center">
        <h1 className="capitalize mb-2 text-sm font-medium text-gray-600">
          {title}
        </h1>
        {onRefresh && (
          <Button onClick={onRefresh} isDisabled={isLoading}>
            <HiOutlineRefresh
              className={classNames('inline w-4 h-4 mr-2 text-white', {
                'animate-spin': isLoading,
              })}
            />
            {isLoading ? 'Loading...' : 'Refresh'}
          </Button>
        )}
      </div>
      {!isLoading && !isError ? children : isLoading ? <Spinner /> : <Error />}
    </div>
  );
};

export default Card;
