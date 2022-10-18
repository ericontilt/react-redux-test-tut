import { configureStore, ThunkAction, Action, PreloadedState, combineReducers } from '@reduxjs/toolkit';
import userReducer from '../features/users/userSlice';

// Create the root reducer separately so we can extract the RootState type
const rootReducer = combineReducers({
  user: userReducer,
});

// This function helps to set up the store with the correct types from tests
export function setupStore(preloadedState?: PreloadedState<RootState>) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
  });
}

// These type exports provide explicit types for our application state, store and dispatch
export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
