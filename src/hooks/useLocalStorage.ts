import { Accessor, createSignal } from 'solid-js';

export default <T>(key: string, initialValue: T): [Accessor<T>, (value: T) => void] => {
  const getValue = (): T => {
    const storedValue = localStorage.getItem(key);
    if (storedValue !== null) {
      return JSON.parse(storedValue);
    } else {
      localStorage.setItem(key, JSON.stringify(initialValue));
      return initialValue;
    }
  };

  const [value, setValue] = createSignal<T>(getValue());

  const updateValue: (value: any) => void = (newValue) => {
    setValue(newValue);
    localStorage.setItem(key, JSON.stringify(newValue));
  };

  return [value, updateValue];
};
