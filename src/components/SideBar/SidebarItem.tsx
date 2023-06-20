import { Component, JSX } from 'solid-js';
import { A } from '@solidjs/router';

interface SidebarItemProps {
  href: string;
  icon: () => JSX.Element;
}

const SideBarItem: Component<SidebarItemProps> = (props: SidebarItemProps) => {
  const { icon: IconComponent } = props;
  return (
    <A end inactiveClass="text-neutral-600" href={props.href} activeClass="text-white">
      <IconComponent />
    </A>
  );
};

export default SideBarItem;
