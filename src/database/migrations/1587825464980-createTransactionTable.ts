import {MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";

export default class createTransactionTable1587825464980 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      queryRunner.createTable(
              new Table({
                name: 'transactions',
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
                  },
                  {
                    name: 'type',
                    type: 'varchar',
                    isNullable: false,
                  },
                  {
                    name: 'value',
                    type: 'decimal',
                    precision: 10,
                    scale: 2,
                    isNullable: false,
                  },
                  {
                    name: 'category_id',
                    type: 'uuid',
                    isNullable: true,
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

      queryRunner.createForeignKey('transactions', new TableForeignKey({
        columnNames: ['category_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'categories',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
        name: 'transaction_category_fk',
      }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      queryRunner.dropForeignKey('transactions', 'transaction_category_fk');
      queryRunner.dropTable('transactions');
    }

}
