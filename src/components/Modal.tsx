import { Component, createSignal, onMount } from 'solid-js';
import { JSX } from 'solid-js/types/jsx';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: JSX.Element;
}

const Modal: Component<ModalProps> = ({ isOpen, onClose, children }: ModalProps) => {
  const [showModal, setShowModal] = createSignal(isOpen);

  const handleClose = () => {
    onClose();
    setShowModal(false);
  };

  const handleOutsideClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (!target.closest('.modal-container')) {
      handleClose();
    }
  };

  onMount(() => {
    if (isOpen) {
      document.addEventListener('click', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  });

  return (
    <div class={`fixed top-32 inset-x-0 flex justify-center items-center bg-opacity-50 ${showModal() ? '' : 'hidden'}`}>
      <div class="w-full max-w-xl min-h-[300px] overflow-hidden bg-neutral-900 rounded-lg shadow-lg modal-container">
        <div class="p-4">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
