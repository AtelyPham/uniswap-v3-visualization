import { GetNetworkDataQuery } from 'types/graphql.d';
import { ArrayElement } from 'types/utils';
import { getPercentChange } from 'utils';

export default (
  parsed: ArrayElement<GetNetworkDataQuery['factories']> | undefined,
  parsed24: ArrayElement<GetNetworkDataQuery['factories']> | undefined,
  parsed48: ArrayElement<GetNetworkDataQuery['factories']> | undefined,
) => {
  if (!parsed) {
    return undefined;
  }

  // volume data
  const volumeUSD =
    parsed && parsed24
      ? parseFloat(parsed.totalVolumeUSD) - parseFloat(parsed24.totalVolumeUSD)
      : parseFloat(parsed.totalVolumeUSD);

  const volumeOneWindowAgo =
    parsed24?.totalVolumeUSD && parsed48?.totalVolumeUSD
      ? parseFloat(parsed24.totalVolumeUSD) -
        parseFloat(parsed48.totalVolumeUSD)
      : undefined;

  const volumeUSDChange =
    volumeUSD && volumeOneWindowAgo
      ? ((volumeUSD - volumeOneWindowAgo) / volumeOneWindowAgo) * 100
      : 0;

  // total value locked
  const tvlUSDChange = getPercentChange(
    parsed?.totalValueLockedUSD,
    parsed24?.totalValueLockedUSD,
  );

  // 24H transactions
  const txCount =
    parsed && parsed24
      ? parseFloat(parsed.txCount) - parseFloat(parsed24.txCount)
      : parseFloat(parsed.txCount);

  const txCountOneWindowAgo =
    parsed24 && parsed48
      ? parseFloat(parsed24.txCount) - parseFloat(parsed48.txCount)
      : undefined;

  const txCountChange =
    txCount && txCountOneWindowAgo
      ? getPercentChange(txCount.toString(), txCountOneWindowAgo.toString())
      : 0;

  const feesOneWindowAgo =
    parsed24 && parsed48
      ? parseFloat(parsed24.totalFeesUSD) - parseFloat(parsed48.totalFeesUSD)
      : undefined;

  const feesUSD =
    parsed && parsed24
      ? parseFloat(parsed.totalFeesUSD) - parseFloat(parsed24.totalFeesUSD)
      : parseFloat(parsed.totalFeesUSD);

  const feeChange =
    feesUSD && feesOneWindowAgo
      ? getPercentChange(feesUSD.toString(), feesOneWindowAgo.toString())
      : 0;

  return {
    volumeUSD,
    volumeUSDChange: typeof volumeUSDChange === 'number' ? volumeUSDChange : 0,
    tvlUSD: parseFloat(parsed?.totalValueLockedUSD),
    tvlUSDChange,
    feesUSD,
    feeChange,
    txCount,
    txCountChange,
  };
};
