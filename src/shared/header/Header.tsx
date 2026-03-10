import { useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/user/user.context.tsx';
import { Option } from '../../helpers/option.ts';
import { UserInfo } from '../../stores/user/user.types.ts';
import { logout } from '../../services/user.service.ts';
import { redirectToLogin } from '../../helpers/navigation.ts';
import { Bell, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Header = ({ userInfo }: { userInfo: Option<UserInfo> }) => {
  const { userState } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  const fullName = `${userState.firstName} ${userState.lastName}`.trim();
  const initials = `${userState.firstName?.[0] ?? ''}${userState.lastName?.[0] ?? ''}` || 'U';
  const isLoggedIn = userInfo.isSome();

  const handleLogout = async () => {
    await logout();
    navigate('/registration');
  };

  const headerContent = (() => {
    if (location.pathname.startsWith('/families')) {
      return {
        title: 'Familles',
        subtitle: 'Mes familles, pour vivre ensemble'
      };
    }

    if (location.pathname.startsWith('/calendars')) {
      return {
        title: 'Mes calendriers',
        subtitle: 'Pour gérer mon temps et celui de ma famille'
      };
    }

    if (location.pathname.startsWith('/family-todos')) {
      return {
        title: 'To do lists',
        subtitle: 'Mes tâches et celles de ma famille'
      };
    }

    if (location.pathname.startsWith('/shopping-lists')) {
      return {
        title: 'Listes de course',
        subtitle: 'Acheter acheter acheter ! Pour ma famille et moi'
      };
    }

    if (location.pathname.startsWith('/weekly-menus')) {
      return {
        title: 'Recettes de la semaine et plus',
        subtitle: 'Pour bien manger dans les jours à venir'
      };
    }

    if (location.pathname.startsWith('/recipes')) {
      return {
        title: 'Recettes',
        subtitle: 'Mes recettes, celles de ma famille mais pas que'
      };
    }

    if (location.pathname.startsWith('/profile')) {
      return {
        title: 'Mon profil',
        subtitle: 'Moi moi et encore moi. Mais aussi nous'
      };
    }

    return {
      title: 'Dashboard',
      subtitle: 'Gerer la famille au meme endroit'
    };
  })();

  return (
    <header className="flex items-center justify-between px-10 py-8 bg-white border-b border-gray-100 sticky top-0 z-10">
      <div className="flex flex-col gap-1">
        <h1 className="m-0 font-light text-2xl tracking-widest text-black uppercase">{headerContent.title}</h1>
        <p className="m-0 text-gray-400 font-light text-sm tracking-widest">{headerContent.subtitle}</p>
      </div>

      <div className="flex items-center gap-6">
        { isLoggedIn ? (
          <>
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-black">
              <Bell className="w-5 h-5" />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-3 cursor-pointer group">
                  <Avatar className="w-10 h-10 border border-gray-100 group-hover:border-blue-500 transition-colors">
                    <AvatarFallback className="bg-white text-black text-xs font-light">{initials}</AvatarFallback>
                  </Avatar>
                  <span className="text-black font-light text-sm tracking-widest uppercase group-hover:text-blue-500 transition-colors hidden md:inline">
                    {fullName}
                  </span>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Mon Compte</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profil</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Se déconnecter</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <div className="flex gap-2">
            <Button variant="ghost" onClick={redirectToLogin} className="text-sm font-light uppercase tracking-widest">
              Log in
            </Button>
            <Button onClick={() => navigate('/registration')} className="text-sm font-light uppercase tracking-widest bg-black hover:bg-gray-800 text-white rounded-none">
              Register
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
