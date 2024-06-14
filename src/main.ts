import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app';
import { ValidationPipe } from './pipes';

async function main(): Promise<void> {
  const { PORT } = process.env;
  const app = await NestFactory.create(AppModule);

  const documentConfig = new DocumentBuilder()
    .setTitle('Тестовый сервер')
    .setDescription('Документация REST API')
    .setVersion('0.0.1')
    .build();
  const document = SwaggerModule.createDocument(app, documentConfig);
  SwaggerModule.setup('/api/docs', app, document);

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(PORT);
  process.stdin.write(`\n\tThe server runs: http://localhost:${PORT}/\n`);
}

main().catch((error) => {
  throw error;
});
