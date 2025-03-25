import FriendsList from "./categories/FriendList";
import ChatList from "./categories/ChatList";

interface CategoryProps {
  category: string;
  onChatSelect: (chatId: string | null) => void;
}

export default function Category({ category, onChatSelect }: CategoryProps) {
  const renderContent = () => {
    switch (category) {
      case "messages":
        return <ChatList onChatSelect={onChatSelect} />;
      case "friends":
        return <FriendsList />;
    }
  };

  return (
    <div className="flex-1 p-4 h-full border-r border-gray-200">
      {renderContent()}
    </div>
  );
}
