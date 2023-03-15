import { combineReducers, configureStore } from '@reduxjs/toolkit';
import * as reducer from './modules';

const rootReducer = combineReducers({
  ...reducer,
});

const store = configureStore({
  reducer: rootReducer,
  devTools: true,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
