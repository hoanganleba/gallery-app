import { StoreContext } from '@/StoreContext';
import { Component, createEffect, createSignal, onCleanup, useContext } from 'solid-js';

const SearchHandle: Component = () => {
  const contextValue = useContext(StoreContext);
  const store = contextValue?.store;
  const [searchTerm, setSearchTerm] = createSignal('');
  const [isLoading, setIsLoading] = createSignal(false);
  const [data, setData] = createSignal(store?.getDirData());

  const debounce = (fn: Function, delay: number | undefined) => {
    let timerId: string | number | NodeJS.Timeout | undefined;
    return (...args: any) => {
      clearTimeout(timerId);
      timerId = setTimeout(() => {
        fn(...args);
      }, delay);
    };
  };

  const debouncedSearch = debounce((value: string) => {
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);

      console.log('Search term:', value);
    }, 500);
  }, 300);

  const handleInputChange = (event: Event) => {
    const value = (event.target as HTMLInputElement).value;

    setSearchTerm(value);

    debouncedSearch(value);
  };

  createEffect(() => {
    setData(store?.getDirData());
  });

  onCleanup(() => clearTimeout(debouncedSearch as unknown as NodeJS.Timeout));

  return (
    <div>
      <div class="relative bg-neutral-900 text-white">
        <div class="absolute top-1/2 -translate-y-1/2 left-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-5 h-5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
        </div>
        <input
          type="text"
          class="pl-10 border-none outline-none focus:outline-none w-full bg-inherit"
          placeholder="Search..."
          value={searchTerm()}
          onInput={handleInputChange}
        />
      </div>
      <div class="mt-4">{isLoading() && <div class="text-white">Loading...</div>}</div>
    </div>
  );
};

export default SearchHandle;
