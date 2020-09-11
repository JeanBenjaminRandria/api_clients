import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configOptions } from './config/config.options';
import { DatabaseModule } from './database/database.module';
import { ClientsModule } from './clients/clients.module';

@Module({
  imports: [ConfigModule.forRoot(configOptions), DatabaseModule, ClientsModule],
})
export class AppModule {}
