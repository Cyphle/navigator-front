import { BarChart3, CalendarDays, Bell } from 'lucide-react';

const FEATURES = [
  {
    icon: <BarChart3 className="w-5 h-5" />,
    iconBg: 'rgba(27,79,138,0.3)',
    title: 'Pilotage clair',
    desc: 'Regroupe tes mouvements importants sur un seul tableau de bord familial.',
  },
  {
    icon: <CalendarDays className="w-5 h-5" />,
    iconBg: 'rgba(61,139,110,0.3)',
    title: 'Vue hebdomadaire',
    desc: 'Planifie les prochaines semaines sans perdre le rythme.',
  },
  {
    icon: <Bell className="w-5 h-5" />,
    iconBg: 'rgba(245,166,35,0.3)',
    title: 'Alertes utiles',
    desc: 'Reçois des rappels quand tes objectifs ou tâches évoluent.',
  },
];

export const RegistrationHeroPanel = () => (
  <section
    className="hidden md:flex flex-1 relative overflow-hidden flex-col justify-center px-12 py-16 lg:px-16"
    style={{ background: 'linear-gradient(135deg, var(--stone) 0%, #1A2744 100%)' }}
  >
    {/* Decorative blobs */}
    <div
      className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-25 pointer-events-none"
      style={{ background: 'radial-gradient(circle, var(--ocean-light) 0%, transparent 70%)', transform: 'translate(30%, -30%)' }}
      aria-hidden="true"
    />
    <div
      className="absolute bottom-0 left-0 w-72 h-72 rounded-full opacity-25 pointer-events-none"
      style={{ background: 'radial-gradient(circle, var(--sage-light) 0%, transparent 70%)', transform: 'translate(-30%, 30%)' }}
      aria-hidden="true"
    />

    <div className="relative z-10 max-w-lg">
      {/* Brand badge */}
      <div
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-8 text-xs font-semibold text-white"
        style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}
      >
        <div
          className="w-5 h-5 rounded-md flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, var(--ocean) 0%, var(--ocean-light) 100%)' }}
        >
          <svg viewBox="0 0 24 24" fill="white" className="w-3 h-3" aria-hidden="true">
            <path d="M12 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 2a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm0 6c.55 0 1 .45 1 1v1.28A7.01 7.01 0 0 1 19 19h-2a5 5 0 0 0-4-4.9V19l3 2-1 1.5-2-1.33L11 22.5 10 21l3-2v-4.9A5 5 0 0 0 9 19H7a7.01 7.01 0 0 1 6-6.72V11c0-.55.45-1 1-1Z" />
          </svg>
        </div>
        Navigator
      </div>

      <h1 className="font-display text-3xl lg:text-4xl font-bold text-white leading-tight mb-4">
        Organise ta{' '}
        <span style={{ color: 'var(--sage-light)' }}>famille</span>
        <br />au même endroit
      </h1>
      <p className="text-base leading-relaxed mb-10" style={{ color: 'rgba(255,255,255,0.6)' }}>
        Centralise agenda, recettes, tâches et listes de courses pour toute la famille.
      </p>

      <ul className="flex flex-col space-y-5 list-none p-0 m-0">
        {FEATURES.map((feature) => (
          <li key={feature.title} className="flex items-start gap-4">
            <div
              className="w-9 h-9 rounded-[var(--radius-sm)] flex items-center justify-center text-white shrink-0 mt-0.5"
              style={{ background: feature.iconBg }}
            >
              {feature.icon}
            </div>
            <div>
              <p className="text-sm font-semibold text-white m-0 mb-0.5">{feature.title}</p>
              <p className="text-sm m-0" style={{ color: 'rgba(255,255,255,0.55)' }}>{feature.desc}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  </section>
);
