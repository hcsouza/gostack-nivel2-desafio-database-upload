import AppError from '../errors/AppError';
import { getCustomRepository } from 'typeorm';
import TransactionRepository from '../repositories/TransactionsRepository';

 interface Request {
   id: string;
 }

class DeleteTransactionService {
  public async execute({ id }:Request): Promise<void> {
    try {
      const repository = getCustomRepository(TransactionRepository);
      await repository.delete({id});
    } catch(err){
      throw new AppError(`Error on delete Transaction with id: ${id}`, 500);
    }
  }
}

export default DeleteTransactionService;
