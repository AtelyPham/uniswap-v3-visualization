import { configureStore } from '@reduxjs/toolkit';
import pools from './pools/reducer';
import tokens from './tokens/reducer';
import transactions from './transactions/reducer';

const store = configureStore({
  reducer: {
    pools,
    tokens,
    transactions,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({ thunk: false, immutableCheck: false }),
});

export default store;

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export type StatusState = {
  loading?: boolean;
  error?: boolean;
};

export const defaultStatusStore = {
  loading: false,
  error: false,
};
