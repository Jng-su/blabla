import FriendsList from "./FriendList";
import ChatList from "./ChatList";
import { CategoryProps } from "../../types/main-props";

export default function Category({
  category,
  onChatSelect,
  currentUserId,
  selectedChatId,
}: CategoryProps) {
  const renderContent = () => {
    switch (category) {
      case "chats":
        return (
          <ChatList
            onChatSelect={onChatSelect}
            currentUserId={currentUserId}
            selectedChatId={selectedChatId}
          />
        );
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
