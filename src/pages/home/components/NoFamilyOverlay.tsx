import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';

const NoFamilyOverlay = () => {
  const navigate = useNavigate();
  return (
      <div className="absolute inset-0 z-10 flex items-center justify-center backdrop-blur-sm" style={{ background: 'rgba(255,255,255,0.75)' }}>
        <div
            className="flex flex-col items-center gap-4 rounded-[var(--radius-lg)] p-8 text-center max-w-sm w-full"
            style={{ background: 'white', boxShadow: 'var(--shadow-soft)' }}
        >
          <div
              className="w-14 h-14 rounded-full flex items-center justify-center"
              style={{ background: 'var(--ocean-pale)', color: 'var(--ocean)' }}
          >
            <Users className="w-7 h-7" />
          </div>
          <div>
            <h2 className="font-display text-lg font-semibold m-0" style={{ color: 'var(--stone)' }}>
              Bienvenue sur Navigator
            </h2>
            <p className="text-sm mt-1 m-0" style={{ color: 'var(--mist)' }}>
              Créez votre première famille pour commencer à utiliser le dashboard.
            </p>
          </div>
          <Button
              onClick={() => navigate('/families')}
              style={{ background: 'var(--ocean)', color: 'white' }}
          >
            Créez votre première famille
          </Button>
        </div>
      </div>
  );
};

export default NoFamilyOverlay;