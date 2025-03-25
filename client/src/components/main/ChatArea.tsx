import { useEffect, useState, useRef, FormEvent } from "react";
import { authApi } from "../../api/auth";
import { messageApi } from "../../api/message";
import socket from "../../api/config/socket";

interface Message {
  id: string;
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
  const chatContainerRef = useRef<HTMLDivElement>(null);

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

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSendMessage();
  };

  return (
    <div className="h-full flex flex-col">
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
                className={`mb-2 flex ${
                  msg.fromUserId === currentUserId
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs p-2 rounded-lg ${
                    msg.fromUserId === currentUserId
                      ? "bg-primary text-white"
                      : "bg-gray-200"
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
