import { AppError } from './AppError.ts';

export interface ValidationIssue {
  field: string;
  message: string;
}

export class ValidationError extends AppError {
  constructor(public readonly issues: ValidationIssue[]) {
    super(400, 'Validasi gagal', issues);
    this.name = 'ValidationError';
  }
}