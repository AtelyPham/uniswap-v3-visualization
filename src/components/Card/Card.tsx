import React from 'react';
import { Error } from '../Error';
import { Spinner } from '../Spinner';
import { FaSpinner } from 'react-icons/fa';

const Button = (props: { children?: any; onClick?: () => any }) => {
  return (
    <div className="mb-2">
      <button
        type="button"
        onClick={props.onClick}
        className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-2 text-center mr-2 inline-flex items-center shadow-lg cursor-pointer pointer-events-auto"
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
          <Button onClick={onRefresh}>
            {isLoading && (
              <FaSpinner className="inline w-4 h-4 mr-3 text-white animate-spin" />
            )}
            {isLoading ? 'Loading...' : 'Refresh'}
          </Button>
        )}
      </div>
      {!isLoading && !isError ? children : isLoading ? <Spinner /> : <Error />}
    </div>
  );
};

export default Card;
