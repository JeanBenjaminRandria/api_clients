import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ConnectionOptions } from 'tls';

export const databaseProviders = [
  TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    async useFactory(config: ConfigService) {
      const connect = {
        type: 'postgres',
        host: config.get<string>('database.host'),
        user: config.get<string>('database.user'),
        password: config.get<string>('database.password'),
        database: config.get<string>('database.name'),
        entities: [__dirname + './../**/*.entity{.ts,.js}'],
        migrations: [__dirname + '/migrations/*.{ts,.js}'],
      } as ConnectionOptions;
      return connect;
    },
  }),
];
