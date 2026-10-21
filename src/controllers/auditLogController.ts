import type { Request, Response } from 'express';
import { AuditLogService } from '../services/auditLogService.ts';

export class AuditLogController {
  constructor(private auditLogService: AuditLogService = new AuditLogService()) {}

  private handleError(res: Response, error: unknown): Response {
    return res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan pada server',
      error: error instanceof Error ? error.message : String(error),
    });
  }

  getLogs = async (req: Request, res: Response): Promise<Response> => {
    try {
      const logs = await this.auditLogService.getAllLogs();
      return res.status(200).json({ status: 'success', data: logs });
    } catch (error) {
      return this.handleError(res, error);
    }
  };

  createLog = async (req: Request, res: Response): Promise<Response> => {
    try {
      const log = await this.auditLogService.createLog(req.body);
      return res.status(201).json({ status: 'success', data: log });
    } catch (error) {
      return this.handleError(res, error);
    }
  };
}
