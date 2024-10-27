import { HttpAdapterHost, NestFactory } from '@nestjs/core';

import { AppModule } from './dist/app.module';
import { ValidationPipe } from '@nestjs/common';

// Keep the app instance in memory for subsequent requests
let app;
export default async function handler(req, res) {
  // Bootstrap our NestJS app on cold start
  if (!app) {
    const app = await NestFactory.create(AppModule, { cors: true });

    app.enableCors({
      origin: ['http://localhost:4200', 'https://stockware.kristopherfana.me'],
      credentials: true,
    });

    app.useGlobalPipes(
      new ValidationPipe({
        // Require decorator for field to be present
        whitelist: true,

        // Use class-transformer
        transform: true,

        // Use validator and transformer in response
        always: true,
      }),
    );

    // This is important
    await app.init();
  }
  const adapterHost = app.get(HttpAdapterHost);
  const httpAdapter = adapterHost.httpAdapter;
  const instance = httpAdapter.getInstance();

  instance(req, res);
}
