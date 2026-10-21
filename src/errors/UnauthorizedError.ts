import { AppError } from './AppError.ts';

export class UnauthorizedError extends AppError {
  constructor(message = 'Token tidak ada atau tidak valid') {
    super(401, message);
    this.name = 'UnauthorizedError';
  }
}