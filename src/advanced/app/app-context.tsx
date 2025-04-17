import React, { createContext, useContext, useReducer, ReactNode } from 'react';

import { AppState, createInitialState } from './app-state';
import { Action, appReducer } from './app-reducer';

// State Context와 Dispatch Context 분리
const AppStateContext = createContext<AppState | undefined>(undefined);
const AppDispatchContext = createContext<React.Dispatch<Action> | undefined>(
  undefined
);

interface AppProviderProps {
  children: ReactNode;
  initialState?: AppState;
}

export const AppProvider: React.FC<AppProviderProps> = ({
  children,
  initialState = createInitialState(),
}) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppStateContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>
        {children}
      </AppDispatchContext.Provider>
    </AppStateContext.Provider>
  );
};

// State만 사용하는 Hook
export const useAppState = (): AppState => {
  const state = useContext(AppStateContext);

  if (state === undefined) {
    throw new Error(
      'useAppState는 AppProvider 컴포넌트 내에서 사용해야 합니다.'
    );
  }

  return state;
};

// Dispatch만 사용하는 Hook
export const useAppDispatch = (): React.Dispatch<Action> => {
  const dispatch = useContext(AppDispatchContext);

  if (dispatch === undefined) {
    throw new Error(
      'useAppDispatch는 AppProvider 컴포넌트 내에서 사용해야 합니다.'
    );
  }

  return dispatch;
};
