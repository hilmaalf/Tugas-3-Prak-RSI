import type { Request, Response } from 'express';

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({
    status: 'fail',
    message: `Route tidak ditemukan: ${req.method} ${req.originalUrl}`,
  });
}