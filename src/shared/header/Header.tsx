import { useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/user/user.context.tsx';
import { useFamily } from '../../contexts/family/family.context.tsx';
import { Option } from '../../helpers/option.ts';
import { UserInfo } from '../../stores/user/user.types.ts';
import { logout } from '../../services/user.service.ts';
import { redirectToLogin } from '../../helpers/navigation.ts';
import { Bell, ChevronDown, LogOut, User, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const AnchorLogo = () => (
  <svg viewBox="0 0 24 24" fill="white" aria-hidden="true" className="w-4 h-4">
    <path d="M12 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 2a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm0 6c.55 0 1 .45 1 1v1.28A7.01 7.01 0 0 1 19 19h-2a5 5 0 0 0-4-4.9V19l3 2-1 1.5-2-1.33L11 22.5 10 21l3-2v-4.9A5 5 0 0 0 9 19H7a7.01 7.01 0 0 1 6-6.72V11c0-.55.45-1 1-1Z" />
  </svg>
);

const PAGE_CONTENT: Record<string, { title: string; subtitle: string }> = {
  '/families':            { title: 'Familles',                     subtitle: 'Mes familles, pour vivre ensemble' },
  '/calendars':           { title: 'Mes calendriers',              subtitle: 'Pour gérer mon temps et celui de ma famille' },
  '/magic-lists':         { title: 'Magic Lists',                  subtitle: 'Mes tâches et celles de ma famille' },
  '/shopping-lists':      { title: 'Listes de course',             subtitle: 'Acheter acheter acheter ! Pour ma famille et moi' },
  '/meals':               { title: 'Recettes de la semaine et plus', subtitle: 'Pour bien manger dans les jours à venir' },
  '/recipes':             { title: 'Recettes',                     subtitle: 'Mes recettes, celles de ma famille mais pas que' },
  '/profile':             { title: 'Mon profil',                   subtitle: 'Moi moi et encore moi. Mais aussi nous' },
  '/bank-accounts':       { title: 'Comptes bancaires',            subtitle: 'Gérez vos comptes et budgets' },
};

const DEFAULT_CONTENT = { title: 'Dashboard', subtitle: 'Gérer la famille au même endroit' };

export const Header = ({ userInfo }: { userInfo: Option<UserInfo> }) => {
  const { userState } = useUser();
  const { currentFamily, families, setCurrentFamily } = useFamily();
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
      {/* Left: mobile logo OR page title on tablet+ */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Navigator logo — mobile only (sidebar hidden on mobile) */}
        <div className="flex items-center gap-2 md:hidden shrink-0">
          <div
            className="w-8 h-8 rounded-[10px] flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, var(--ocean) 0%, var(--ocean-light) 100%)' }}
          >
            <AnchorLogo />
          </div>
          <span className="font-display font-semibold text-base" style={{ color: 'var(--stone)' }}>
            Navigator
          </span>
        </div>

        {/* Page title — tablet+ */}
        <div className="hidden md:block min-w-0">
          <h1
            className="font-display text-2xl font-bold m-0 truncate"
            style={{ color: 'var(--stone)' }}
          >
            {title}
          </h1>
          <p className="text-sm mt-0.5 m-0 truncate hidden lg:block" style={{ color: 'var(--mist)' }}>
            {subtitle}
          </p>
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-3">
        {isLoggedIn ? (
          <>
            {/* Family selector */}
            {families.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors hover:bg-[var(--ocean-pale)]"
                    style={{ background: 'var(--sand)', color: 'var(--stone)' }}
                  >
                    <Users className="w-4 h-4 shrink-0" style={{ color: 'var(--ocean)' }} />
                    <span className="max-w-[120px] truncate hidden sm:inline">{currentFamily?.name}</span>
                    <ChevronDown className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--mist)' }} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52 rounded-[var(--radius-md)]">
                  <DropdownMenuLabel style={{ color: 'var(--stone)' }}>Ma famille</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {families.map(family => (
                    <DropdownMenuItem
                      key={family.id}
                      onClick={() => setCurrentFamily(family)}
                      style={currentFamily?.id === family.id ? { fontWeight: 600 } : undefined}
                    >
                      {family.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

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
                    className="text-sm font-semibold hidden lg:inline group-hover:opacity-80 transition-opacity"
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
