import { useLoaderData } from 'react-router-dom';
import { useFetchAccount } from '../../stores/account/account.queries.ts';
import { Account, TransactionType } from '../../stores/account/account.types.ts';
import {
  DisplayableTransaction,
  filterDisplayableTransactions,
  Transactions
} from '../../components/transactions/Transactions.tsx';
import { fromAccountTransactionsToDisplayableTransactions } from '../../helpers/transaction.ts';
import { AccountIndicators } from '../../components/account-indicators/AccountIndicators.tsx';
import { useEffect, useState } from 'react';
import { AccountParameters } from '../../components/account-parameters/AccountParameters.tsx';

interface AccountParams {
  accountId: string;
}

export async function accountParamsLoader({ params }: { params: { [key: string]: string } }): Promise<AccountParams> {
  return {
    accountId: params.id
  };
}

// TODO to be tested
export const AccountPage = () => {
  const params = useLoaderData() as AccountParams;
  const [transactions, setTransactions] = useState<DisplayableTransaction[]>([]);
  const [displayableTransactions, setDisplayableTransactions] = useState<DisplayableTransaction[]>([]);
  const [showParameters, setShowParameters] = useState(false);
  const { isPending, isError, data, error } = useFetchAccount(parseInt(params.accountId));

  useEffect(() => {
    if (!isPending && !isError) {
      const account = data as Account;
      const transactions = fromAccountTransactionsToDisplayableTransactions(account.transactions);
      setTransactions(transactions);
      setDisplayableTransactions(transactions);
    }
  }, [isPending, data,]);

  // TODO il faut faire un high order component avec template => cf accounts.tsx
  if (isPending) {
    return <span>Loading...</span>
  }

  if (isError) {
    return <span>Error: { error.message }</span>
  }

  const account = data as Account;
  const filterTransactions = (type: TransactionType) => (_: any) => {
    const filtered = filterDisplayableTransactions(transactions, type);
    setDisplayableTransactions(filtered);
  }

  const showHideParameters = () => {
    setShowParameters(!showParameters);
  }

  return (
    <div>
      <h1>{ account.summary.name }</h1>
      <h2>{ account?.summary?.period?.from } to { account?.summary?.period?.to } </h2>

      <section className="actions">
        <button onClick={ filterTransactions('ALL') }>Toutes les opérations</button>
        <button onClick={ filterTransactions('CREDIT') }>Crédits</button>
        <button onClick={ filterTransactions('EXPENSE') }>Dépenses</button>
        <button onClick={ filterTransactions('BUDGET') }>Budgets</button>
        <button onClick={ filterTransactions('CHARGE') }>Charges</button>
        <button onClick={ showHideParameters }>Paramètres</button>
      </section>

      <AccountIndicators
        startOfPeriodAmount={ account.summary.startingBalance }
        currentPeriodAmount={ account.summary.currentBalance }
        endOfPeriodProjectedAmount={ account.summary.projectedBalance }
      >
      </AccountIndicators>

      <Transactions transactions={ displayableTransactions }/>

      { showParameters ? <AccountParameters></AccountParameters> : null }
    </div>
  )
}