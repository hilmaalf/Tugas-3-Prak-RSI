export interface AuditLogResponseDto {
  id: number;
  userId: number;
  action: string;
  targetTable: string;
  targetId: number;
  metadata: string | null;
  createdAt: Date | null;
}
