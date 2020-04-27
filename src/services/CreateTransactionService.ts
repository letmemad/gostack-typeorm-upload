import { getRepository, getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';
import Category from '../models/Category';
import TransactionRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionRepo = getRepository(Transaction);
    const categoryRepo = getRepository(Category);
    if (!title || !value || !type || !category) {
      throw new AppError('Please, fill in up all the inputs');
    }

    if (!(await categoryRepo.findOne({ where: { title: category } }))) {
      const newCategory = categoryRepo.create({ title: category });
      await categoryRepo.save(newCategory);
    }

    const balance = getCustomRepository(TransactionRepository).getBalance();
    if (type === 'outcome' && (await balance).total < value) {
      throw new AppError('Funds are not enough');
    }

    const findCategory = await categoryRepo.findOne({
      where: {
        title: category,
      },
    });

    const transaction = transactionRepo.create({
      title,
      value,
      type,
      category_id: findCategory?.id,
    });

    await transactionRepo.save(transaction);
    return transaction;
  }
}

export default CreateTransactionService;
