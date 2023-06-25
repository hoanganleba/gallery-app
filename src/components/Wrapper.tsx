import { StoreContext } from '@/StoreContext';
import { Component, JSX, onMount, useContext } from 'solid-js';
import { appLocalDataDir } from '@tauri-apps/api/path';
import { invoke } from '@tauri-apps/api';
import DirEntry from '@/types/DirEntry';

interface WrapperProps {
  children: JSX.Element;
}

const Wrapper: Component<WrapperProps> = ({ children }: WrapperProps) => {
  const contextValue = useContext(StoreContext);
  const store = contextValue?.store;

  onMount(async () => {
    const appDataDirPath = await appLocalDataDir();
    await invoke('create_directory_if_not_exists', { dirPath: `${appDataDirPath}` });
    const directoryData = await invoke('file_exists', { filePath: `${appDataDirPath + '/directory_data.txt'}` });
    if (!directoryData) {
      const result = await invoke<DirEntry[]>('read_directory', { pathStr: '/Volumes/ExternalHDD/' });
      await invoke('create_or_read_file', {
        params: { filename: `${appDataDirPath + '/directory_data.txt'}`, data: result.map((item) => item.path) },
      });
      store?.setDirDataValue(result);
    } else {
      const result = await invoke<string[]>('create_or_read_file', {
        params: { filename: `${appDataDirPath + '/directory_data.txt'}`, data: [] },
      });
      store?.setDirDataValue(result);
    }
  });

  return (
    <div class="h-screen w-screen bg-black overflow-hidden text-white">
      {children}
    </div>
  );
};

export default Wrapper;
