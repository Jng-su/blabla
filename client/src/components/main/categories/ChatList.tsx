import { useState, useEffect } from "react";
import CreateChatModal from "../../modals/CreateChatModal";
import { useGetChats } from "../../../query/queries/chat";
import { authApi } from "../../../api/auth";
import socket from "../../../api/config/socket";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

interface Chat {
  chatId: string;
  chatType: "personal" | "group";
  participants: string[];
  name?: string;
  image?: string;
  lastMessageContent?: string;
  lastMessageTimestamp?: string;
  lastMessageSenderId?: string;
}

interface MessagesProps {
  onChatSelect: (chatId: string | null) => void;
}

export default function ChatList({ onChatSelect }: MessagesProps) {
  const [isCreateChatModalOpen, setIsCreateChatModalOpen] = useState(false);
  const { data: chatsData } = useGetChats();
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

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
      setChats(
        chatsData.map((chat: Chat) => ({
          ...chat,
          lastMessage: chat.lastMessageContent
            ? {
                content: chat.lastMessageContent,
                timestamp: chat.lastMessageTimestamp!,
              }
            : undefined,
        }))
      );
    }
  }, [chatsData]);

  useEffect(() => {
    socket.on("chatCreated", (newChat: Chat) => {
      setChats((prev) => {
        if (prev.some((chat) => chat.chatId === newChat.chatId)) return prev;
        return [...prev, newChat];
      });
    });

    socket.on(
      "message",
      (message: {
        chatId: string;
        content: string;
        timestamp: string;
        senderId: string;
      }) => {
        setChats((prev) =>
          prev.map((chat) =>
            chat.chatId === message.chatId
              ? {
                  ...chat,
                  lastMessageContent: message.content,
                  lastMessageTimestamp: message.timestamp,
                  lastMessageSenderId: message.senderId,
                  lastMessage: {
                    content: message.content,
                    timestamp: message.timestamp,
                  },
                }
              : chat
          )
        );
      }
    );

    return () => {
      socket.off("chatCreated");
      socket.off("message");
    };
  }, []);

  const handleSelectFriend = (friendId: string) => {
    if (!currentUserId) return;
    const participants = [currentUserId, friendId].sort();
    const chatId = `personal-${participants.join("-")}`;
    socket.emit("createChat", { chatId, chatType: "personal", participants });
    onChatSelect(chatId);
    setIsCreateChatModalOpen(false);
  };

  const handleChatSelect = (chatId: string) => {
    setSelectedChatId(chatId);
    onChatSelect(chatId);
  };

  const truncateMessage = (content: string) => {
    if (content.length <= 15) return content;
    return content.slice(0, 15) + " ...";
  };

  return (
    <div className="flex flex-col h-full">
      <button
        className="w-full btn-secondary"
        onClick={() => setIsCreateChatModalOpen(true)}
      >
        + 채팅 생성
      </button>
      <h2 className="text-lg font-bold my-4">채팅 목록</h2>
      <div>
        {chats.length > 0 ? (
          chats.map((chat) => (
            <div
              key={chat.chatId}
              className={`cursor-pointer p-4 mb-3 rounded-lg shadow-lg ${
                selectedChatId === chat.chatId
                  ? "bg-[#575076] text-white"
                  : "bg-white hover:bg-gray-100"
              }`}
              onClick={() => handleChatSelect(chat.chatId)}
            >
              <div className="flex items-center">
                {chat.image && (
                  <img
                    src={chat.image}
                    className="w-11 h-11 mr-3 object-cover rounded-full border-2 border-white"
                  />
                )}
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <p className="font-bold text-base">{chat.name}</p>
                    {chat.lastMessageTimestamp && (
                      <span
                        className={`text-xs ${
                          selectedChatId === chat.chatId
                            ? "text-gray-300"
                            : "text-gray-600"
                        }`}
                      >
                        {formatDistanceToNow(
                          new Date(chat.lastMessageTimestamp),
                          {
                            addSuffix: true,
                            locale: ko,
                          }
                        )}
                      </span>
                    )}
                  </div>
                  {chat.lastMessageContent && (
                    <p
                      className={`text-xs ${
                        selectedChatId === chat.chatId
                          ? "text-gray-300"
                          : "text-gray-600"
                      }`}
                    >
                      {truncateMessage(chat.lastMessageContent)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="p-2 text-gray-600">채팅을 생성해주세요. 👋</p>
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
