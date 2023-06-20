import { StoreContext } from '@/StoreContext';
import { invoke } from '@tauri-apps/api';
import { Component, JSX, createSignal, onMount, useContext } from 'solid-js';
import LoadingIndicator from './LoadingIndicator';

interface WrapperProps {
  children: JSX.Element;
}

const Wrapper: Component<WrapperProps> = ({ children }: WrapperProps) => {
  const contextValue = useContext(StoreContext);
  const store = contextValue?.store;
  const [isLoading, setIsLoading] = createSignal(false);

  onMount(async () => {
    try {
      setIsLoading(true);
      const data = await invoke<any[]>('read_directory', { pathStr: '/Volumes/ExternalHDD/' });
      store?.setDirDataValue(data);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <div class="h-screen w-screen bg-black overflow-hidden text-white">
      {children}
      <LoadingIndicator isLoading={isLoading()} />
    </div>
  );
};

export default Wrapper;
