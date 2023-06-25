import { Component } from 'solid-js';
import SidebarItem from './SidebarItem';
import HeroIconHome from '@/components/HeroIcons/HeroIconHome';
import HeroIconFolder from '@/components/HeroIcons/HeroIconFolder';
import HeroIconClock from '@/components/HeroIcons/HeroIconClock';

const SideBar: Component = () => {
  return (
    <div class="absolute top-8 bottom-0 bg-inherit z-10">
      <div class="flex flex-col px-2.5 pt-5 space-y-8">
        <SidebarItem href="/" icon={HeroIconHome} />
        <SidebarItem href="/folder" icon={HeroIconFolder} />
        <SidebarItem href="/recents" icon={HeroIconClock} />
      </div>
    </div>
  );
};

export default SideBar;
