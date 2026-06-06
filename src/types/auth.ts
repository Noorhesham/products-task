export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  accessToken: string;
  refreshToken: string;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
}

export interface RegisterInput {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  age: number;
}

export interface RegisteredUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
}

export interface UserSession {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  image: string;
}

export type AuthFormState = { error: string } | null;

