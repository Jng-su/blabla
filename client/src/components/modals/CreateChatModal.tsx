import { useState } from "react";
import { useGetFriends } from "../../query/queries/user";
import { Friend } from "../../interfaces/components/Friend.interface";

interface CreateChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (chatType: "personal", selectedFriendId: string) => void;
}

export default function CreateChatModal({
  isOpen,
  onClose,
  onCreate,
}: CreateChatModalProps) {
  const [selectedFriendId, setSelectedFriendId] = useState<string>("");
  const { data: friends, isLoading } = useGetFriends();

  const handleFriendToggle = (friendId: string) => {
    setSelectedFriendId(friendId);
  };

  const handleCreate = () => {
    if (selectedFriendId) {
      onCreate("personal", selectedFriendId);
    } else {
      alert("친구를 선택해주세요.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-lg font-semibold mb-4">개인 채팅 생성</h2>
        <div className="max-h-40 overflow-y-auto p-2 border border-gray-200 rounded-lg">
          {isLoading ? (
            <p>로딩 중...</p>
          ) : friends && friends.length > 0 ? (
            friends.map((friend: Friend) => (
              <div
                key={friend.id}
                onClick={() => handleFriendToggle(friend.id)}
                className={`p-2 cursor-pointer ${
                  selectedFriendId === friend.id
                    ? "bg-gray-200"
                    : "hover:bg-gray-100"
                }`}
              >
                {friend.name}
              </div>
            ))
          ) : (
            <p>친구가 없습니다.</p>
          )}
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="btn-secondary">
            취소
          </button>
          <button onClick={handleCreate} className="btn-primary">
            생성
          </button>
        </div>
      </div>
    </div>
  );
}
