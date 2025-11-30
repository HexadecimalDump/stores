// Used for migrations and seeds
import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { getDatabaseConfig } from './helpers/get-database-config.helper';
config();

const configService = new ConfigService();

const AppDataSource = new DataSource({
  ...getDatabaseConfig(configService),
  synchronize: false,
  entities: ['**/*.entity.ts'],
  migrations: ['src/database/migrations/*-migration.ts'],
  migrationsRun: false,
  migrationsTransactionMode: 'each',
  logging: true,
});

export default AppDataSource;
