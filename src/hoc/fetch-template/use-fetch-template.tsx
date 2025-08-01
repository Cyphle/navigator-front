import { UseQueryResult } from '@tanstack/react-query';

interface FetchTemplateProps<T> {
  query: UseQueryResult<T, Error>;
  children: (data: T) => React.ReactNode;
}

function FetchTemplate<T>({ query, children }: FetchTemplateProps<T>) {
  const { isPending, isError, data, error } = query;

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return <>{children(data as T)}</>;
}

export function withFetchTemplate<P extends object, T>(
  WrappedComponent: React.ComponentType<P>,
  useQuery: () => UseQueryResult<T, Error>
) {
  return (props: Omit<P, keyof T>) => {
    const query = useQuery();

    return (
      <FetchTemplate query={query}>
        {(data) => <WrappedComponent {...(props as P)} {...{ data: data as T }} />}
      </FetchTemplate>
    );
  };
}
