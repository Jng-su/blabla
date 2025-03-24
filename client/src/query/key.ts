export const queryKeys = {
  authStatus: ["authStatus"],
  myInfo: ["myInfo"],
  friendsList: ["friendsList"],
  users: ["users"],
  user: ["user"],
  chats: ["chats"],
  messages: (chatId: string | null) => ["messages", chatId],
};
