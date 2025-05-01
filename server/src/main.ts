import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  app.use(cookieParser());

  const options = {
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    credentials: true,
    allowedHeaders: 'Content-Type, Accept, Authorization',
  };
  app.enableCors(options);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
