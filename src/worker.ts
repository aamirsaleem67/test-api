import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication } from '@nestjs/common';

export interface Env {
  // Define your environment variables here if needed
  [key: string]: string;
}

let app: INestApplication;

export default {
  // Using the Cloudflare Workers types
  async fetch(request: Request, env: Env, ctx: any): Promise<Response> {
    try {
      if (!app) {
        app = await NestFactory.create(AppModule);
        await app.init();
      }

      // Convert the Cloudflare request to a Node.js request
      const url = new URL(request.url);
      const path = url.pathname + url.search;

      // Simplified approach with type assertions for safety
      const httpAdapter = app.getHttpAdapter();

      // Note: This is a simplified implementation that might not work perfectly
      // due to differences between Cloudflare Workers and Node.js environments
      const response: any = await httpAdapter.getInstance().handle(request, {
        path,
        method: request.method,
        headers: Object.fromEntries(request.headers),
      });

      return new Response(response.body || '', {
        status: response.statusCode || 200,
        headers: response.headers || {},
      });
    } catch (error) {
      console.error(error);
      return new Response(
        JSON.stringify({
          error: 'Internal Server Error',
          message: error instanceof Error ? error.message : 'Unknown error',
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
    }
  },
};
