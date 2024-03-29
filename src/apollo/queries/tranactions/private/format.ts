import { TransactionData, TransactionType } from 'state/transactions/reducer';
import { Burn, GetAllTransactionsQuery, Mint, Swap } from 'types/graphql.d';
import { ArrayElement } from 'types/utils';
import { formatTokenSymbol } from 'utils';

/**
 * Format function to format transaction query result
 */
export default (data: GetAllTransactionsQuery) =>
  data.transactions.reduce(
    (
      accum: TransactionData[],
      t: ArrayElement<GetAllTransactionsQuery['transactions']>,
    ) => {
      const mintEntries = t.mints
        .filter((m): m is Mint => Boolean(m))
        .map(m => {
          return {
            type: TransactionType.MINT,
            hash: t.id,
            timestamp: t.timestamp,
            sender: m.origin,
            token0Symbol: formatTokenSymbol(
              m.pool.token0.id,
              m.pool.token0.symbol,
            ),
            token1Symbol: formatTokenSymbol(
              m.pool.token1.id,
              m.pool.token1.symbol,
            ),
            token0Address: m.pool.token0.id,
            token1Address: m.pool.token1.id,
            amountUSD: parseFloat(m.amountUSD),
            amountToken0: parseFloat(m.amount0),
            amountToken1: parseFloat(m.amount1),
          };
        });
      const burnEntries = t.burns
        .filter((b): b is Burn => Boolean(b))
        .map(b => {
          return {
            type: TransactionType.BURN,
            hash: t.id,
            timestamp: t.timestamp,
            sender: b.origin,
            token0Symbol: formatTokenSymbol(
              b.pool.token0.id,
              b.pool.token0.symbol,
            ),
            token1Symbol: formatTokenSymbol(
              b.pool.token1.id,
              b.pool.token1.symbol,
            ),
            token0Address: b.pool.token0.id,
            token1Address: b.pool.token1.id,
            amountUSD: parseFloat(b.amountUSD),
            amountToken0: parseFloat(b.amount0),
            amountToken1: parseFloat(b.amount1),
          };
        });

      const swapEntries = t.swaps
        .filter((s): s is Swap => Boolean(s))
        .map(s => {
          return {
            hash: t.id,
            type: TransactionType.SWAP,
            timestamp: t.timestamp,
            sender: s.origin,
            token0Symbol: formatTokenSymbol(
              s.pool.token0.id,
              s.pool.token0.symbol,
            ),
            token1Symbol: formatTokenSymbol(
              s.pool.token1.id,
              s.pool.token1.symbol,
            ),
            token0Address: s.pool.token0.id,
            token1Address: s.pool.token1.id,
            amountUSD: parseFloat(s.amountUSD),
            amountToken0: parseFloat(s.amount0),
            amountToken1: parseFloat(s.amount1),
          };
        });
      accum = [...accum, ...mintEntries, ...burnEntries, ...swapEntries];
      return accum;
    },
    [],
  );
