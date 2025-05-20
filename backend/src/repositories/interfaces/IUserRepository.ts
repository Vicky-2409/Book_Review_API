import { IUser, IUserResponse } from '../../interfaces/IUser';

export interface IUserRepository {
  create(user: IUser): Promise<IUserResponse>;
  findById(id: string): Promise<IUserResponse | null>;
  findByEmail(email: string): Promise<IUser | null>;
  findByUsername(username: string): Promise<IUser | null>;
  update(id: string, user: Partial<IUser>): Promise<IUserResponse | null>;
  delete(id: string): Promise<boolean>;
}