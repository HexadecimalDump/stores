import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { createDatabaseModule } from './database/database.module';
import { StoresModule } from './stores/stores.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    createDatabaseModule(),
    StoresModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
