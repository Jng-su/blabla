import { Message } from '../../message/entites/message.entity';
import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class Chat {
  @PrimaryColumn()
  chatId: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  image: string;

  @Column()
  chatType: string; // "personal" | "group"

  @Column({ type: 'simple-array' })
  participants: string[];

  @OneToMany(() => Message, (message) => message.chat)
  messages: Message[];

  @Column({ nullable: true })
  lastMessageContent: string;

  @Column({ nullable: true })
  lastMessageTimestamp: string;

  @Column({ nullable: true })
  lastMessageSenderId: string;
}
