import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //Set App
  app.setGlobalPrefix('api');

  const configService = app.get(ConfigService);
  const port = configService.get('app.port');

  // Vaidation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const options = new DocumentBuilder()
    .setTitle('Client')
    .setDescription('Client list api')
    .setVersion('1.0')
    .addTag('Client Api')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  const listener = await app.listen(port, () =>
    console.log(`Server run port ${listener.address().port}`),
  );
}
bootstrap();
