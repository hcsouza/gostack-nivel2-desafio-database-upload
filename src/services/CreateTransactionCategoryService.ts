// import AppError from '../errors/AppError';

import { getRepository } from 'typeorm';
import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface Request {
  title: string;
}

class CreateTransactionCategoryService {
  public async execute({ title }: Request): Promise<Category> {
    const repository = getRepository(Category);

    const category = repository.create({ title });
    await repository.save(category);
    return category;
  }
}

export default CreateTransactionCategoryService;
