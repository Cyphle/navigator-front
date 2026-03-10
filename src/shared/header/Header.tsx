import { useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/user/user.context.tsx';
import { Option } from '../../helpers/option.ts';
import { UserInfo } from '../../stores/user/user.types.ts';
import { logout } from '../../services/user.service.ts';
import { redirectToLogin } from '../../helpers/navigation.ts';
import { Bell, LogOut, User, Menu as MenuIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const PAGE_CONTENT: Record<string, { title: string; subtitle: string }> = {
  '/families':      { title: 'Familles',                     subtitle: 'Mes familles, pour vivre ensemble' },
  '/calendars':     { title: 'Mes calendriers',              subtitle: 'Pour gérer mon temps et celui de ma famille' },
  '/family-todos':  { title: 'To do lists',                  subtitle: 'Mes tâches et celles de ma famille' },
  '/shopping-lists':{ title: 'Listes de course',             subtitle: 'Acheter acheter acheter ! Pour ma famille et moi' },
  '/weekly-menus':  { title: 'Recettes de la semaine et plus', subtitle: 'Pour bien manger dans les jours à venir' },
  '/recipes':       { title: 'Recettes',                     subtitle: 'Mes recettes, celles de ma famille mais pas que' },
  '/profile':       { title: 'Mon profil',                   subtitle: 'Moi moi et encore moi. Mais aussi nous' },
};

const DEFAULT_CONTENT = { title: 'Dashboard', subtitle: 'Gérer la famille au même endroit' };

export const Header = ({ userInfo, onMenuOpen }: { userInfo: Option<UserInfo>; onMenuOpen?: () => void }) => {
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

  const matchedKey = Object.keys(PAGE_CONTENT).find((key) =>
    location.pathname.startsWith(key)
  );
  const { title, subtitle } = matchedKey ? PAGE_CONTENT[matchedKey] : DEFAULT_CONTENT;

  return (
    <header
      className="bg-white px-4 md:px-7 py-3 md:py-4 flex items-center justify-between sticky top-0 z-20"
      style={{ boxShadow: 'var(--shadow-soft)' }}
    >
      {/* Left: hamburger (mobile) + page title */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Hamburger button — mobile/tablet only */}
        <button
          className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors hover:bg-[var(--ocean-pale)]"
          style={{ background: 'var(--sand)' }}
          onClick={onMenuOpen}
          aria-label="Ouvrir le menu"
        >
          <MenuIcon className="w-5 h-5" style={{ color: 'var(--stone)' }} />
        </button>

        <div className="min-w-0">
          <h1
            className="font-display text-lg md:text-2xl font-bold m-0 truncate"
            style={{ color: 'var(--stone)' }}
          >
            {title}
          </h1>
          <p className="text-xs md:text-sm mt-0.5 m-0 truncate hidden sm:block" style={{ color: 'var(--mist)' }}>
            {subtitle}
          </p>
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-3">
        {isLoggedIn ? (
          <>
            {/* Bell button */}
            <button
              className="w-9 h-9 rounded-lg flex items-center justify-center relative transition-colors hover:bg-[var(--ocean-pale)]"
              style={{ background: 'var(--sand)' }}
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" style={{ color: 'var(--mist)' }} />
            </button>

            {/* User dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-2.5 cursor-pointer group">
                  {/* Avatar with ocean gradient */}
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                    style={{
                      background: 'linear-gradient(135deg, var(--ocean) 0%, var(--ocean-light) 100%)',
                    }}
                  >
                    {initials}
                  </div>
                  <span
                    className="text-sm font-semibold hidden md:inline group-hover:opacity-80 transition-opacity"
                    style={{ color: 'var(--stone)' }}
                  >
                    {fullName}
                  </span>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52 rounded-[var(--radius-md)]">
                <DropdownMenuLabel style={{ color: 'var(--stone)' }}>Mon Compte</DropdownMenuLabel>
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
            <Button
              variant="ghost"
              onClick={redirectToLogin}
              className="text-sm font-medium"
              style={{ color: 'var(--stone)' }}
            >
              Se connecter
            </Button>
            <Button
              onClick={() => navigate('/registration')}
              className="text-sm font-semibold text-white rounded-[var(--radius-sm)] px-5"
              style={{
                background: 'linear-gradient(135deg, var(--ocean) 0%, var(--ocean-light) 100%)',
              }}
            >
              S'inscrire
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};
