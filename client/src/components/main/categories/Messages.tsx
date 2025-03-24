import { useState, useEffect } from "react";
import CreateChatModal from "../../modals/CreateChatModal";
import { useGetChats } from "../../../query/queries/chat";
import socket from "../../../api/config/socket";

interface Chat {
  chatId: string;
  chatType: "personal";
  participants: string[];
}

interface MessagesProps {
  onChatSelect: (chatId: string | null) => void;
}

export default function Messages({ onChatSelect }: MessagesProps) {
  const [isCreateChatModalOpen, setIsCreateChatModalOpen] = useState(false);
  const { data: chatsData } = useGetChats();
  const [chats, setChats] = useState<Chat[]>(chatsData || []);

  useEffect(() => {
    if (chatsData) {
      setChats(chatsData);
    }
  }, [chatsData]);

  const handleSelectFriend = (friendId: string) => {
    socket.emit("createChat", {
      toUserId: friendId,
      chatType: "personal",
    });
  };

  useEffect(() => {
    socket.on("chatCreated", (chat) => {
      console.log("New chat created:", chat);
      setChats((prev) => {
        if (!prev.some((c) => c.chatId === chat.chatId)) {
          return [...prev, chat];
        }
        return prev;
      });
      // 생성자가 새 채팅을 시작한 경우에만 선택
      onChatSelect(chat.chatId); // 새 채팅방으로 이동
      setIsCreateChatModalOpen(false); // 모달 닫기
    });

    return () => {
      socket.off("chatCreated");
    };
  }, [onChatSelect]);

  const handleChatSelect = (chatId: string) => {
    onChatSelect(chatId);
  };

  return (
    <div className="flex flex-col h-full">
      <button
        className="w-full btn-secondary"
        onClick={() => setIsCreateChatModalOpen(true)}
      >
        + 채팅 생성
      </button>
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-4">채팅 목록</h2>
        {chats.length > 0 ? (
          chats.map((chat) => (
            <div
              key={chat.chatId}
              className="p-2 border-b cursor-pointer hover:bg-gray-100"
              onClick={() => handleChatSelect(chat.chatId)}
            >
              <p>참여자: {chat.participants.join(", ")}</p>
            </div>
          ))
        ) : (
          <p>채팅을 생성해주세요. 👋</p>
        )}
      </div>
      <CreateChatModal
        isOpen={isCreateChatModalOpen}
        onClose={() => setIsCreateChatModalOpen(false)}
        onSelectFriend={handleSelectFriend}
      />
    </div>
  );
}
