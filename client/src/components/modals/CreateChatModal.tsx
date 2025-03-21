import { useState } from "react";

interface CreateChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (chatType: "personal" | "group", selectedFriends: string[]) => void;
}

const buttonBaseStyle =
  "flex-1 py-2 rounded-lg text-gray-600 border border-gray-200 transition-all";

const buttonActiveStyle = "bg-primary text-white";
const buttonHoverStyle = "hover:bg-primaryHover hover:text-white";

const friendItemBaseStyle = "my-1 p-2 rounded-md cursor-pointer transition-all";
const friendItemActiveStyle = "text-primary font-semibold bg-gray-200";
const friendItemHoverStyle = "hover:bg-gray-100";

export default function CreateChatModal({
  isOpen,
  onClose,
  onCreate,
}: CreateChatModalProps) {
  const [chatType, setChatType] = useState<"personal" | "group" | null>(null);
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);

  const friendsList = [
    { id: 1, name: "김철수" },
    { id: 2, name: "이영희" },
    { id: 3, name: "박민수" },
    { id: 4, name: "최지은" },
  ];

  const handleFriendToggle = (friendName: string) => {
    if (chatType === "personal") {
      setSelectedFriends([friendName]);
    } else if (chatType === "group") {
      if (selectedFriends.includes(friendName)) {
        setSelectedFriends(
          selectedFriends.filter((name) => name !== friendName)
        );
      } else {
        setSelectedFriends([...selectedFriends, friendName]);
      }
    }
  };

  const handleChatTypeChange = (type: "personal" | "group") => {
    setChatType(type);
    setSelectedFriends([]); // 개인/단체 변경 시 친구 선택 초기화
  };

  const handleCreate = () => {
    if (chatType) {
      onCreate(chatType, selectedFriends);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-lg font-semibold mb-4">채팅 생성</h2>
        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            <button
              className={`${buttonBaseStyle} ${
                chatType === "personal" ? buttonActiveStyle : ""
              } ${chatType !== "personal" ? buttonHoverStyle : ""}`}
              onClick={() => handleChatTypeChange("personal")}
            >
              개인
            </button>
            <button
              className={`${buttonBaseStyle} ${
                chatType === "group" ? buttonActiveStyle : ""
              } ${chatType !== "group" ? buttonHoverStyle : ""}`}
              onClick={() => handleChatTypeChange("group")}
            >
              단체
            </button>
          </div>
          {chatType && (
            <div className="max-h-40 overflow-y-auto p-2 border border-gray-200 rounded-lg">
              {friendsList.map((friend) => (
                <div
                  key={friend.id}
                  className={`${friendItemBaseStyle} ${
                    selectedFriends.includes(friend.name)
                      ? friendItemActiveStyle
                      : friendItemHoverStyle
                  }`}
                  onClick={() => handleFriendToggle(friend.name)}
                >
                  {friend.name}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button className="px-4 py-2 text-gray-600" onClick={onClose}>
            취소
          </button>
          <button
            className="px-4 py-2 bg-primary text-white rounded-lg"
            onClick={handleCreate}
          >
            생성
          </button>
        </div>
      </div>
    </div>
  );
}
