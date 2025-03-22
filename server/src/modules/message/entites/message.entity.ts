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

  @Column()
  fromUserId: string;

  @Column()
  toUserId: string;

  @Column()
  content: string;

  @Column()
  timestamp: string;
}
