import { useState, useEffect } from "react";
import CreateChatModal from "../../modals/CreateChatModal";
import { useGetChats } from "../../../query/queries/chat";
import { authApi } from "../../../api/auth";

interface Chat {
  chatId: string;
  chatType: "personal";
  participants: string[];
}

interface MessagesProps {
  onChatSelect: (chatId: string | null) => void;
}

export default function ChatList({ onChatSelect }: MessagesProps) {
  const [isCreateChatModalOpen, setIsCreateChatModalOpen] = useState(false);
  const { data: chatsData } = useGetChats();
  const [chats, setChats] = useState<Chat[]>(chatsData || []);
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

  // chatsData가 업데이트될 때 상태 반영
  useEffect(() => {
    if (chatsData) {
      setChats(chatsData);
    }
  }, [chatsData]);

  // 친구 선택 시 chatId 생성 후 ChatArea로 전달
  const handleSelectFriend = (friendId: string) => {
    if (!currentUserId) return;
    const participants = [currentUserId, friendId].sort();
    const chatId = `personal-${participants.join("-")}`;
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
