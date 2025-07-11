import { configureStore } from '@reduxjs/toolkit';
import datasetReducer from './datasetSlice';
import analysisReducer from './analysisSlice';

export const store = configureStore({
  reducer: {
    dataset: datasetReducer,
    analysis: analysisReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;