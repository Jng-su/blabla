import FriendsList from "./categories/FriendList";
import Messages from "./categories/Messages";

interface CategoryProps {
  category: string;
  onChatSelect: (chatId: string | null) => void; // 채팅 선택 콜백 추가
}

export default function Category({ category, onChatSelect }: CategoryProps) {
  const renderContent = () => {
    switch (category) {
      case "messages":
        return <Messages onChatSelect={onChatSelect} />;
      case "friends":
        return <FriendsList />;
      case "add-friend":
        return (
          <div>
            <p>Add Friend (개발 중)</p>
          </div>
        );
      case "settings":
        return (
          <div>
            <p>Settings (개발 중)</p>
          </div>
        );
      default:
        return (
          <div>
            <p>카테고리를 선택하세요</p>
          </div>
        );
    }
  };

  return (
    <div className="flex-1 p-4 h-full border-r border-gray-200">
      {renderContent()}
    </div>
  );
}
