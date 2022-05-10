import classNames from 'classnames';
import { Percent } from 'components';
import React from 'react';
import { formatAmount, formatDollarAmount } from 'utils';
import { NetworkSummaryProps } from './NetworkSummary.props';

const SummaryCard = (props: {
  title: string;
  value: string;
  valueChange: number;
}) => (
  <div className="p-3 sm:p-6 lg:p-4 w-44 sm:w-72 lg:w-60 bg-white rounded-lg border border-gray-200 shadow-md">
    <h6 className="mb-2 text-base sm:text-lg tracking-normal text-gray-900">
      {props.title}
    </h6>
    <div className="mb-3 font-normal text-gray-700">
      <div className="flex justify-between items-end">
        <p className="text-xl sm:text-3xl lg:text-xl text-blue-600 font-medium">
          {props.value}
        </p>
        <p
          className={classNames(
            'px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-3xl hidden sm:block',
            {
              'bg-green-100 ': props.valueChange >= 0,
              'bg-red-100': props.valueChange < 0,
            },
          )}
        >
          <Percent value={props.valueChange} />
        </p>
      </div>
    </div>
  </div>
);

const NetworkSummary: React.FC<NetworkSummaryProps> = ({ data = {} }) => {
  const {
    feeChange,
    feesUSD,
    tvlUSD,
    tvlUSDChange,
    txCount,
    txCountChange,
    volumeUSD,
    volumeUSDChange,
  } = data;

  return (
    <div className="grid gap-3 grid-cols-2 lg:grid-cols-4 mb-12">
      <SummaryCard
        title="Volume 24h"
        value={formatDollarAmount(volumeUSD)}
        valueChange={volumeUSDChange ?? 0}
      />
      <SummaryCard
        title="Fee 24h"
        value={formatDollarAmount(feesUSD)}
        valueChange={feeChange ?? 0}
      />
      <SummaryCard
        title="TVL 24h"
        value={formatDollarAmount(tvlUSD)}
        valueChange={tvlUSDChange ?? 0}
      />
      <SummaryCard
        title="Transaction in 24h"
        value={formatAmount(txCount)}
        valueChange={txCountChange ?? 0}
      />
    </div>
  );
};

export default NetworkSummary;
