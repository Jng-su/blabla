import { useState } from "react";
import {
  useGetFriends,
  useGetMe,
  useGetUserById,
} from "../../../query/queries/user";
import GetUserModal from "../../modals/GetUserModal";
import { Friend } from "../../../interfaces/components/Friend.interface";

export default function FriendsList() {
  const { data: user } = useGetMe();
  const { data: friends } = useGetFriends();
  const [selectedFriendId, setSelectedFriendId] = useState<string | null>(null);
  const { data: selectedFriend } = useGetUserById(selectedFriendId || "");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const closeModal = () => setSelectedFriendId(null);

  const filteredFriends = friends?.filter((friend: Friend) =>
    friend.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">친구 목록</h2>

      {/* 본인 정보 고정 */}
      {user ? (
        <div className="mt-4 h-24 p-2 border rounded-lg flex items-center gap-4 bg-secondary">
          <img
            src={user.profile_image}
            alt={`${user.name}의 프로필`}
            className="w-12 h-12 rounded-xl object-cover ml-2"
            onError={(e) =>
              (e.currentTarget.src =
                "https://blabla-cloud.s3.ap-northeast-2.amazonaws.com/public/default-profile-image.png")
            }
          />
          <div>
            <div className="flex items-center gap-2">
              <p className="text-lg font-semibold">{user.name}</p>
              <p className="text-xs text-gray-600">({user.email})</p>
            </div>
            {user.statusMessage && (
              <p className="text-xs text-gray-600">{user.statusMessage}</p>
            )}
          </div>
        </div>
      ) : (
        <p className="text-gray-500">본인 정보를 불러올 수 없습니다.</p>
      )}

      <hr className="my-4" />

      {/* 친구 찾기 검색 입력 필드 */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="친구 이름으로 검색"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full input-style"
        />
      </div>

      {friends && friends.length > 0 && (
        <div className="flex items-center my-2">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-4 text-xs text-gray-400">{friends.length}</span>
          <hr className="flex-grow border-gray-300" />
        </div>
      )}

      {/* 친구 목록 */}
      {friends && friends.length > 0 ? (
        <ul className="space-y-2">
          {filteredFriends?.length > 0 ? (
            filteredFriends.map((friend: Friend) => (
              <li
                key={friend.id}
                className="flex h-16 items-center p-2 border rounded-lg gap-3 cursor-pointer hover:bg-gray-100"
                onClick={() => setSelectedFriendId(friend.id)}
              >
                <img
                  src={friend.profile_image}
                  alt={`${friend.name}의 프로필`}
                  className="w-10 h-10 rounded-xl object-cover"
                  onError={(e) =>
                    (e.currentTarget.src =
                      "https://blabla-cloud.s3.ap-northeast-2.amazonaws.com/public/default-profile-image.png")
                  }
                />
                <div>
                  <span className="font-semibold">{friend.name}</span>
                  <span className="text-xs ml-2 text-gray-500">
                    ({friend.email})
                  </span>
                  {friend.statusMessage && (
                    <p className="text-xs text-gray-400">
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
        user={selectedFriend || null}
      />
    </div>
  );
}
