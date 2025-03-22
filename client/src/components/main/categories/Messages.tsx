import { useState, useEffect } from "react";
import CreateChatModal from "../../modals/CreateChatModal";
import socket from "../../../api/socket";

interface Chat {
  chatId: string;
  chatType: "personal";
  participants: string[];
}

export default function Messages() {
  const [isCreateChatModalOpen, setIsCreateChatModalOpen] = useState(false);
  const [chats, setChats] = useState<Chat[]>([]);

  useEffect(() => {
    socket.on("chatCreated", (chat: Chat) => {
      console.log("Chat created:", chat);
      setChats((prev) => [...prev, chat]);
    });
    return () => {
      socket.off("chatCreated");
    };
  }, []);

  const handleCreateChat = (chatType: "personal", selectedFriendId: string) => {
    socket.emit("createChat", { chatType, friendId: selectedFriendId });
    setIsCreateChatModalOpen(false);
  };

  return (
    <div className="flex flex-col h-full">
      <button
        className="w-full btn-secondary"
        onClick={() => setIsCreateChatModalOpen(true)}
      >
        + 개인 채팅 생성
      </button>
      <div className="p-6">
        {chats.length > 0 ? (
          chats.map((chat) => (
            <div key={chat.chatId} className="p-2 border-b">
              <p>개인 채팅 - ID: {chat.chatId}</p>
              <p>참여자: {chat.participants.join(", ")}</p>
            </div>
          ))
        ) : (
          <p>채팅이 없습니다.</p>
        )}
      </div>
      <CreateChatModal
        isOpen={isCreateChatModalOpen}
        onClose={() => setIsCreateChatModalOpen(false)}
        onCreate={handleCreateChat}
      />
    </div>
  );
}
