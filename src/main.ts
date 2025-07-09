import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TrimStringsPipe } from './pipes/trim-strings.pipe';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({ origin: '*', credentials: true });
  app.useGlobalPipes(new TrimStringsPipe());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
