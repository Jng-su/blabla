import { useState, useEffect } from "react";
import CreateChatModal from "../../modals/CreateChatModal";
import { useGetChats } from "../../../query/queries/chat";
import { authApi } from "../../../api/auth";
import socket from "../../../api/config/socket";

interface Chat {
  chatId: string;
  chatType: "personal" | "group";
  participants: string[];
  name?: string;
  image?: string;
}

interface MessagesProps {
  onChatSelect: (chatId: string | null) => void;
}

export default function ChatList({ onChatSelect }: MessagesProps) {
  const [isCreateChatModalOpen, setIsCreateChatModalOpen] = useState(false);
  const { data: chatsData } = useGetChats();
  const [chats, setChats] = useState<Chat[]>(chatsData || []);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userInfo = await authApi.getMyInfo();
        setCurrentUserId(userInfo.id);
      } catch (error) {
        console.error("Failed to fetch user info:", error);
      }
    };
    fetchUserInfo();
  }, []);

  useEffect(() => {
    if (chatsData) {
      console.log("Chats from useGetChats:", chatsData);
      setChats(chatsData);
    }
  }, [chatsData]);

  useEffect(() => {
    socket.on("chatCreated", (newChat: Chat) => {
      console.log("Chat created event:", newChat);
      setChats((prev) => {
        if (prev.some((chat) => chat.chatId === newChat.chatId)) return prev;
        return [...prev, newChat];
      });
    });

    return () => {
      socket.off("chatCreated");
    };
  }, []);

  const handleSelectFriend = (friendId: string) => {
    if (!currentUserId) return;
    const participants = [currentUserId, friendId].sort();
    const chatId = `personal-${participants.join("-")}`;

    console.log("Creating chat with:", { chatId, participants });
    socket.emit("createChat", { chatId, chatType: "personal", participants });
    onChatSelect(chatId);
    setIsCreateChatModalOpen(false);
  };

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
              <img
                src={chat.image || "https://via.placeholder.com/40"}
                alt={chat.name || "User"}
                className="w-10 h-10 rounded-full mr-3 object-cover"
              />
              <p>{chat.name || "Unnamed Chat"}</p>
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
