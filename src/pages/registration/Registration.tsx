import { CreateProfileRequest } from '../../stores/profile/profile.types.ts';
import { useCreateProfile } from '../../stores/profile/profile.commands.ts';
import { useEffect, useState } from 'react';
import { useToaster } from '../../components/toaster/Toaster.tsx';
import { redirectToLogin } from '../../helpers/navigation.ts';
import { Controller, useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BarChart3, CalendarDays, Bell } from 'lucide-react';

interface RegistrationFormValues {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

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

export const Registration = () => {
  const { notify } = useToaster();
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);

  useEffect(() => {
    notify({ type: 'info', title: 'Vous allez être la bienvenu·e' });
  }, [notify]);

  const onCreateProfileError = (_: string) => setIsErrorModalOpen(true);
  const onCreateProfileSuccess = () => redirectToLogin();

  const { mutate: createProfileMutation, isPending: createProfileIsPending } =
    useCreateProfile(onCreateProfileError, onCreateProfileSuccess);

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<RegistrationFormValues>({
    mode: 'onChange',
    defaultValues: { username: '', email: '', firstName: '', lastName: '', password: '' },
  });

  const onSubmit = (value: RegistrationFormValues) => {
    const payload: CreateProfileRequest = {
      username: value.username,
      email: value.email,
      first_name: value.firstName,
      last_name: value.lastName,
      password: value.password,
    };
    createProfileMutation(payload);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* ── Left — dark hero — tablet+ only ── */}
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

        {/* Content */}
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

          {/* Headline */}
          <h1 className="font-display text-3xl lg:text-4xl font-bold text-white leading-tight mb-4">
            Organise ta{' '}
            <span style={{ color: 'var(--sage-light)' }}>famille</span>
            <br />au même endroit
          </h1>
          <p className="text-base leading-relaxed mb-10" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Centralise agenda, recettes, tâches et listes de courses pour toute la famille.
          </p>

          {/* Features list */}
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

      {/* ── Right — form ── */}
      <section
        className="flex flex-col w-full md:w-[440px] md:flex-none bg-white overflow-y-auto px-8 py-8"
      >
        <div className="w-full max-w-sm mx-auto flex flex-col justify-center min-h-full">
          {/* Mobile logo — visible only when left panel is hidden */}
          <div className="flex items-center gap-2 mb-6 md:hidden">
            <div
              className="w-8 h-8 rounded-[10px] flex items-center justify-center shrink-0"
              style={{ background: 'linear-gradient(135deg, var(--ocean) 0%, var(--ocean-light) 100%)' }}
            >
              <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4" aria-hidden="true">
                <path d="M12 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 2a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm0 6c.55 0 1 .45 1 1v1.28A7.01 7.01 0 0 1 19 19h-2a5 5 0 0 0-4-4.9V19l3 2-1 1.5-2-1.33L11 22.5 10 21l3-2v-4.9A5 5 0 0 0 9 19H7a7.01 7.01 0 0 1 6-6.72V11c0-.55.45-1 1-1Z" />
              </svg>
            </div>
            <span className="font-display font-semibold text-base" style={{ color: 'var(--stone)' }}>
              Navigator
            </span>
          </div>

          <div className="mb-5">
            <h2
              className="font-display text-2xl font-bold mb-1"
              style={{ color: 'var(--stone)' }}
            >
              Créer un compte
            </h2>
            <p className="text-sm" style={{ color: 'var(--mist)' }}>
              Entre tes informations pour lancer ton espace Navigator.
            </p>
          </div>

          <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-3">
              <Controller
                name="username"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <div className="col-span-2 space-y-1">
                    <Label htmlFor={field.name} className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--mist)' }}>
                      Nom d'utilisateur
                    </Label>
                    <Input
                      id={field.name}
                      data-testid="username-input"
                      className="h-9 rounded-[var(--radius-sm)] border-black/10 focus:border-[var(--ocean-light)] focus-visible:ring-0 transition-colors"
                      style={{ background: 'var(--sand)' }}
                      {...field}
                      disabled={createProfileIsPending}
                      placeholder="Nom d'utilisateur"
                    />
                  </div>
                )}
              />

              <Controller
                name="email"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <div className="col-span-2 space-y-1">
                    <Label htmlFor={field.name} className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--mist)' }}>
                      Email
                    </Label>
                    <Input
                      id={field.name}
                      data-testid="email-input"
                      type="email"
                      className="h-9 rounded-[var(--radius-sm)] border-black/10 focus:border-[var(--ocean-light)] focus-visible:ring-0 transition-colors"
                      style={{ background: 'var(--sand)' }}
                      {...field}
                      disabled={createProfileIsPending}
                      placeholder="Email"
                    />
                  </div>
                )}
              />

              <Controller
                name="firstName"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <div className="space-y-1">
                    <Label htmlFor={field.name} className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--mist)' }}>
                      Prénom
                    </Label>
                    <Input
                      id={field.name}
                      data-testid="firstname-input"
                      className="h-9 rounded-[var(--radius-sm)] border-black/10 focus:border-[var(--ocean-light)] focus-visible:ring-0 transition-colors"
                      style={{ background: 'var(--sand)' }}
                      {...field}
                      disabled={createProfileIsPending}
                      placeholder="Prénom"
                    />
                  </div>
                )}
              />

              <Controller
                name="lastName"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <div className="space-y-1">
                    <Label htmlFor={field.name} className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--mist)' }}>
                      Nom
                    </Label>
                    <Input
                      id={field.name}
                      data-testid="lastname-input"
                      className="h-9 rounded-[var(--radius-sm)] border-black/10 focus:border-[var(--ocean-light)] focus-visible:ring-0 transition-colors"
                      style={{ background: 'var(--sand)' }}
                      {...field}
                      disabled={createProfileIsPending}
                      placeholder="Nom"
                    />
                  </div>
                )}
              />

              <Controller
                name="password"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <div className="col-span-2 space-y-1">
                    <Label htmlFor={field.name} className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--mist)' }}>
                      Mot de passe
                    </Label>
                    <Input
                      id={field.name}
                      data-testid="password-input"
                      type="password"
                      className="h-9 rounded-[var(--radius-sm)] border-black/10 focus:border-[var(--ocean-light)] focus-visible:ring-0 transition-colors"
                      style={{ background: 'var(--sand)' }}
                      {...field}
                      disabled={createProfileIsPending}
                      placeholder="Mot de passe"
                    />
                  </div>
                )}
              />
            </div>

            <div className="flex flex-col gap-3 pt-1">
              <button
                type="submit"
                disabled={!isValid || createProfileIsPending}
                className="w-full text-white text-sm font-semibold py-2.5 rounded-[var(--radius-sm)] transition-all duration-150 hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0"
                style={{
                  background: 'linear-gradient(135deg, var(--ocean) 0%, var(--ocean-light) 100%)',
                  boxShadow: '0 3px 12px rgba(27,79,138,0.3)',
                }}
              >
                {createProfileIsPending ? 'Chargement...' : "S'inscrire"}
              </button>
              <button
                type="button"
                className="text-sm font-medium transition-colors hover:opacity-70"
                style={{ color: 'var(--mist)' }}
                onClick={redirectToLogin}
              >
                Vous avez déjà un compte ? <span style={{ color: 'var(--ocean)' }}>Se connecter</span>
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Error modal */}
      <Dialog open={isErrorModalOpen} onOpenChange={setIsErrorModalOpen}>
        <DialogContent className="rounded-[var(--radius-md)] border-none" style={{ boxShadow: 'var(--shadow-card)' }}>
          <DialogHeader>
            <DialogTitle className="font-display text-xl font-bold" style={{ color: 'var(--coral)' }}>
              Erreur d'inscription
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm" style={{ color: 'var(--mist)' }}>
            Une erreur est survenue lors de l'inscription. Veuillez contacter le support.
          </p>
        </DialogContent>
      </Dialog>
    </div>
  );
};
