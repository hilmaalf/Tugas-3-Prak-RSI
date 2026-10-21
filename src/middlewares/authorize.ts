import type { NextFunction, Request, RequestHandler, Response } from 'express';
import { ForbiddenError } from '../errors/ForbiddenError.ts';
import { getUser } from './auth.ts';
import type { UserRole } from '../repositories/userRepository.ts';

export function authorize(...allowedRoles: UserRole[]): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (allowedRoles.length === 0) {
      return next(new Error('authorize() harus menerima minimal satu role'));
    }

    const user = getUser(req);

    if (!allowedRoles.includes(user.role)) {
      return next(
        new ForbiddenError(`Endpoint ini hanya untuk role: ${allowedRoles.join(', ')}`),
      );
    }

    return next();
  };
}