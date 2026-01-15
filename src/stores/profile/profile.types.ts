export interface Profile {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface CreateProfileRequest {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  password: string;
}