import { Injectable } from '@nestjs/common';
import { ChatService } from '../../chat/chat.service';
import { MessageService } from '../../message/message.service';
import { WebsocketService } from '../services/websocket.service';
import { UserService } from '../../user/user.service';
import { PrivateMessageDto } from '../dto/private-message.dto';
import { AuthSocket } from '../interface/auth-socket.interface';

@Injectable()
export class MessageHandler {
  constructor(
    private chatService: ChatService,
    private messageService: MessageService,
    private websocketService: WebsocketService,
    private userService: UserService,
  ) {}

  async handlePrivateMessage(
    client: AuthSocket,
    privateMessageDto: PrivateMessageDto,
  ): Promise<void> {
    const senderId = client.user!.id;

    console.log(
      `Processing message from ${senderId} to ${privateMessageDto.toUserId}`,
    );
    if (privateMessageDto.content.length > 500) {
      throw new Error('Message content exceeds 500 characters');
    }

    const chat = await this.chatService.getChatById(privateMessageDto.chatId);
    if (!chat) {
      throw new Error('Chat not found');
    }

    const message = await this.messageService.saveMessage(
      chat.chatId,
      senderId,
      privateMessageDto.toUserId,
      privateMessageDto.content,
    );

    const messageCount = await this.messageService.getMessageCount(chat.chatId);
    if (messageCount === 1) {
      const participants = chat.participants;
      for (const participantId of participants) {
        const isSender = participantId === senderId;
        const opponent = isSender
          ? await this.userService.getUserById(
              participants.find((id) => id !== senderId)!,
            )
          : await this.userService.getUserById(senderId);

        const chatData = {
          chatId: chat.chatId,
          chatType: chat.chatType,
          participants: chat.participants,
          name: opponent.name,
          image: opponent.profile_image || null,
        };

        this.websocketService.broadcastEvent('chatCreated', chatData, [
          participantId,
        ]);
      }
    }

    const messageData = {
      chatId: chat.chatId,
      fromUserId: message.fromUserId,
      toUserId: message.toUserId,
      content: message.content,
      timestamp: message.timestamp,
    };

    this.websocketService.broadcastEvent(
      'privateMessage',
      messageData,
      chat.participants,
    );

    console.log(`Message sent successfully from ${senderId}`);
  }
}
