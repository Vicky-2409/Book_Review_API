// src/repositories/interfaces/IBookRepository.ts
import { IBook, IBookQueryParams, IBookResponse, IPaginatedResponse } from '../../interfaces/IBook';

export interface IBookRepository {
  create(book: IBook): Promise<IBookResponse>;
  findById(id: string): Promise<IBookResponse | null>;
  findAll(params: IBookQueryParams): Promise<IPaginatedResponse<IBookResponse>>;
  update(id: string, book: Partial<IBook>): Promise<IBookResponse | null>;
  delete(id: string): Promise<boolean>;
  search(query: string): Promise<IBookResponse[]>;
}