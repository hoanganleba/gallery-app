import { Component, ComponentProps, JSXElement } from 'solid-js';
import { appWindow } from '@tauri-apps/api/window';

interface TitlebarProps extends ComponentProps<any> {
  children?: JSXElement;
}

const Titlebar: Component<TitlebarProps> = (props: TitlebarProps) => {
  const startDragging = async (event: Event) => {
    event.stopPropagation();
    event.preventDefault();
    await appWindow.startDragging();
  };
  const toggleMaximize = async (event: Event) => {
    event.stopImmediatePropagation();
    event.preventDefault();
    await appWindow.toggleMaximize();
  };
  return (
    <div onDblClick={toggleMaximize} onMouseDown={startDragging} class="z-50 fixed inset-x-0 bg-transparent h-8"></div>
  );
};

export default Titlebar;
