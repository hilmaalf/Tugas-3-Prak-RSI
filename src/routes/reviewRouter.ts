import { Router } from 'express';
import { ReviewController } from '../controllers/reviewController.ts';

const reviewRouter = Router();
const reviewController = new ReviewController();

reviewRouter.get('/', (req, res) => {
  // #swagger.parameters['stallId'] = { in: 'query', type: 'integer' }
  // #swagger.responses[200] = { description: 'Daftar review (JOIN nama user)' }
  return reviewController.getReviews(req, res);
});

reviewRouter.post('/', (req, res) => {
  // #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/ReviewInput' } }
  // #swagger.responses[201] = { description: 'Review dibuat' }
  return reviewController.createReview(req, res);
});

reviewRouter.delete('/:id', (req, res) => {
  // #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
  return reviewController.deleteReview(req, res);
});

export { reviewRouter };
