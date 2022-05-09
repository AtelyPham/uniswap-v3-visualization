import { getAddress } from '@ethersproject/address';

/**
 * returns the checksummed address if the address is valid, otherwise returns false
 */
export default (value: string): string | false => {
  try {
    return getAddress(value);
  } catch {
    return false;
  }
};
