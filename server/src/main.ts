import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger();

  /* Swagger */
  const config = new DocumentBuilder()
    .setTitle('API')
    .setDescription('API docs')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory, {
    explorer: true,
    swaggerUrl: '/docs-json',
    swaggerOptions: {
      spec: false,
      deepLinking: true,
      docExpansion: 'list',
      filter: true,
      tryItOutEnabled: true,
    },
  });
  /* --- */

  const port = process.env.PORT ?? 8080;
  await app
    .listen(port)
    .then(() =>
      logger.debug(`Application is available at http://localhost:${port}/docs`),
    );
}

bootstrap().catch((err) => console.error(err));
