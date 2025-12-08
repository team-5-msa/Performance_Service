import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum CATEGORY {
  THEATER = 'THEATER',
  MUSICAL = 'MUSICAL',
  CONCERT = 'CONCERT',
  EXHIBITION = 'EXHIBITION',
  MOVIE = 'MOVIE',
}

@Entity('performances')
export class PerformanceModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'enum', enum: Object.values(CATEGORY) })
  category: CATEGORY;

  @Column()
  venue: string;

  @Column({ nullable: true })
  imageUrl?: string;

  @Column()
  price: number;

  @Column({ default: 0, nullable: false })
  totalSeats: number;

  @Column({ default: 0, nullable: false })
  availableSeats: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
