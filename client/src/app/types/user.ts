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
  savedDevelopers?: string[],
  reviews?: Review,
  location?: string;
  githubLink?: string;
  linkedinLink?: string;
}

export interface Review {
  owner?: {
    _id: string;
    username: string;
    profileImage?: string;
  } | string;
  content: string;
  stars: number;
  createdAt?: string;
}

export interface AuthResponse {
  user: User
}