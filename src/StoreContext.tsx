import { createContext } from 'solid-js';
import { createStore } from './store';

type StoreContextType = {
  store?: ReturnType<typeof createStore>;
};

export const StoreContext = createContext<StoreContextType | undefined>();

export const store = createStore();
