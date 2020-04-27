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
    const incomeFind = await this.find({ where: { type: 'income' } });
    const income = incomeFind
      .map(transaction => {
        return transaction.value;
      })
      .reduce((before, total) => {
        return before + total;
      }, 0);

    const outcomeFind = await this.find({ where: { type: 'outcome' } });
    const outcome = outcomeFind
      .map(transaction => {
        return transaction.value;
      })
      .reduce((before, total) => {
        return before + total;
      }, 0);

    const total = income - outcome;
    return { income, outcome, total };
  }
}

export default TransactionsRepository;
