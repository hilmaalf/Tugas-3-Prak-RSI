import { AppError } from './AppError.ts';

export class ForbiddenError extends AppError {
  constructor(message = 'Kamu tidak punya akses ke resource ini') {
    super(403, message);
    this.name = 'ForbiddenError';
  }
}