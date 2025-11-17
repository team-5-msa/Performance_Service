import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PerformancesModule } from './performances/performances.module';

@Module({
  imports: [PerformancesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
