import './Registration.scss';
import {formOptions, useForm} from '@tanstack/react-form';
import {CreateProfileRequest} from '../../stores/profile/profile.types.ts';
import {Button, Form, Input} from 'antd';
import {useCreateProfile} from '../../stores/profile/profile.commands.ts';
import {useNavigate} from 'react-router';
import {useEffect} from 'react';
import {BASE_PATH} from '../../helpers/http.ts';

export const Registration = () => {
  const navigate = useNavigate();

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

  const options = formOptions<CreateProfileRequest>({
    defaultValues: {
      username: '',
      email: '',
      firstName: '',
      lastName: '',
    },
  });

  const form = useForm({
    ...options,
    onSubmit: async ({ value }) => {
      createProfileMutation({
        username: value.username,
        email: value.email,
        firstName: value.firstName,
        lastName: value.lastName,
      });
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
    useEffect(() => {
        fetch(`${BASE_PATH}/register`, {})
            .then((response: Response) => {
                console.log('delete session res', response);
            });
    }, []);

  return (
    <div className="registration-page">
      <h1>Crée toi un compte</h1>

      <Form
        labelCol={ { span: 8 } }
        wrapperCol={ { span: 16 } }
        style={ { maxWidth: 600 } }
        onFinish={ () => {
          form.handleSubmit();
        } }
      >
        <form.Field
          name="username"
          children={ (field) => (
            <>
              <label htmlFor={ field.name }>Nom d'utilisateur :</label>
              <Input
                data-testid="username-input"
                value={ field.state.value }
                onBlur={ field.handleBlur }
                onChange={ (e: any) => field.handleChange(e.target.value) }
                disabled={createProfileIsPending}
                placeholder="Nom d'utilisateur"/>
            </>
          ) }
        />

        <form.Field
          name="email"
          children={ (field) => (
            <>
              <label htmlFor={ field.name }>Email :</label>
              <Input
                data-testid="email-input"
                value={ field.state.value }
                onBlur={ field.handleBlur }
                onChange={ (e: any) => field.handleChange(e.target.value) }
                placeholder="Email"/>
            </>
          ) }
        />

        <form.Field
          name="firstName"
          children={ (field) => (
            <>
              <label htmlFor={ field.name }>Prénom :</label>
              <Input
                data-testid="firstname-input"
                value={ field.state.value }
                onBlur={ field.handleBlur }
                onChange={ (e: any) => field.handleChange(e.target.value) }
                placeholder="Prénom"/>
            </>
          ) }
        />

        <form.Field
          name="lastName"
          children={ (field) => (
            <>
              <label htmlFor={ field.name }>Nom :</label>
              <Input
                data-testid="lastname-input"
                value={ field.state.value }
                onBlur={ field.handleBlur }
                onChange={ (e: any) => field.handleChange(e.target.value) }
                placeholder="Nom"/>
            </>
          ) }
        />

        <Form.Item wrapperCol={ { offset: 8, span: 16 } }>
          <Button type="primary" htmlType="submit">
            S'inscrire
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}