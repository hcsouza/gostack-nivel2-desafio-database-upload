import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';
import { getCustomRepository } from 'typeorm';
import TransactionRepository from '../repositories/TransactionsRepository';
import CategoryRepository from '../repositories/CategoryRepository';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome' ;
  categoryName: string;
}

class CreateTransactionService {
  public async execute({title, value, type, categoryName }: Request): Promise<Transaction> {
    const types = ['income', 'outcome'];
    if(!types.includes(type)){
      throw new AppError('Transaction type not permitted.', 412);
    }

    const categoryRepository = getCustomRepository(CategoryRepository);
    const category = await categoryRepository.findOrCreateByTitle(categoryName);

    const repository = getCustomRepository(TransactionRepository);
    const balance = await repository.getBalance();
    const transaction = repository.create({ title, value, category_id: category.id , type });

    if (transaction.type === 'outcome' && transaction.value > balance.total) {
      throw new AppError('Outcome cannot be greater than your total income.', 400)
    }

    await repository.save(transaction);
    return transaction;
  }

}

export default CreateTransactionService;
