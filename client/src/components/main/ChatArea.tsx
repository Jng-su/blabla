import { useEffect, useState } from "react";
import { authApi } from "../../api/auth";
import { messageApi } from "../../api/message";
import socket from "../../api/config/socket";

interface Message {
  chatId: string;
  fromUserId: string;
  toUserId: string;
  content: string;
  timestamp: string; // 서버에서 문자열로 오므로 그대로 유지
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
        setCurrentUserId(userInfo.id); // 사용자 ID 설정
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
          setMessages([]); // 채팅 내역 없으면 빈 배열
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
      const toUserId = participants.find((id) => id !== currentUserId); // 상대방 ID 추출
      if (toUserId) {
        socket.emit("privateMessage", {
          toUserId,
          content: newMessage,
        });
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
              <div key={msg.timestamp} className="mb-2">
                <p>
                  <strong>{msg.fromUserId}:</strong> {msg.content}{" "}
                  <span className="text-gray-500 text-sm">
                    ({new Date(msg.timestamp).toLocaleTimeString()})
                  </span>
                </p>
              </div>
            ))
          ) : (
            <p>아직 메시지가 없습니다. 대화를 시작해보세요!</p>
          )
        ) : (
          <p>채팅을 선택해주세요.</p>
        )}
      </div>
      {selectedChatId && (
        <div className="p-4 border-t">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="메시지를 입력하세요..."
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <button onClick={handleSendMessage} className="mt-2 btn-primary">
            전송
          </button>
        </div>
      )}
    </div>
  );
}
