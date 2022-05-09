import { configureStore } from '@reduxjs/toolkit';
import pools from './pools/reducer';
import tokens from './tokens/reducer';

const store = configureStore({
  reducer: {
    pools,
    tokens,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({ thunk: false, immutableCheck: false }),
});

export default store;

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
