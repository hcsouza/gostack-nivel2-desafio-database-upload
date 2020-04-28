import {MigrationInterface, QueryRunner, Table} from "typeorm";
import { uuid } from 'uuidv4';

export default class createCategoryTransactionTable1587825001720 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
      queryRunner.createTable(
        new Table({
          name: 'categories',
          columns: [
            {
              name: 'id',
              type: 'uuid',
              isPrimary: true,
              generationStrategy: 'uuid',
              default: 'uuid_generate_v4()',
            },
            {
             name: 'title',
             type: 'varchar',
             isNullable: false,
             isUnique: true,
            },
            {
              name: 'created_at',
              type: 'timestamp',
              default: 'now()',
            },
            {
              name: 'updated_at',
              type: 'timestamp',
              default: 'now()',
            },
          ],
        })
      );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      queryRunner.dropTable('categories');
    }

}
