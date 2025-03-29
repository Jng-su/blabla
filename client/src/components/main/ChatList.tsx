import { useEffect, useState } from "react";
import CreateChatModal from "../modals/CreateChatModal";
import { useGetChats } from "../../query/queries/chat";
import { useGetFriends } from "../../query/queries/user";
import socket from "../../api/config/socket";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { ChatListProps } from "../../types/main-props";
import { Chat } from "../../types/chat";
import { Friend } from "../../types/friend";

export default function ChatList({
  onChatSelect,
  currentUserId,
  selectedChatId,
}: ChatListProps) {
  const [isCreateChatModalOpen, setIsCreateChatModalOpen] = useState(false);
  const { data: chatsData } = useGetChats();
  const { data: friends } = useGetFriends();
  const [chats, setChats] = useState<Chat[]>([]);

  const DEFAULT_CHAT_IMAGE =
    "https://blabla-cloud.s3.ap-northeast-2.amazonaws.com/public/default-chat-image.png";

  useEffect(() => {
    if (chatsData) {
      setChats(
        chatsData.map((chat: Chat) => {
          const isOpponentMissing = chat.participants.length === 1;
          return {
            ...chat,
            name: isOpponentMissing ? "알수없음" : chat.name,
            image: isOpponentMissing ? DEFAULT_CHAT_IMAGE : chat.image,
            lastMessage: chat.lastMessageContent
              ? {
                  content: chat.lastMessageContent,
                  timestamp: chat.lastMessageTimestamp!,
                }
              : undefined,
          };
        })
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
    if (!currentUserId || !friends) return;

    const selectedFriend: Friend | undefined = friends.find(
      (friend: Friend) => friend.id === friendId
    );
    if (!selectedFriend) return;

    const participants = [currentUserId, friendId].sort();
    const chatId = `personal-${participants.join("-")}`;
    const existingChat = chats.find((chat) => chat.chatId === chatId);

    if (existingChat) {
      onChatSelect(existingChat);
      setIsCreateChatModalOpen(false);
      return;
    }

    const newChat: Chat = {
      chatId,
      chatType: "personal",
      participants,
      name: selectedFriend.name,
      image: selectedFriend.profile_image || undefined,
    };

    socket.emit("createChat", {
      chatId,
      chatType: "personal",
      participants,
      name: selectedFriend.name,
      image: selectedFriend.profile_image,
    });
    onChatSelect(newChat);
    setIsCreateChatModalOpen(false);
  };

  const handleChatSelect = (chatId: string) => {
    const selectedChat = chats.find((chat) => chat.chatId === chatId);
    if (selectedChat) {
      onChatSelect(selectedChat);
    }
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
                chat.name === "알수없음"
                  ? selectedChatId === chat.chatId
                    ? "bg-gray-300 text-gray-600" // 선택 시 흐린 회색
                    : "bg-gray-200 text-gray-500 hover:bg-gray-300" // 기본 흐린 회색
                  : selectedChatId === chat.chatId
                  ? "bg-[#575076] text-white" // 선택 시 보라색
                  : "bg-white hover:bg-gray-100 text-gray-800" // 기본 흰색
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
                          chat.name === "알수없음"
                            ? "text-gray-400" // 탈퇴 시 흐린 글씨
                            : selectedChatId === chat.chatId
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
                        chat.name === "알수없음"
                          ? "text-gray-400"
                          : selectedChatId === chat.chatId
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
