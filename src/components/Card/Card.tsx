import React from 'react';
import { Error } from '../Error';
import { Spinner } from '../Spinner';

const Card = ({
  title,
  children,
  isLoading,
  isError,
}: {
  title: string;
  children?: any;
  isLoading?: boolean;
  isError?: boolean;
}) => {
  return (
    <div className="px-5 container lg:max-w-5xl mb-7">
      <h1 className="capitalize mb-2 text-sm font-medium text-gray-600">
        {title}
      </h1>
      {!isLoading && !isError ? children : isLoading ? <Spinner /> : <Error />}
    </div>
  );
};

export default Card;
