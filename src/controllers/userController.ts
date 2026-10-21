import type { Request, Response } from 'express';
import { UserService } from '../services/userService.ts';

export class UserController {
  constructor(private userService: UserService = new UserService()) {}

  private handleError(res: Response, error: unknown): Response {
    if (error instanceof Error && error.message === 'USER_NOT_FOUND') {
      return res.status(404).json({ status: 'fail', message: 'User tidak ditemukan' });
    }
    return res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan pada server',
      error: error instanceof Error ? error.message : String(error),
    });
  }

  getUsers = async (req: Request, res: Response): Promise<Response> => {
    try {
      const users = await this.userService.getAllUsers();
      return res.status(200).json({ status: 'success', data: users });
    } catch (error) {
      return this.handleError(res, error);
    }
  };

  getUserById = async (req: Request, res: Response): Promise<Response> => {
    try {
      const user = await this.userService.getUserById(Number(req.params.id));
      return res.status(200).json({ status: 'success', data: user });
    } catch (error) {
      return this.handleError(res, error);
    }
  };

  createUser = async (req: Request, res: Response): Promise<Response> => {
    try {
      const user = await this.userService.createUser(req.body);
      return res.status(201).json({ status: 'success', data: user });
    } catch (error) {
      return this.handleError(res, error);
    }
  };
}
