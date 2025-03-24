import { useEffect, useState } from "react";
import { authApi } from "../../api/auth";
import { messageApi } from "../../api/message";
import socket from "../../api/config/socket";

interface Message {
  chatId: string;
  fromUserId: string;
  toUserId: string;
  content: string;
  timestamp: string;
}

export default function ChatArea({
  selectedChatId,
}: {
  selectedChatId: string | null;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // 현재 사용자 정보 가져오기
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

  // 선택된 chatId로 메시지 조회
  useEffect(() => {
    if (selectedChatId) {
      const fetchMessages = async () => {
        try {
          const fetchedMessages = await messageApi.getMessagesByChatId(
            selectedChatId
          );
          setMessages(fetchedMessages);
        } catch (error) {
          console.error("Failed to fetch messages:", error);
          setMessages([]);
        }
      };
      fetchMessages();
    }
  }, [selectedChatId]);

  // WebSocket 실시간 메시지 수신
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

  // 메시지 전송
  const handleSendMessage = () => {
    if (newMessage.trim() && selectedChatId && currentUserId) {
      const participants = selectedChatId.split("personal-")[1].split("-");
      const toUserId = participants.find((id) => id !== currentUserId);
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
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 p-4 overflow-y-auto">
        {selectedChatId ? (
          messages.length > 0 ? (
            messages.map((msg) => (
              <div
                key={msg.timestamp}
                className={`mb-2 flex ${
                  msg.fromUserId === currentUserId
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs p-2 rounded-lg ${
                    msg.fromUserId === currentUserId
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  <p>
                    <strong>
                      {msg.fromUserId === currentUserId ? "나" : msg.fromUserId}
                      :
                    </strong>{" "}
                    {msg.content}{" "}
                    <span className="text-xs opacity-75">
                      ({new Date(msg.timestamp).toLocaleTimeString()})
                    </span>
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">
              아직 메시지가 없습니다. 대화를 시작해보세요!
            </p>
          )
        ) : (
          <p className="text-gray-500">채팅을 선택해주세요.</p>
        )}
      </div>
      {selectedChatId && (
        <div className="p-4 border-t flex items-center">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 p-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="메시지를 입력하세요..."
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <button
            onClick={handleSendMessage}
            className="p-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 transition-colors"
          >
            전송
          </button>
        </div>
      )}
    </div>
  );
}
