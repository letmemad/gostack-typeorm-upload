import { getRepository } from 'typeorm';
import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionRepo = getRepository(Transaction);
    const transaction = await transactionRepo.findOne(id);
    if (!transaction) throw new AppError('Transaction not found', 404);
    await transactionRepo.remove(transaction);
  }
}

export default DeleteTransactionService;
