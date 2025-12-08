import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import databaseConfig from './config/database.config';
import { PerformancesModule } from './performances/performances.module';
import { ReservationsModule } from './reservations/reservations.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { UserHeaderMiddleware } from './common/middleware/user-header.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        configService.getOrThrow('database'),
    }),
    PerformancesModule,
    ReservationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // JWT 토큰에서 user_id 추출하여 x-user-id 헤더 추가 (로컬 개발용)
    consumer.apply(UserHeaderMiddleware).forRoutes('*');
    // 모든 요청의 헤더 로깅
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
