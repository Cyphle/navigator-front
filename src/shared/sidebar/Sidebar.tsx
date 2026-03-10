import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import navigatorLogo from '../../assets/navigator.png';
import { Menu } from '../menu/Menu';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside className={cn(
      "bg-black text-white p-10 flex flex-col gap-12 min-h-screen relative transition-all duration-300 ease-in-out shrink-0 w-[260px]",
      isCollapsed && "w-[70px] px-3"
    )}>
      <button
        className="absolute top-5 -right-3 w-6 h-6 bg-black border border-gray-200 rounded-none text-white grid place-items-center cursor-pointer transition-all duration-300 z-10 hover:bg-blue-500 hover:border-blue-500"
        onClick={() => setIsCollapsed(!isCollapsed)}
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isCollapsed ? (
          <ChevronRight className="w-3.5 h-3.5" />
        ) : (
          <ChevronLeft className="w-3.5 h-3.5" />
        )}
      </button>

      <NavLink to="/" className="flex items-center gap-3 text-white no-underline font-light text-lg tracking-widest uppercase">
        <img src={navigatorLogo} alt="Navigator logo" className={cn("transition-all duration-300", isCollapsed ? "w-10 h-10" : "w-12 h-12")} />
        <span className={cn(
          "transition-all duration-300 whitespace-nowrap overflow-hidden",
          isCollapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
        )}>
          Navigator
        </span>
      </NavLink>

      <Menu isCollapsed={isCollapsed} />
    </aside>
  );
};
