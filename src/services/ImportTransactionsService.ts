import CSVtoJSON from 'csvtojson';
import { getRepository } from 'typeorm';
import path from 'path';
import fs from 'fs';
import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';

interface Request {
  filename: string;
}

class ImportTransactionsService {
  async execute({ filename }: Request): Promise<Transaction[]> {
    const transactionRepository = getRepository(Transaction);

    if (!filename) throw new AppError('Please, select a CSV file.');
    const csvFile = await CSVtoJSON().fromFile(
      path.resolve(__dirname, '..', '..', 'tmp', filename),
    );

    const transactions = transactionRepository.create(csvFile);
    await transactionRepository.save(transactions);

    await fs.promises.unlink(
      path.resolve(__dirname, '..', '..', 'tmp', filename),
    );

    return transactions;
  }
}

export default ImportTransactionsService;
