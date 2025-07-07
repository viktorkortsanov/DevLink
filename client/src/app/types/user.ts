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

export interface EdidUserData {
  username: string;
  email: string;
  profileImage?: string;
  bio?: string;
  location?: string;
  githubLink?: string;
  linkedinLink?: string;
}

export interface User {
  _id?: string;
  username: string;
  email: string;
  role?: string;
  isAdmin?: boolean;
  profileImage?: string;
  bio?: string;
  techStack?: string;
  savedProjects?: string[],
  location?: string;
  githubLink?: string;
  linkedinLink?: string;
}

export interface AuthResponse {
    user: User
}