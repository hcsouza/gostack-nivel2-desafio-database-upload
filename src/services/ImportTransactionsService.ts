import Transaction from '../models/Transaction';
import CsvTransactionParser from '../utils/CsvTransactionParser';
import TransactionRepository from '../repositories/TransactionsRepository';
import CategoryRepository from '../repositories/CategoryRepository';
import { getCustomRepository, In} from 'typeorm';
import Category from '../models/Category';
import uploadConfig from '../config/upload';

interface Request {
  fileName: string;
}

class ImportTransactionsService {

  async execute({fileName}: Request): Promise<Transaction[]> {

    const categoryNames: string[] = []
    const csvParser = new CsvTransactionParser({ fileName, path: uploadConfig.directory });
    const transactionDtos = await csvParser.execute();
    const repository = getCustomRepository(TransactionRepository);

    transactionDtos.map(transaction => {
      categoryNames.push(transaction.category);
    })

    const categories = await this.createCategories(categoryNames);
    const createdTransactions = repository.create(
      transactionDtos.map(transaction => ({
          title: transaction.title,
          type: transaction.type,
          value: transaction.value,
          category: categories.find(
            category => category.title === transaction.category,
          ),
        }))
    );
    repository.save(createdTransactions);
    return createdTransactions;
  }

  private async createCategories(categories: string[]): Promise<Category[]> {
    const repoCategory = getCustomRepository(CategoryRepository);
    const categoryAlreadyCreated = await repoCategory.find({ where: { title: In(categories) } });
    const categoryAlreadyCreatedNames = categoryAlreadyCreated.map(category => category.title);

    const categoriesNameToCreate = categories.filter(category =>
      !categoryAlreadyCreatedNames.includes(category)
    ).filter((value, index, self) => self.indexOf(value) === index);

    const categoriesToCreate: Category[] = [];
    categoriesNameToCreate.map(categoryName => {
      categoriesToCreate.push(repoCategory.create({ title: categoryName }))
    });
    await repoCategory.save(categoriesToCreate);
    return [ ...categoryAlreadyCreated, ...categoriesToCreate ]
  }

}

export default ImportTransactionsService;
