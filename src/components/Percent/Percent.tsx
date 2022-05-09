import classNames from 'classnames';
import React from 'react';

const Percent = ({
  value,
  decimals = 2,
  simple,
}: {
  value?: number;
  decimals?: number;
  simple?: boolean;
}) => {
  const commonClassNames = 'font-medium text-sm';
  if (value === undefined || value === null) {
    return (
      <span className={classNames(commonClassNames, 'text-gray-600')}>-</span>
    );
  }
  const truncated = parseFloat(value.toFixed(decimals));

  if (simple) {
    return (
      <span
        className={classNames(
          commonClassNames,
          truncated < 0 ? 'text-red-600' : 'text-green-500',
        )}
      >
        {truncated}%
      </span>
    );
  }

  return (
    <span
      className={classNames(
        commonClassNames,
        truncated < 0 ? 'text-red-800' : 'text-green-700',
      )}
    >
      {truncated < 0 && '↓'}
      {truncated > 0 && '↑'}
      {Math.abs(value).toFixed(decimals)}%
    </span>
  );
};

export default Percent;
