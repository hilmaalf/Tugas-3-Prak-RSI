import type { Request, Response } from 'express';
import { LikeService } from '../services/likeService.ts';

export class LikeController {
  constructor(private likeService: LikeService = new LikeService()) {}

  private handleError(res: Response, error: unknown): Response {
    if (error instanceof Error && error.message === 'LIKE_NOT_FOUND') {
      return res.status(404).json({ status: 'fail', message: 'Like tidak ditemukan' });
    }
    return res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan pada server',
      error: error instanceof Error ? error.message : String(error),
    });
  }

  createLike = async (req: Request, res: Response): Promise<Response> => {
    try {
      const like = await this.likeService.createLike(req.body);
      return res.status(201).json({ status: 'success', data: like });
    } catch (error) {
      return this.handleError(res, error);
    }
  };

  deleteLike = async (req: Request, res: Response): Promise<Response> => {
    try {
      const like = await this.likeService.deleteLike(Number(req.params.id));
      return res.status(200).json({ status: 'success', data: like });
    } catch (error) {
      return this.handleError(res, error);
    }
  };
}
