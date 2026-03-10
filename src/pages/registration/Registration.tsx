import { CreateProfileRequest } from '../../stores/profile/profile.types.ts';
import { useCreateProfile } from '../../stores/profile/profile.commands.ts';
import { useEffect, useState } from 'react';
import { useToaster } from '../../components/toaster/Toaster.tsx';
import { redirectToLogin } from '../../helpers/navigation.ts';
import { Controller, useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface RegistrationFormValues {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

export const Registration = () => {
  const { notify } = useToaster();
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);

  useEffect(() => {
    notify({
      type: 'info',
      title: 'Vous allez etre la bienvenue',
    });
  }, [notify]);

  const handleLoginRedirect = () => {
    redirectToLogin();
  };

  const onCreateProfileError = (_: string) => {
    setIsErrorModalOpen(true);
  };

  const onCreateProfileSuccess = () => {
    redirectToLogin();
  };

  const {
    mutate: createProfileMutation,
    isPending: createProfileIsPending,
  } = useCreateProfile(onCreateProfileError, onCreateProfileSuccess);

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<RegistrationFormValues>({
    mode: 'onChange',
    defaultValues: {
      username: '',
      email: '',
      firstName: '',
      lastName: '',
      password: '',
    },
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
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="flex-1 p-12 lg:p-24 flex flex-col justify-center bg-white border-b lg:border-b-0 lg:border-r border-gray-100">
        <div className="max-w-xl">
          <span className="inline-block px-3 py-1 text-[10px] tracking-[0.2em] uppercase font-light text-blue-500 border border-blue-500 mb-8">
            Navigator
          </span>
          <h1 className="text-4xl lg:text-5xl font-extralight tracking-tight text-black mb-6 uppercase">
            Crée toi un compte
          </h1>
          <p className="text-gray-400 font-light text-lg leading-relaxed mb-12">
            Centralise tes comptes, visualise les tendances et garde une vue claire sur
            tes projets personnels.
          </p>

          <ul className="space-y-8 mb-12 list-none p-0">
            <li className="flex items-start gap-4">
              <span className="w-2 h-2 rounded-full bg-blue-500 mt-2 shrink-0" />
              <div>
                <p className="text-sm font-light tracking-widest uppercase mb-1">Pilotage clair</p>
                <p className="text-gray-400 font-light text-sm">
                  Regroupe tes mouvements importants sur un seul tableau.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <span className="w-2 h-2 rounded-full bg-black mt-2 shrink-0" />
              <div>
                <p className="text-sm font-light tracking-widest uppercase mb-1">Vue hebdomadaire</p>
                <p className="text-gray-400 font-light text-sm">
                  Planifie les prochaines semaines sans perdre le rythme.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <span className="w-2 h-2 rounded-full bg-gray-300 mt-2 shrink-0" />
              <div>
                <p className="text-sm font-light tracking-widest uppercase mb-1">Alertes utiles</p>
                <p className="text-gray-400 font-light text-sm">
                  Recois des rappels quand tes objectifs bougent.
                </p>
              </div>
            </li>
          </ul>

          <div className="flex gap-12 pt-12 border-t border-gray-100">
            <div>
              <p className="text-2xl font-extralight text-black mb-1">1 tableau</p>
              <p className="text-gray-400 text-xs font-light uppercase tracking-widest">Budget, comptes, objectifs</p>
            </div>
            <div>
              <p className="text-2xl font-extralight text-black mb-1">3 vues</p>
              <p className="text-gray-400 text-xs font-light uppercase tracking-widest">Jour, semaine, mois</p>
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="flex-1 p-12 lg:p-24 flex flex-col justify-center bg-gray-50">
        <div className="max-w-md w-full mx-auto">
          <div className="mb-12">
            <h2 className="text-xl font-light tracking-widest uppercase mb-2">Informations du compte</h2>
            <p className="text-gray-400 font-light text-sm">Entre les informations principales pour lancer ton espace.</p>
          </div>

          <form
            className="space-y-6"
            onSubmit={ handleSubmit(onSubmit) }
          >
            <div className="grid grid-cols-2 gap-6">
              <Controller
                name="username"
                control={ control }
                rules={ { required: true } }
                render={ ({ field }) => (
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor={ field.name } className="text-[10px] uppercase tracking-widest font-light text-gray-400">Nom d'utilisateur</Label>
                    <Input
                      id={ field.name }
                      data-testid="username-input"
                      className="rounded-none border-gray-200 focus:border-blue-500 focus-visible:ring-0 transition-colors"
                      { ...field }
                      disabled={ createProfileIsPending }
                      placeholder="Nom d'utilisateur"
                    />
                  </div>
                ) }
              />

              <Controller
                name="email"
                control={ control }
                rules={ { required: true } }
                render={ ({ field }) => (
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor={ field.name } className="text-[10px] uppercase tracking-widest font-light text-gray-400">Email</Label>
                    <Input
                      id={ field.name }
                      data-testid="email-input"
                      type="email"
                      className="rounded-none border-gray-200 focus:border-blue-500 focus-visible:ring-0 transition-colors"
                      { ...field }
                      disabled={ createProfileIsPending }
                      placeholder="Email"
                    />
                  </div>
                ) }
              />

              <Controller
                name="firstName"
                control={ control }
                rules={ { required: true } }
                render={ ({ field }) => (
                  <div className="space-y-2">
                    <Label htmlFor={ field.name } className="text-[10px] uppercase tracking-widest font-light text-gray-400">Prénom</Label>
                    <Input
                      id={ field.name }
                      data-testid="firstname-input"
                      className="rounded-none border-gray-200 focus:border-blue-500 focus-visible:ring-0 transition-colors"
                      { ...field }
                      disabled={ createProfileIsPending }
                      placeholder="Prénom"
                    />
                  </div>
                ) }
              />

              <Controller
                name="lastName"
                control={ control }
                rules={ { required: true } }
                render={ ({ field }) => (
                  <div className="space-y-2">
                    <Label htmlFor={ field.name } className="text-[10px] uppercase tracking-widest font-light text-gray-400">Nom</Label>
                    <Input
                      id={ field.name }
                      data-testid="lastname-input"
                      className="rounded-none border-gray-200 focus:border-blue-500 focus-visible:ring-0 transition-colors"
                      { ...field }
                      disabled={ createProfileIsPending }
                      placeholder="Nom"
                    />
                  </div>
                ) }
              />

              <Controller
                name="password"
                control={ control }
                rules={ { required: true } }
                render={ ({ field }) => (
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor={ field.name } className="text-[10px] uppercase tracking-widest font-light text-gray-400">Mot de passe</Label>
                    <Input
                      id={ field.name }
                      data-testid="password-input"
                      type="password"
                      className="rounded-none border-gray-200 focus:border-blue-500 focus-visible:ring-0 transition-colors"
                      { ...field }
                      disabled={ createProfileIsPending }
                      placeholder="Mot de passe"
                    />
                  </div>
                ) }
              />
            </div>

            <div className="flex flex-col gap-4 pt-4">
              <Button
                type="submit"
                className="w-full bg-black hover:bg-gray-800 text-white rounded-none py-6 uppercase tracking-widest font-light text-sm transition-all"
                disabled={ !isValid || createProfileIsPending }
              >
                {createProfileIsPending ? "Chargement..." : "S'inscrire"}
              </Button>
              <Button
                variant="link"
                className="text-gray-400 hover:text-black text-xs font-light uppercase tracking-widest no-underline"
                onClick={ handleLoginRedirect }
              >
                Si vous avez déjà un compte connectez vous
              </Button>
            </div>
          </form>
        </div>
      </section>

      <Dialog open={isErrorModalOpen} onOpenChange={setIsErrorModalOpen}>
        <DialogContent className="rounded-none border-gray-200">
          <DialogHeader>
            <DialogTitle className="text-xl font-light uppercase tracking-widest">Erreur</DialogTitle>
          </DialogHeader>
          <p className="text-gray-400 font-light text-sm">Something went wrong with your registration. Please contact the support.</p>
        </DialogContent>
      </Dialog>
    </div>
  );
};
