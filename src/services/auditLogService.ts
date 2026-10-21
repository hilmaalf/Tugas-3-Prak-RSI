import { AuditLogRepository, type CreateAuditLogInput } from '../repositories/auditLogRepository.ts';
import type { AuditLogResponseDto } from '../dtos/auditLogDto.ts';

export class AuditLogService {
  constructor(private auditLogRepository: AuditLogRepository = new AuditLogRepository()) {}

  private toDto(row: any): AuditLogResponseDto {
    return {
      id: row.id,
      userId: row.userId,
      action: row.action,
      targetTable: row.targetTable,
      targetId: row.targetId,
      metadata: row.metadata,
      createdAt: row.createdAt,
    };
  }

  async getAllLogs(): Promise<AuditLogResponseDto[]> {
    const rows = await this.auditLogRepository.findAll();
    return rows.map((row) => this.toDto(row));
  }

  async createLog(input: CreateAuditLogInput): Promise<AuditLogResponseDto> {
    const row = await this.auditLogRepository.create(input);
    if (!row) throw new Error('AUDIT_LOG_NOT_FOUND');
    return this.toDto(row);
  }
}
