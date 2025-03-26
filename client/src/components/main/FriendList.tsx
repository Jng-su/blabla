import { useState } from "react";
import { useGetFriends, useGetMe } from "../../query/queries/user";
import GetUserModal from "../modals/GetUserModal";
import { Friend } from "../../types/friend";

export default function FriendsList() {
  const { data: user } = useGetMe();
  const { data: friends } = useGetFriends();
  const [selectedFriendId, setSelectedFriendId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const closeModal = () => setSelectedFriendId(null);

  // 검색 필터 적용
  const filteredFriends = Array.isArray(friends)
    ? friends.filter((friend: Friend) =>
        friend.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-lg font-bold my-4">친구 목록</h2>
      {/* 친구 찾기 검색 입력 필드 */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="친구 이름으로 검색"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full input-style p-3 rounded-lg border"
        />
      </div>

      {/* 친구 목록 */}
      {Array.isArray(friends) && friends.length > 0 ? (
        <ul>
          {filteredFriends.length > 0 ? (
            filteredFriends.map((friend: Friend) => (
              <li
                key={friend.id}
                className={`flex items-center p-4 mb-3 rounded-lg shadow-lg cursor-pointer h-24 ${
                  selectedFriendId === friend.id
                    ? "bg-secondary text-white"
                    : "bg-white hover:bg-secondary transition-colors duration-300"
                }`}
                onClick={() => setSelectedFriendId(friend.id)}
              >
                <img
                  src={friend.profile_image}
                  alt={`${friend.name}의 프로필`}
                  className="w-10 h-10 rounded-full object-cover mr-4"
                />
                <div className="flex-1 gap-1">
                  <div className="flex items-center gap-2">
                    <p className="font-extrabold text-base">{friend.name}</p>
                    <p className="text-xs text-gray-400">({friend.email})</p>
                  </div>
                  {friend.statusMessage && (
                    <p className="text-xs text-gray-800">
                      {friend.statusMessage}
                    </p>
                  )}
                </div>
              </li>
            ))
          ) : (
            <p className="text-gray-500">검색 결과가 없습니다.</p>
          )}
        </ul>
      ) : (
        <p className="text-gray-500">친구가 없습니다.</p>
      )}

      <GetUserModal
        isOpen={!!selectedFriendId}
        onClose={closeModal}
        selectedFriendId={selectedFriendId || ""}
      />
    </div>
  );
}
