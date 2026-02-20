import './Registration.scss';
import { CreateProfileRequest } from '../../stores/profile/profile.types.ts';
import { Button, Input, Modal } from 'antd';
import { useCreateProfile } from '../../stores/profile/profile.commands.ts';
import { useEffect, useState } from 'react';
import { useToaster } from '../../components/toaster/Toaster.tsx';
import { redirectToLogin } from '../../helpers/navigation.ts';
import { Controller, useForm } from 'react-hook-form';

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
    <div className="registration-page">
      <section className="registration-card registration-hero">
        <span className="registration-hero__badge">Navigator</span>
        <h1>Crée toi un compte</h1>
        <p className="registration-hero__subtitle">
          Centralise tes comptes, visualise les tendances et garde une vue claire sur
          tes projets personnels.
        </p>

        <ul className="registration-hero__list">
          <li className="registration-hero__item">
            <span className="registration-hero__dot registration-hero__dot--primary" />
            <div>
              <p className="registration-hero__item-title">Pilotage clair</p>
              <p className="registration-hero__item-text">
                Regroupe tes mouvements importants sur un seul tableau.
              </p>
            </div>
          </li>
          <li className="registration-hero__item">
            <span className="registration-hero__dot registration-hero__dot--secondary" />
            <div>
              <p className="registration-hero__item-title">Vue hebdomadaire</p>
              <p className="registration-hero__item-text">
                Planifie les prochaines semaines sans perdre le rythme.
              </p>
            </div>
          </li>
          <li className="registration-hero__item">
            <span className="registration-hero__dot registration-hero__dot--accent" />
            <div>
              <p className="registration-hero__item-title">Alertes utiles</p>
              <p className="registration-hero__item-text">
                Recois des rappels quand tes objectifs bougent.
              </p>
            </div>
          </li>
        </ul>

        <div className="registration-hero__stats">
          <div className="registration-hero__stat">
            <p className="registration-hero__stat-value">1 tableau</p>
            <p className="registration-hero__stat-label">Budget, comptes, objectifs</p>
          </div>
          <div className="registration-hero__stat">
            <p className="registration-hero__stat-value">3 vues</p>
            <p className="registration-hero__stat-label">Jour, semaine, mois</p>
          </div>
        </div>
      </section>

      <section className="registration-card registration-form">
        <div className="registration-form__header">
          <h2>Informations du compte</h2>
          <p>Entre les informations principales pour lancer ton espace.</p>
        </div>

        <form
          className="registration-form__form"
          onSubmit={ handleSubmit(onSubmit) }
        >
          <div className="registration-form__grid">
            <Controller
              name="username"
              control={ control }
              rules={ { required: true } }
              render={ ({ field }) => (
                <div className="registration-form__field registration-form__field--full">
                  <label htmlFor={ field.name }>Nom d'utilisateur</label>
                  <Input
                    id={ field.name }
                    data-testid="username-input"
                    value={ field.value }
                    onBlur={ field.onBlur }
                    onChange={ field.onChange }
                    name={ field.name }
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
                <div className="registration-form__field registration-form__field--full">
                  <label htmlFor={ field.name }>Email</label>
                  <Input
                    id={ field.name }
                    data-testid="email-input"
                    value={ field.value }
                    onBlur={ field.onBlur }
                    onChange={ field.onChange }
                    name={ field.name }
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
                <div className="registration-form__field">
                  <label htmlFor={ field.name }>Prénom</label>
                  <Input
                    id={ field.name }
                    data-testid="firstname-input"
                    value={ field.value }
                    onBlur={ field.onBlur }
                    onChange={ field.onChange }
                    name={ field.name }
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
                <div className="registration-form__field">
                  <label htmlFor={ field.name }>Nom</label>
                  <Input
                    id={ field.name }
                    data-testid="lastname-input"
                    value={ field.value }
                    onBlur={ field.onBlur }
                    onChange={ field.onChange }
                    name={ field.name }
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
                <div className="registration-form__field registration-form__field--full">
                  <label htmlFor={ field.name }>Mot de passe</label>
                  <Input.Password
                    id={ field.name }
                    data-testid="password-input"
                    value={ field.value }
                    onBlur={ field.onBlur }
                    onChange={ field.onChange }
                    name={ field.name }
                    disabled={ createProfileIsPending }
                    placeholder="Mot de passe"
                  />
                </div>
              ) }
            />
          </div>

          <div className="registration-form__actions">
            <Button
              className="registration-form__submit"
              type="primary"
              htmlType="submit"
              loading={ createProfileIsPending }
              disabled={ !isValid || createProfileIsPending }
            >
              S'inscrire
            </Button>
            <Button
              className="registration-form__link"
              type="text"
              onClick={ handleLoginRedirect }
            >
              Si vous avez déjà un compte connectez vous
            </Button>
          </div>
        </form>
      </section>
      <Modal
        open={isErrorModalOpen}
        onCancel={() => setIsErrorModalOpen(false)}
        footer={null}
        title="Erreur"
      >
        <p>Something went wrong with your registration. Please contact the support.</p>
      </Modal>
    </div>
  );
}
