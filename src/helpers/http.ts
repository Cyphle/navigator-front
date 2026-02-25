import { JsonError } from './error';

export const BASE_PATH = 'api';

// TODO to be tested
export const getMany = <T>(path: string, mapper: (data: any) => T[]): Promise<T[]> => {
  return fetch(`${BASE_PATH}/${path}`, {
    method: 'GET',
    credentials: 'include',
  })
    .then(response => {
      return response.json();
    })
    .then(data => {
      return mapper(data);
    });
}


// TODO to be tested
export const getOne = <T>(path: string, mapper: (data: any) => T): Promise<T> => {
  return fetch(`${BASE_PATH}/${path}`, {
    credentials: 'include',
  })
    .then((response: Response) => {
      if (response.status === 403) {
        throw new JsonError({ code: 403, message: 'Forbidden' });
      }

      return response.json();
    })
    .then(data => {
      return mapper(data);
    });
}

// TODO to be tested
export const post = <R, T>(path: string, body: R, mapper: (data: any) => T): Promise<T> => {
  return fetch(`${BASE_PATH}/${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(body),
  })
    .then(response => {
      return response.json();
    })
    .then(data => {
      return mapper(data);
    });
}

export const put = <R, T>(path: string, body: R, mapper: (data: any) => T): Promise<T> => {
  return fetch(`${BASE_PATH}/${path}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(body),
  })
    .then(response => {
      return response.json();
    })
    .then(data => {
      return mapper(data);
    });
}

export const deleteOne = <T = void>(path: string, mapper?: (data: any) => T): Promise<T> => {
  return fetch(`${BASE_PATH}/${path}`, {
    method: 'DELETE',
    credentials: 'include',
  })
    .then(response => {
      if (response.status === 204) {
        return mapper ? mapper(undefined) : undefined as T;
      }
      return response.json();
    })
    .then(data => {
      return mapper ? mapper(data) : data as T;
    });
}
