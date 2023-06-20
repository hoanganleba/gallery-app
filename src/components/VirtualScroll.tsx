import { StoreContext } from '@/StoreContext';
import { invoke } from '@tauri-apps/api';
import { convertFileSrc } from '@tauri-apps/api/tauri';
import { createEffect } from 'solid-js';
import { Component, For, createSignal, useContext } from 'solid-js';
import isImageExtension from '@/utils/isImageExtension';
import resizeImage from '@/utils/resizeImage';

const VirtualScroll: Component = () => {
  const [items, setItems] = createSignal<any[]>([]);
  const [visibleItems, setVisibleItems] = createSignal<any[]>([]);
  const [contentHeight, setContentHeight] = createSignal(0);
  const contextValue = useContext(StoreContext);
  const store = contextValue?.store;

  let containerRef: HTMLDivElement;

  const [containerMounted, setContainerMounted] = createSignal(false);
  const handleContainerMount = () => setContainerMounted(true);

  const getVisibleItems = () => {
    const newArray: any[] = [];
    items().forEach((item) => {
      if ((item as any).pos <= containerRef.scrollTop + containerRef.clientHeight) {
        newArray.push(item);
      }

      if ((item as any).pos + item.height < containerRef.scrollTop) {
        newArray.shift();
      }
    });
    setVisibleItems(newArray);
  };

  createEffect(async () => {
    if ((store?.getDirData() as any).length !== 0) {
      const data = store?.getDirData() as any;
      const imageData = data
        .filter((item: any) => item.is_file && isImageExtension(item.path))
        .map((value: any) => ({ value, sort: Math.random() }))
        .sort((a: { sort: number }, b: { sort: number }) => a.sort - b.sort)
        .map(({ value }) => value)
        .slice(0, 31);
      let pos = 0;
      for (const element of imageData) {
        const dimension = await invoke<any>('get_image_dimensions', { imagePath: element.path });
        const { height } = resizeImage(dimension.width, dimension.height, containerRef.clientWidth);
        (element as any).pos = pos;
        (element.height as any) = height;
        setItems((prevItems) => [...prevItems, element]);
        pos += element.height;
      }
      setContentHeight(imageData.map((item: any) => item.height).reduce((a: any, b: any) => a + b, 0));
      getVisibleItems();
    }
  });

  return (
    <div
      ref={(container) => {
        containerRef = container;
        if (container && !containerMounted()) handleContainerMount();
      }}
      class="overflow-y-auto h-full scrollbar-none scroll-smooth"
      onScroll={getVisibleItems}
    >
      <div class="relative" style={`height: ${contentHeight()}px`}>
        <For each={visibleItems()}>
          {(item) => (
            <img
              class="absolute w-full"
              style={`top: ${item.pos}px; height: ${item.height}px`}
              src={convertFileSrc(item.path)}
            />
          )}
        </For>
      </div>
    </div>
  );
};

export default VirtualScroll;
