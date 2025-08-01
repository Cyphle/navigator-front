export interface HttpError {
  code: number;
  message: string;
}

export class JsonError<T extends HttpError> extends Error {
  readonly json: T;

  constructor(json: T) {
    super(json.message);
    this.name = 'JsonError';
    this.json = json;
  }
}
