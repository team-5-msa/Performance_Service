import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

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

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
