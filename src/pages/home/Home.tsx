import { GoToRegistrationButton } from '../../components/go-to-registration-button/GoToRegistrationButton.tsx';
import './Home.scss';

export const Home = () => {

  // TODO clean
  // useEffect(() => {
  //   fetch(`${BASE_PATH}/set`, {})
  //   .then((data) => {
  //     console.log('data', data);
  //   })
  //   .catch((err) => {
  //     console.log('err', err);
  //   });
  // }, []);

  return (
    <div className="homepage">
      <div className="main-title">
        <h1>Banana</h1>
        <p>Un gestionnaire de compte bancaire facile et familial</p>
      </div>

      <section>
        <h2>Pour suivre facilement tes comptes</h2>

        <p>Crée des comptes et ajoute tes dépenses en fonction de leurs natures</p>

        <GoToRegistrationButton />
      </section>

      <section>
        <h2>Des comptes personnels, commun et épargne</h2>

        <p>Différencie tes comptes personnels, commun et épargne. Partage ceux que tu veux avec tes contacts</p>

        <GoToRegistrationButton />
      </section>
    </div>
  )
}