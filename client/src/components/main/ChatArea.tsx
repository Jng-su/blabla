import { useState, useEffect } from "react";
import { Send } from "lucide-react";
import { useGetMessages } from "../../query/queries/message";
import { useAuthStatusQuery } from "../../query/queries/auth";
import socket from "../../api/config/socket";

interface Message {
  senderId: string;
  content: string;
  timestamp: Date;
  username: string;
}

interface ChatAreaProps {
  selectedChatId: string | null;
}

export default function ChatArea({ selectedChatId }: ChatAreaProps) {
  const [newMessage, setNewMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);

  const { data: messagesData } = useGetMessages(selectedChatId);
  const { data: authData } = useAuthStatusQuery();
  const currentUserId = authData?.user?.id || null;

  useEffect(() => {
    if (messagesData) {
      setMessages(messagesData);
    } else {
      setMessages([]);
    }
  }, [messagesData, selectedChatId]);

  useEffect(() => {
    socket.on("chatCreated", (chat) => {
      console.log("Chat created:", chat);
      if (selectedChatId === chat.chatId) {
        setMessages([]);
      }
    });

    socket.on("messageReceived", (message: Message, chatId: string) => {
      if (chatId === selectedChatId) {
        setMessages((prev) => [...prev, message]);
      }
    });

    return () => {
      socket.off("chatCreated");
      socket.off("messageReceived");
    };
  }, [selectedChatId]);

  const handleSendMessage = () => {
    if (!newMessage || !selectedChatId) return;

    socket.emit("privateMessage", {
      chatId: selectedChatId,
      content: newMessage,
    });
    setNewMessage("");
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="flex-1 p-6 overflow-y-auto">
        {selectedChatId ? (
          messages.length > 0 ? (
            messages.map((message, index) => (
              <div
                key={index}
                className={`mb-2 flex ${
                  message.senderId === currentUserId
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs p-3 rounded-lg ${
                    message.senderId === currentUserId
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-black"
                  }`}
                >
                  <p className="font-semibold">{message.username}</p>
                  <p>{message.content}</p>
                  <p className="text-xs opacity-75">
                    {message.timestamp.toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p>No messages yet.</p>
          )
        ) : (
          <p>Select a chat to start messaging.</p>
        )}
      </div>
      {selectedChatId && (
        <div className="p-3 border-t">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="메시지를 입력하세요..."
              className="flex-1 px-4 text-sm border border-gray-300 rounded-lg"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage();
                }
              }}
            />
            <button className="btn-primary px-4" onClick={handleSendMessage}>
              <Send size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
