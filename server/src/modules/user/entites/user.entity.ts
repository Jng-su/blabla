import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true, default: null })
  statusMessage: string;

  @Column({
    default:
      'https://blabla-cloud.s3.ap-northeast-2.amazonaws.com/public/default-profile-image.png',
    nullable: true,
  })
  profile_image: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: 'user', nullable: true })
  role: string;

  @ManyToMany(() => User, (user) => user.friends, {
    cascade: ['insert', 'update'],
  })
  @JoinTable({
    name: 'user_friends',
    joinColumn: { name: 'userId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'friendId', referencedColumnName: 'id' },
  })
  friends: User[];
}
