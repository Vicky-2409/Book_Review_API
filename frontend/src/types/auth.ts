export interface User {
    id: string;
    username: string;
    email: string;
    isAdmin: boolean;
  }
  
  export interface AuthResponse {
    user: User;
    token: string;
    message: string;
  }
  
  export interface LoginCredentials {
    email: string;
    password: string;
  }
  
  export interface RegisterCredentials {
    username: string;
    email: string;
    password: string;
  }