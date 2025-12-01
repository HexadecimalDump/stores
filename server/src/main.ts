import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger();

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  // Should be more well defined for production environment
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });

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
