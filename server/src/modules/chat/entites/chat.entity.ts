import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { Message } from '../../message/entites/message.entity';

@Entity()
export class Chat {
  @PrimaryColumn()
  chatId: string;

  @Column({ nullable: true }) // 개인 채팅은 이름이 없을 수도 있음
  name: string;

  @Column({ nullable: true }) // 개인 채팅은 이미지가 없을 수도 있음
  image: string;

  @Column()
  chatType: string; // 개인, 그룹

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
