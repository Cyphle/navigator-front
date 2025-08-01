export interface Profile {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface CreateProfileRequest {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
}