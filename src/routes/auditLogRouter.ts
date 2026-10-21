import { Router } from 'express';
import { AuditLogController } from '../controllers/auditLogController.ts';

const auditLogRouter = Router();
const auditLogController = new AuditLogController();

auditLogRouter.get('/', (req, res) => {
  // #swagger.responses[200] = { description: 'Daftar audit log' }
  return auditLogController.getLogs(req, res);
});

auditLogRouter.post('/', (req, res) => {
  // #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/AuditLogInput' } }
  return auditLogController.createLog(req, res);
});

export { auditLogRouter };
