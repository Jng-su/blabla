import { User } from 'src/modules/user/entites/user.entity';
import { Chat } from '../../chat/entites/chat.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  chatId: string;

  @ManyToOne(() => Chat, (chat) => chat.messages)
  chat: Chat;

  @Column({ name: 'from_user_id' }) // 명시적으로 컬럼 이름 지정
  fromUserId: string;

  @ManyToOne(() => User, { nullable: false }) // fromUserId가 NOT NULL이어야 함
  fromUser: User;

  @Column({ name: 'to_user_id' })
  toUserId: string;

  @Column()
  content: string;

  @Column()
  timestamp: string;
}
