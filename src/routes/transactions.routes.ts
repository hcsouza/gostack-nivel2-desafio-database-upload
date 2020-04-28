import { Router } from 'express';
import { getCustomRepository } from 'typeorm';
import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';
import multer from 'multer';
import uploadConfig from '../config/upload';

const transactionsRouter = Router();
const upload = multer(uploadConfig);

transactionsRouter.get('/', async (request, response) => {
  const repository = getCustomRepository(TransactionsRepository);
  const transactions = await repository.find();
  const balance = await repository.getBalance();
  return response.json({
    transactions: transactions,
    balance: balance,
  });
});

transactionsRouter.post('/', async (request, response) => {
  const { title, value, type, category } = request.body;

  const createService = new CreateTransactionService();
  const transaction = await createService.execute({ title, value, type, categoryName: category });
  return response.json(transaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
    const { id } = request.params;
    const deleteService = new DeleteTransactionService();
    await deleteService.execute({ id });
    return response.status(204).send();
});

transactionsRouter.post('/import',upload.single('file'), async (request, response) => {

  const fileName = request.file.filename;
  const importService = new ImportTransactionsService();
  await importService.execute({fileName});
  return response.send({ status: 'ok'});
});

export default transactionsRouter;
