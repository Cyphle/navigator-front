import { useNavigate } from 'react-router';
import { useFetchAccountSummaries } from '../../stores/account/account.queries.ts';
import { AccountSummary } from '../../stores/account/account.types.ts';
import { withFetchTemplate } from '../../hoc/fetch-template/use-fetch-template.tsx';

const AccountsPageContent = ({ data }: { data: AccountSummary[] }) => {
  const navigate = useNavigate();

  return (
    <div>
      <section>
        <div className="indicator">
          <span className="indicator__label">Total montants courants</span>
          <span className="indicator__value">1000€</span>
        </div>
        <div className="indicator">
          <span className="indicator__label">Total montants projetés</span>
          <span className="indicator__value">1000€</span>
        </div>
        <div className="indicator">
          <span className="indicator__label">Total épargnes</span>
          <span className="indicator__value">1000€</span>
        </div>
      </section>

      <h1>Mes comptes</h1>

      <ul className="accounts">
        {data.map((account: AccountSummary) => (
          <li key={account.id}>
            <span>{account.name}</span>
            <span>{account.startingBalance}</span>
            <span>{account.projectedBalance}</span>
            <button onClick={() => navigate(`/accounts/${account.id}`)}>Go</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const AccountsPage = withFetchTemplate<any, AccountSummary[]>(AccountsPageContent, useFetchAccountSummaries);
