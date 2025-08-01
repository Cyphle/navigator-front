export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
}