import csvParse from 'csv-parse';
import fs from 'fs';
import path from 'path';
import { stringLiteral } from '@babel/types';
import { TransactionDto } from '../interfaces/CsvTransactionDto';

interface ParserArguments {
  fileName: string;
  path: string;
}


class CsvTransactionParser {
  private fileName: string;
  private path: string;
  private lines: TransactionDto[];

  constructor({ fileName, path }: ParserArguments) {
    this.fileName = fileName;
    this.path = path;
    this.lines = [];
  }

  public async execute(): Promise<TransactionDto[]> {
    const data = await this.loadCSV();
    return data;
  }

  private async loadCSV(): Promise<TransactionDto[]> {
    const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp', this.fileName);
    const readCSVStream = fs.createReadStream(tmpFolder);

    const parseStream = csvParse({
      from_line: 2,
      ltrim: true,
      rtrim: true,
    });

    const parseCSV = readCSVStream.pipe(parseStream);

    parseCSV.on('data', async line => {
      const [title, type, value, category] = line;
      this.lines.push({title, type, value, category});
    });

    await new Promise(resolve => {
      parseCSV.on('end', resolve);
    });

    return this.lines;
  }
}

export default CsvTransactionParser;

