import { ConfigService } from '@nestjs/config';
import { DatabaseConfigurationKeys } from '../../config/types';

export const getDatabaseConfig = (configService: ConfigService) => ({
  type: 'postgres' as const,
  host: configService.get<string>(
    DatabaseConfigurationKeys.POSTGRES_HOST,
    'localhost',
  ),
  port: +configService.get<number>(
    DatabaseConfigurationKeys.POSTGRES_PORT,
    5432,
  ),
  username: configService.get<string>(
    DatabaseConfigurationKeys.POSTGRES_USER,
    'admin',
  ),
  password: configService.get<string>(
    DatabaseConfigurationKeys.POSTGRES_PASSWORD,
    'admin',
  ),
  database: configService.get<string>(
    DatabaseConfigurationKeys.POSTGRES_DB,
    'inventory',
  ),
});
