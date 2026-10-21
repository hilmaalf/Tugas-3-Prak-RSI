import { AppError } from './AppError.ts';

export class NotFoundError extends AppError {
  constructor(message = 'Data tidak ditemukan') {
    super(404, message);
    this.name = 'NotFoundError';
  }
}