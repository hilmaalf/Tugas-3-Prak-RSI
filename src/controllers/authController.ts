import type { Request, Response } from 'express';
import { AuthService } from '../services/authService.ts';
import { getUser } from '../middlewares/auth.ts';
import { getValidated } from '../middlewares/validate.ts';
import type { LoginInput, RegisterInput } from '../schemas/authSchema.ts';

export class AuthController {
  private authService: AuthService;

  constructor(authService: AuthService = new AuthService()) {
    this.authService = authService;
  }

  register = async (_req: Request, res: Response): Promise<void> => {
    const body = getValidated<RegisterInput>(res, 'body');
    const user = await this.authService.register(body);
    res.status(201).json({ status: 'success', data: { user } });
  };

  login = async (_req: Request, res: Response): Promise<void> => {
    const body = getValidated<LoginInput>(res, 'body');
    const data = await this.authService.login(body);
    res.status(200).json({ status: 'success', data });
  };

  getMe = async (req: Request, res: Response): Promise<void> => {
    const user = getUser(req);
    res.status(200).json({ status: 'success', data: user });
  };
}
