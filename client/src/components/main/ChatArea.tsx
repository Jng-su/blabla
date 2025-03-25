import { useEffect, useState, useRef, FormEvent } from "react";
import { userApi } from "../../api/user";
import { messageApi } from "../../api/message";
import socket from "../../api/config/socket";
import { useGetChats } from "../../query/queries/chat";

interface Message {
  id: string;
  chatId: string;
  fromUserId: string;
  toUserId: string;
  content: string;
  timestamp: string;
}

interface Chat {
  chatId: string;
  chatType: "personal" | "group";
  participants: string[]; // [currentUserId, toUserId] 형태
  name?: string;
  image?: string;
  lastMessageContent?: string;
  lastMessageTimestamp?: string;
  lastMessageSenderId?: string;
}

interface User {
  id: string;
  name: string;
  profile_image?: string;
  statusMessage?: string;
}

export default function ChatArea({
  selectedChatId,
}: {
  selectedChatId: string | null;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [opponentInfo, setOpponentInfo] = useState<User | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { data: chatsData } = useGetChats(); // 채팅 목록 가져오기

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userInfo = await userApi.getMe();
        setCurrentUserId(userInfo.id);
      } catch (error) {
        console.error("Failed to fetch user info:", error);
      }
    };
    fetchUserInfo();
  }, []);

  useEffect(() => {
    if (selectedChatId && currentUserId && chatsData) {
      const fetchMessagesAndOpponentInfo = async () => {
        try {
          // 메시지 가져오기
          const fetchedMessages = await messageApi.getMessagesByChatId(
            selectedChatId
          );
          setMessages(fetchedMessages);
          const selectedChat: Chat | undefined = chatsData.find(
            (chat: Chat) => chat.chatId === selectedChatId
          );
          if (selectedChat) {
            const toUserId = selectedChat.participants.find(
              (id) => id !== currentUserId
            );
            if (toUserId) {
              const opponent = await userApi.getUserByUserId(toUserId);
              console.log(opponent);
              setOpponentInfo({
                id: opponent.id,
                name: opponent.name || toUserId,
                profile_image: opponent.profile_image,
                statusMessage: opponent.statusMessage,
              });
            }
          }
        } catch (error) {
          console.error("Failed to fetch data:", error);
          setMessages([]);
          setOpponentInfo(null);
        }
      };
      fetchMessagesAndOpponentInfo();
    } else {
      setOpponentInfo(null);
    }
  }, [selectedChatId, currentUserId, chatsData]);

  useEffect(() => {
    if (selectedChatId) {
      socket.on("privateMessage", (data: Message) => {
        if (data.chatId === selectedChatId) {
          setMessages((prev) => [
            ...prev,
            { ...data, timestamp: data.timestamp },
          ]);
        }
      });

      return () => {
        socket.off("privateMessage");
      };
    }
  }, [selectedChatId]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedChatId && currentUserId && chatsData) {
      const selectedChat: Chat | undefined = chatsData.find(
        (chat: Chat) => chat.chatId === selectedChatId
      );
      if (selectedChat) {
        const toUserId = selectedChat.participants.find(
          (id) => id !== currentUserId
        );
        if (toUserId) {
          const messageData = {
            chatId: selectedChatId,
            toUserId,
            content: newMessage,
          };
          socket.emit("privateMessage", messageData);
          setNewMessage("");
        }
      }
    }
  };

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSendMessage();
  };

  return (
    <div className="h-full flex flex-col">
      {/* 상대방 정보 표시 영역 */}
      <div className="border-b border-gray-300 h-20 flex items-center pl-6">
        {selectedChatId && opponentInfo ? (
          <div className="flex items-center">
            {opponentInfo.profile_image ? (
              <img
                src={opponentInfo.profile_image}
                alt={opponentInfo.name}
                className="w-12 h-12 mr-3 object-cover rounded-full border-2 border-gray-300"
              />
            ) : (
              <div className="w-10 h-10 mr-3 bg-gray-300 rounded-full" />
            )}
            <div>
              <h2 className="text-lg font-semibold">{opponentInfo.name}</h2>
              {opponentInfo.statusMessage && (
                <p className="text-sm text-gray-500">
                  {opponentInfo.statusMessage}
                </p>
              )}
            </div>
          </div>
        ) : (
          <h2 className="text-lg font-semibold">채팅을 선택해주세요</h2>
        )}
      </div>
      {/* 채팅 메시지 영역 */}
      <div
        ref={chatContainerRef}
        className="flex-1 p-4 overflow-y-auto bg-gray-50"
      >
        {selectedChatId ? (
          messages.length > 0 ? (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`mb-2 flex text-sm ${
                  msg.fromUserId === currentUserId
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs py-2 px-6 rounded-2xl font-semibold ${
                    msg.fromUserId === currentUserId
                      ? "bg-[#a18df9] text-white"
                      : "bg-[#dee4ed]"
                  }`}
                >
                  <p>{msg.content}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">
              아직 메시지가 없습니다. 대화를 시작해보세요!
            </p>
          )
        ) : (
          <p className="text-gray-500 text-center">채팅을 선택해주세요.</p>
        )}
      </div>
      {/* 메시지 입력창 */}
      {selectedChatId && (
        <form
          onSubmit={handleFormSubmit}
          className="w-full border-t bg-white flex items-center p-4"
        >
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="메시지를 입력하세요..."
          />
          <button type="submit" className="btn-primary ml-4 px-4 py-2">
            전송
          </button>
        </form>
      )}
    </div>
  );
}
