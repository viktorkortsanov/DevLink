export interface RegsiterData {
    username: string,
    email: string,
    role: string,
    password: string,
    rePassword: string,
}

export interface LoginData {
    email: string,
    password: string,
}

export interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
  isAdmin: boolean;
}

export interface AuthResponse {
    user: User
}