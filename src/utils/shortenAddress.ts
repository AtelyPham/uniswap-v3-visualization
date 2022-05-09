import isAddress from './isAddress';

/**
 * shorten the checksummed version of the input address to have 0x + 4 characters at start and end
 * @param address the address to shorten
 * @param chars first and last number of characters to display
 * @returns the shortened address
 */
export default (address: string, chars = 4): string => {
  const parsed = isAddress(address);
  if (!parsed) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }
  return `${parsed.substring(0, chars + 2)}...${parsed.substring(42 - chars)}`;
};
