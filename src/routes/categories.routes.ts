import { Router } from 'express';
import CreateTransactionCategoryService from '../services/CreateTransactionCategoryService';

const categoryRouter = Router();

categoryRouter.post('/', async (request, response) => {
  const { title } = request.body;

  const createCategoryService = new CreateTransactionCategoryService();
  const category = await createCategoryService.execute({ title });

  return response.json(category);
});

export default categoryRouter;
