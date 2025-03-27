import { useEffect, useState, useRef, FormEvent } from "react";
import { messageApi } from "../../api/message";
import socket from "../../api/config/socket";
import { ChatAreaProps } from "../../types/main-props";
import { Message } from "../../types/message";
import GetUserModal from "../modals/GetUserModal";

export default function ChatArea({
  selectedChat,
  currentUserId,
}: ChatAreaProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFriendId, setSelectedFriendId] = useState<string | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const DEFAULT_CHAT_IMAGE =
    "https://blabla-cloud.s3.ap-northeast-2.amazonaws.com/public/default-chat-image.png";

  useEffect(() => {
    if (selectedChat?.chatId) {
      const fetchMessages = async () => {
        try {
          const fetchedMessages = await messageApi.getMessagesByChatId(
            selectedChat.chatId
          );
          setMessages(fetchedMessages);
        } catch (error) {
          console.error("Failed to fetch messages:", error);
          setMessages([]);
        }
      };
      fetchMessages();
    } else {
      setMessages([]);
    }
  }, [selectedChat]);

  useEffect(() => {
    if (selectedChat?.chatId) {
      socket.on("privateMessage", (data: Message) => {
        if (data.chatId === selectedChat.chatId) {
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
  }, [selectedChat]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (
      newMessage.trim() &&
      selectedChat?.chatId &&
      currentUserId &&
      selectedChat.participants
    ) {
      const toUserId = selectedChat.participants.find(
        (id) => id !== currentUserId
      );
      if (toUserId) {
        const messageData = {
          chatId: selectedChat.chatId,
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

  const openModal = (friendId: string) => {
    setSelectedFriendId(friendId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedFriendId(null);
  };

  const getChatImage = () => {
    return selectedChat?.name === "알수없음"
      ? DEFAULT_CHAT_IMAGE
      : selectedChat?.image;
  };

  return (
    <div className="h-full flex flex-col">
      {/* 헤더 */}
      <div className="p-4 border-b border-gray-200 flex items-center gap-3 bg-violet-50">
        {selectedChat ? (
          <>
            <img
              src={getChatImage()}
              alt="프로필"
              className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
            />
            <h2 className="flex text-xl font-extrabold text-gray-800 gap-2">
              <p className="text-primary">{selectedChat.name || "이름 없음"}</p>
              님과의 채팅
            </h2>
          </>
        ) : (
          <p className="font-extrabold text-gray-800">채팅을 선택해주세요.</p>
        )}
      </div>

      {/* 메시지 영역 */}
      {selectedChat && (
        <div
          ref={chatContainerRef}
          className="flex-1 p-4 overflow-y-auto bg-gray-50"
        >
          {messages.length > 0 ? (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`mb-4 flex ${
                  msg.fromUserId === currentUserId
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                {msg.fromUserId === currentUserId ? (
                  <div>
                    <div className="p-4 rounded-2xl bg-violet-400 text-white">
                      <p className="font-bold">{msg.content}</p>
                      <span className="text-xs opacity-45">
                        ({new Date(msg.timestamp).toLocaleTimeString()})
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex">
                    <img
                      src={getChatImage()}
                      alt="프로필"
                      className="w-8 h-8 rounded-full object-cover border-2 border-gray-200 cursor-pointer"
                      onClick={() =>
                        openModal(
                          selectedChat.participants.find(
                            (id) => id !== currentUserId
                          ) || ""
                        )
                      }
                    />
                    <div>
                      <p className="text-sm font-semibold text-gray-800 pl-2">
                        {selectedChat.name || msg.fromUserId}
                      </p>
                      <div className="p-4 rounded-2xl bg-gray-200">
                        <p className="font-bold">{msg.content}</p>
                        <span className="text-xs opacity-45">
                          ({new Date(msg.timestamp).toLocaleTimeString()})
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">
              아직 메시지가 없습니다. 대화를 시작해보세요!
            </p>
          )}
        </div>
      )}

      {/* 입력창 */}
      {selectedChat && (
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

      {/* 모달 */}
      <GetUserModal
        isOpen={isModalOpen}
        onClose={closeModal}
        selectedFriendId={selectedFriendId || ""}
      />
    </div>
  );
}
