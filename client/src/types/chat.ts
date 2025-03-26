export interface Chat {
  chatId: string;
  chatType: "personal" | "group";
  participants: string[];
  name?: string;
  image?: string;
  lastMessageContent?: string;
  lastMessageTimestamp?: string;
  lastMessageSenderId?: string;
}
