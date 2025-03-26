import { useState } from "react";
import { useGetFriends } from "../../query/queries/user";
import { Friend } from "../../types/friend";
import { CreateChatModalProps } from "../../types/modal-props";

export default function CreateChatModal({
  isOpen,
  onClose,
  onSelectFriend,
}: CreateChatModalProps) {
  const [selectedFriendId, setSelectedFriendId] = useState<string>("");
  const { data: friends, isLoading } = useGetFriends();

  const handleFriendToggle = (friendId: string) => {
    setSelectedFriendId(friendId);
  };

  const handleSelect = () => {
    if (selectedFriendId) {
      onSelectFriend(selectedFriendId);
      onClose();
    } else {
      alert("친구를 선택해주세요.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-lg font-semibold mb-4">개인 채팅 시작</h2>
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
                    ? "bg-gray-100"
                    : "hover:bg-gray-300"
                }`}
              >
                <div className="flex items-center gap-2">
                  <img
                    src={friend.profile_image}
                    alt={`${friend.name}의 프로필`}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <p className="font-semibold">{friend.name}</p>
                  <p className="text-xs text-gray-500">{friend.email}</p>
                </div>
              </div>
            ))
          ) : (
            <p>친구가 없습니다.</p>
          )}
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-lg"
          >
            취소
          </button>
          <button onClick={handleSelect} className="btn-primary px-4 py-2">
            선택
          </button>
        </div>
      </div>
    </div>
  );
}
