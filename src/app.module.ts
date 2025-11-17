import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { PerformancesModule } from './performances/performances.module';
import { PerformanceModel } from './performances/entities/performances.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PerformancesModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [PerformanceModel],
      synchronize: false,
      ssl: {
        rejectUnauthorized: false,
      },
      logging: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
