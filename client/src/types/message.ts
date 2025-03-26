export interface Message {
  id: string;
  chatId: string;
  fromUserId: string;
  toUserId: string;
  content: string;
  timestamp: string;
}
