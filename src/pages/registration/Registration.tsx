import './Registration.scss';
import { formOptions, useForm } from '@tanstack/react-form';
import { CreateProfileRequest } from '../../stores/profile/profile.types.ts';
import { Button, Form, Input } from 'antd';
import { useCreateProfile } from '../../stores/profile/profile.commands.ts';
import { useNavigate } from 'react-router';
import { useEffect } from 'react';
import { useToaster } from '../../components/toaster/Toaster.tsx';

interface RegistrationFormValues {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

export const Registration = () => {
  const navigate = useNavigate();
  const { notify } = useToaster();

  useEffect(() => {
    notify({
      type: 'info',
      title: 'Vous allez etre la bienvenue',
    });
  }, [notify]);

  const handleLoginRedirect = () => {
    window.location.href = 'http://localhost:9000/login';
  };

  const onCreateProfileError = (_: string) => {
    // TODO do something
  };

  const onCreateProfileSuccess = () => {
    // TODO do something better than redirecting to homepager
    navigate(`/`);
  };

  const {
    mutate: createProfileMutation,
    isPending: createProfileIsPending,
  } = useCreateProfile(onCreateProfileError, onCreateProfileSuccess);

  const options = formOptions<RegistrationFormValues>({
    defaultValues: {
      username: '',
      email: '',
      firstName: '',
      lastName: '',
      password: '',
    },
  });

  const form = useForm({
    ...options,
    onSubmit: async ({ value }) => {
      const payload: CreateProfileRequest = {
        username: value.username,
        email: value.email,
        first_name: value.firstName,
        last_name: value.lastName,
        password: value.password,
      };

      createProfileMutation(payload);
    },
  });

// // TODO clean
//   useEffect(() => {
//     fetch(`${BASE_PATH}/get-from-session`, {})
//     .then((data) => {
//       console.log('data from session', data);
//     })
//     .catch((err) => {
//       console.log('err', err);
//     });
//   }, []);
//
//
// // TODO clean
//     useEffect(() => {
//         fetch(`${BASE_PATH}/profiles`, {})
//             .then((response: Response) => {
//                 if (response.status === 403) {
//                     throw new JsonError({ code: 403, message: 'Forbidden' });
//                 }
//
//                 return response.json();
//             })
//             .then(data => {
//                 console.log('profile view', data);
//             });
//     }, []);

// // TODO clean
//     useEffect(() => {
//         fetch(`${BASE_PATH}/delete-from-session`, {})
//             .then((response: Response) => {
//                 console.log('delete session res', response);
//             });
//     }, []);

// // TODO clean
//     useEffect(() => {
//         fetch(`${BASE_PATH}/logout`, {})
//             .then((response: Response) => {
//                 console.log('logout res', response);
//             });
//     }, []);

// TODO clean
//     useEffect(() => {
//         fetch(`${BASE_PATH}/register`, {})
//             .then((response: Response) => {
//                 console.log('delete session res', response);
//             });
//     }, []);

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

        <Form
          layout="vertical"
          className="registration-form__form"
          onFinish={ () => {
            form.handleSubmit();
          } }
        >
          <div className="registration-form__grid">
            <form.Field
              name="username"
              children={ (field) => (
                <div className="registration-form__field registration-form__field--full">
                  <label htmlFor={ field.name }>Nom d'utilisateur</label>
                  <Input
                    id={ field.name }
                    data-testid="username-input"
                    value={ field.state.value }
                    onBlur={ field.handleBlur }
                    onChange={ (e: any) => field.handleChange(e.target.value) }
                    disabled={ createProfileIsPending }
                    placeholder="Nom d'utilisateur"
                  />
                </div>
              ) }
            />

            <form.Field
              name="email"
              children={ (field) => (
                <div className="registration-form__field registration-form__field--full">
                  <label htmlFor={ field.name }>Email</label>
                  <Input
                    id={ field.name }
                    data-testid="email-input"
                    value={ field.state.value }
                    onBlur={ field.handleBlur }
                    onChange={ (e: any) => field.handleChange(e.target.value) }
                    disabled={ createProfileIsPending }
                    placeholder="Email"
                  />
                </div>
              ) }
            />

            <form.Field
              name="firstName"
              children={ (field) => (
                <div className="registration-form__field">
                  <label htmlFor={ field.name }>Prénom</label>
                  <Input
                    id={ field.name }
                    data-testid="firstname-input"
                    value={ field.state.value }
                    onBlur={ field.handleBlur }
                    onChange={ (e: any) => field.handleChange(e.target.value) }
                    disabled={ createProfileIsPending }
                    placeholder="Prénom"
                  />
                </div>
              ) }
            />

            <form.Field
              name="lastName"
              children={ (field) => (
                <div className="registration-form__field">
                  <label htmlFor={ field.name }>Nom</label>
                  <Input
                    id={ field.name }
                    data-testid="lastname-input"
                    value={ field.state.value }
                    onBlur={ field.handleBlur }
                    onChange={ (e: any) => field.handleChange(e.target.value) }
                    disabled={ createProfileIsPending }
                    placeholder="Nom"
                  />
                </div>
              ) }
            />

            <form.Field
              name="password"
              children={ (field) => (
                <div className="registration-form__field registration-form__field--full">
                  <label htmlFor={ field.name }>Mot de passe</label>
                  <Input.Password
                    id={ field.name }
                    data-testid="password-input"
                    value={ field.state.value }
                    onBlur={ field.handleBlur }
                    onChange={ (e: any) => field.handleChange(e.target.value) }
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
        </Form>
      </section>
    </div>
  );
}
