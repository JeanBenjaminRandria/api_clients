import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //Set App
  app.setGlobalPrefix('api');

  const configService = app.get(ConfigService);
  const port = configService.get('app.port');

  const listener = await app.listen(port, () =>
    console.log(`Server run port ${listener.address().port}`),
  );
}
bootstrap();
