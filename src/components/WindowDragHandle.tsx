import { Component } from 'solid-js';
import { appWindow } from '@tauri-apps/api/window';

const WindowDragHandle: Component = () => {
  const startDragging = async (event: Event) => {
    event.stopPropagation();
    event.preventDefault();
    await appWindow.startDragging();
  };
  const toggleMaximize = async (event: Event) => {
    event.stopPropagation();
    event.preventDefault();
    await appWindow.toggleMaximize()
  } 
  return <div onDblClick={toggleMaximize} onMouseDown={startDragging} class="flex-none h-8"></div>;
};

export default WindowDragHandle;
