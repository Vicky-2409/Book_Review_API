// src/api/authors.ts
import apiClient from './client';
import { handleApiError } from './client';

export interface Author {
  name: string;
}

// Fetch all authors
export const getAuthors = async (): Promise<Author[]> => {
  try {
    const response = await apiClient.get('/authors');
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};