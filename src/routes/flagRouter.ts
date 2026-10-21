import { Router } from 'express';
import { FlagController } from '../controllers/flagController.ts';

const flagRouter = Router();
const flagController = new FlagController();

flagRouter.get('/', (req, res) => {
  // #swagger.responses[200] = { description: 'Daftar flag' }
  return flagController.getFlags(req, res);
});

flagRouter.put('/:id', (req, res) => {
  // #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
  // #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/FlagStatusInput' } }
  // #swagger.responses[200] = { description: 'Status flag ter-update' }
  return flagController.updateFlagStatus(req, res);
});

export { flagRouter };
