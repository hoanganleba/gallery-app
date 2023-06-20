import { Component } from 'solid-js';

interface PauseProps {
  size?: string;
  color?: string;
}

const Pause: Component<PauseProps> = (props) => {
  const { size = '6', color = 'text-white' } = props;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      class={`w-${size} h-${size} ${color}`}
    >
      <path
        fill-rule="evenodd"
        d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z"
        clip-rule="evenodd"
      />
    </svg>
  );
};

export default Pause;
