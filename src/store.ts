import { createSignal } from 'solid-js';

type StoreType = {
  getDirData: () => void;
  setDirDataValue: (newValue: any[]) => void;
};

export function createStore(): StoreType {
  const [dirData, setDirData] = createSignal<any[]>([]);

  function getDirData() {
    return dirData();
  }

  function setDirDataValue(newValue: any[]) {
    setDirData(newValue);
  }

  return { getDirData, setDirDataValue };
}
