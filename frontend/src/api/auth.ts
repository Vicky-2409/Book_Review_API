import apiClient from './client';
import type { AuthResponse, LoginCredentials, RegisterCredentials, User } from '../types/auth';

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
  return response.data;
};

export const register = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/auth/signup', credentials);
  return response.data;
};

export const getProfile = async (): Promise<User> => {
  const response = await apiClient.get<{ user: User }>('/auth/profile');
  return response.data.user;
};

export const logout = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};