export interface NetworkSummaryProps {
  data?: {
    volumeUSD: number;
    volumeUSDChange: number;
    tvlUSD: number;
    tvlUSDChange: number;
    feesUSD: number;
    feeChange: number;
    txCount: number;
    txCountChange: number;
  };
}
