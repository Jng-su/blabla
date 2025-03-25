import { User } from 'src/modules/user/entites/user.entity';
import { Chat } from '../../chat/entites/chat.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Chat, (chat) => chat.messages)
  chat: Chat;

  @Column({ name: 'from_user_id' })
  fromUserId: string;

  @ManyToOne(() => User, { nullable: false })
  fromUser: User;

  @Column({ name: 'to_user_id' })
  toUserId: string;

  @Column()
  content: string;

  @Column()
  timestamp: string;
}
