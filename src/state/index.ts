import { configureStore } from '@reduxjs/toolkit';
import pools from './pools/reducer';

const store = configureStore({
  reducer: {
    pools,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({ thunk: false, immutableCheck: false }),
});

export default store;

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
