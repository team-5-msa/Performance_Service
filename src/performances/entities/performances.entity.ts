import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum CATEGORY {
  THEATER = '연극',
  MUSICAL = '뮤지컬',
  CONCERT = '콘서트',
  EXHIBITION = '전시',
  MOVIE = '영화',
}

export enum GENRE {
  DRAMA = '드라마',
  COMEDY = '코미디',
  ROMANCE = '로맨스',
  ACTION = '액션',
  HORROR = '공포',
}

@Entity('performances')
export class PerformanceModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  title: string; // 공연 제목

  @Column({ type: 'text' })
  description: string; // 공연 설명

  @Column({ type: 'enum', enum: CATEGORY })
  category: CATEGORY; // 공연 카테고리(연극, 뮤지컬, 콘서트, 전시, 영화 등) // parentId 사용해서 같은 카테고리 내에서 하위 카테고리 표현 가능

  @Column({ type: 'enum', enum: GENRE })
  genre: GENRE; // 장르(드라마, 코미디, 로맨스 등)

  @Column()
  venue: string; // 공연 장소

  @Column({ nullable: true })
  imageUrl?: string; // 포스터 이미지 URL

  @Column()
  price: number; // 티켓 가격

  @Column()
  startDate: Date; // 공연 시작일

  @Column()
  endDate: Date; // 공연 종료일

  @Column()
  runningTime: number; // 러닝타임 (분 단위)

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
