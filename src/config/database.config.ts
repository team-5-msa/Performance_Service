import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { PerformanceModel } from '../performances/entities/performances.entity';
import { ReservationModel } from '../reservations/entities/reservation.entity';

export default registerAs(
  'database',
  (): TypeOrmModuleOptions => ({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [PerformanceModel, ReservationModel],
    synchronize: false,
    ssl: {
      rejectUnauthorized: false,
    },
    logging: true,
    extra: {
      max: 1,
      connectionTimeoutMillis: 5000,
      idleTimeoutMillis: 30000,
    },
  }),
);
