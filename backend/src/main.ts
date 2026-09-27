import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import {
  DocumentBuilder,
  SwaggerModule,
} from '@nestjs/swagger';

import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common/pipes/index.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    transform: true,
  }),
);

  const configService = app.get(ConfigService);

  const port =
    configService.get<number>('PORT') ?? 3001;

  const frontendUrl =
    configService.get<string>('FRONTEND_URL') ??
    'http://localhost:3000';

  app.enableCors({
    origin: frontendUrl,
    credentials: true,
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('AgentFlow API')
    .setDescription(
      'Multi-agent decision routing API powered by Jev.',
    )
    .setVersion('1.0')
    .addTag('health')
    .addTag('chat')
    .addTag('agents')
    .addTag('interventions')
    .build();

  const document = SwaggerModule.createDocument(
    app,
    swaggerConfig,
  );

  SwaggerModule.setup('docs', app, document, {
    jsonDocumentUrl: 'docs/json',
  });

  await app.listen(port);

  console.log(
    `API: http://localhost:${port}`,
  );

  console.log(
    `Swagger: http://localhost:${port}/docs`,
  );
}

bootstrap();