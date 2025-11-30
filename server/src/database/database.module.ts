import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getDatabaseConfig } from './helpers/get-database-config.helper';

export const createDatabaseModule = () =>
  TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => ({
      ...getDatabaseConfig(configService),
      autoLoadEntities: true,
      synchronize: false,
    }),
  });
