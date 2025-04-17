import React, { createContext, useContext, useReducer, ReactNode } from 'react';

import { AppState, createInitialState } from './app-state';
import { Action, appReducer } from './app-reducer';

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

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
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);

  if (context === undefined) {
    throw new Error(
      'useAppContext는 AppProvider 컴포넌트 내에서 사용해야 합니다.'
    );
  }

  return context;
};
