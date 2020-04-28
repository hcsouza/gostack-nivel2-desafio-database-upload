import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {

  public async getBalance(): Promise<Balance> {
    // TODO
    const incomes = await this.find({where: { type: 'income' }});
    const totalIncome = incomes.map(incomes => Number(incomes.value))
                               .reduce((acc, income) => acc + income, 0);

    const outcomes = await this.find({ where: { type: 'outcome' }});
    const totalOutcome = outcomes.map(outcomes => Number(outcomes.value))
                          .reduce((acc, outcome) => acc + outcome, 0);

    return {  income: totalIncome,
              outcome: totalOutcome,
              total: totalIncome - totalOutcome
    }
  }
}

export default TransactionsRepository;
