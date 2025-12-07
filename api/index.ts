import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ExpressAdapter } from '@nestjs/platform-express';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import express from 'express';

const server = express();
let app: INestApplication;

async function createApp() {
  if (!app) {
    app = await NestFactory.create(AppModule, new ExpressAdapter(server));

    app.useGlobalPipes(new ValidationPipe());
    app.enableCors();

    const config = new DocumentBuilder()
      .setTitle('Performance Service API')
      .setDescription(
        '공연 예약 서비스 REST API\n\n' +
          '공연 정보 관리 및 좌석 예약 기능을 제공합니다.\n' +
          '- 공연 CRUD 기능\n' +
          '- 좌석 임시 예약\n' +
          '- 예약 확정/취소/환불',
      )
      .setVersion('1.1')
      .addBearerAuth()
      .addTag('performances', '공연 관리 API')
      .addTag('reservations', '예약 관리 API')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    await app.init();
  }
  return server;
}

export default async (req: any, res: any) => {
  const handler = await createApp();
  handler(req, res);
};
