import { IReview, IReviewQueryParams, IReviewResponse } from '../../interfaces/IReview';

export interface IReviewRepository {
  create(review: IReview): Promise<IReviewResponse>;
  findById(id: string): Promise<IReviewResponse | null>;
  findByBookId(bookId: string, params: IReviewQueryParams): Promise<IReviewResponse[]>;
  findByUserAndBook(userId: string, bookId: string): Promise<IReviewResponse | null>;
  update(id: string, review: Partial<IReview>): Promise<IReviewResponse | null>;
  delete(id: string): Promise<boolean>;
  getAverageRatingForBook(bookId: string): Promise<number>;
}