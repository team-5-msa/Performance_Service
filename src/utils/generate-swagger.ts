import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';
import * as path from 'path';
import { AppModule } from '../app.module';

async function generateSwaggerJson() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Performance Service API')
    .setDescription(
      '공연 예약 서비스 REST API\n\n' +
        '공연 정보 관리 및 좌석 예약 기능을 제공합니다.\n' +
        '- 공연 CRUD 기능\n' +
        '- 좌석 임시 예약\n' +
        '- 예약 확정/취소/환불',
    )
    .setVersion('1.0.0')
    .addBearerAuth()
    .addTag('performances', '공연 관리 API')
    .addTag('reservations', '예약 관리 API')
    .addServer('https://performance-service.vercel.app', 'Production')
    .addServer('http://localhost:3000', 'Development')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  const publicDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const swaggerPath = path.join(publicDir, 'swagger.json');
  fs.writeFileSync(swaggerPath, JSON.stringify(document, null, 2));
  console.log(`✅ Swagger JSON generated at ${swaggerPath}`);

  await app.close();
}

generateSwaggerJson().catch((err) => {
  console.error('Error generating Swagger JSON:', err);
  process.exit(1);
});
