// src/repositories/interfaces/IAuthorRepository.ts
export interface Author {
    name: string;
  }
  
  export interface IAuthorRepository {
    getAllAuthors(): Promise<Author[]>;
  }