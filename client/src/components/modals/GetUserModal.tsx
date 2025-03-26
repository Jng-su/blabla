import { useEffect, useState } from "react";
import { userApi } from "../../api/user";
import { GetUserModalProps } from "../../types/modal-props";

export default function GetUserModal({
  isOpen,
  onClose,
  selectedFriendId,
}: GetUserModalProps) {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!isOpen || !selectedFriendId) return;

    const fetchUser = async () => {
      try {
        setLoading(true);
        const fetchedUser = await userApi.getUserByUserId(selectedFriendId);
        setUser(fetchedUser);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [isOpen, selectedFriendId]);

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <div className="flex flex-col items-center">
          {loading ? (
            <></>
          ) : (
            <>
              <img
                src={user.profile_image}
                alt={user.name}
                className="w-20 h-20 rounded-xl object-cover"
              />
              <div className="flex items-center gap-2 my-2">
                <h2 className="text-lg font-semibold">{user.name}</h2>
                <p className="text-sm text-gray-500">({user.email})</p>
              </div>
              {user.statusMessage && (
                <div className="w-full bg-gray-200 p-2 rounded-lg mb-4">
                  <p className="text-xs text-gray-600">{user.statusMessage}</p>
                </div>
              )}
            </>
          )}
        </div>

        <div className="flex justify-center gap-2 mt-4">
          <button
            className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none hover:bg-gray-300 transition duration-300"
            onClick={onClose}
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
