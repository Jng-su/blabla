import { useState } from "react";
import {
  useGetFriends,
  useGetMe,
  useGetUserById,
} from "../../../query/queries/user";
import GetUserModal from "../../modals/GetUserModal";

interface Friend {
  id: string;
  name: string;
  email: string;
  profile_image: string;
  statusMessage?: string;
}

export default function FriendsList() {
  const { data: user } = useGetMe(); // 본인 정보
  const { data: friends } = useGetFriends();
  const [selectedFriendId, setSelectedFriendId] = useState<string | null>(null);
  const { data: selectedFriend } = useGetUserById(selectedFriendId || "");

  const closeModal = () => setSelectedFriendId(null);

  if (!friends || friends.length === 0) {
    return (
      <div>
        <p>아직 친구가 없습니다.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">친구 목록</h2>

      {/* 본인 정보 고정 */}
      {user && (
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
      )}

      <hr className="my-4" />

      {/* 친구 목록 */}
      <ul className="space-y-2">
        {friends.map((friend: Friend) => (
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
                <p className="text-xs text-gray-400">{friend.statusMessage}</p>
              )}
            </div>
          </li>
        ))}
      </ul>

      <GetUserModal
        isOpen={!!selectedFriendId}
        onClose={closeModal}
        user={selectedFriend || null}
      />
    </div>
  );
}
