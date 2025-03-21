interface GetUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: {
    name: string;
    email: string;
    profile_image: string;
    statusMessage?: string;
  } | null;
}

export default function GetUserModal({
  isOpen,
  onClose,
  user,
}: GetUserModalProps) {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <div className="flex flex-col items-center">
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
        </div>

        <div className="flex w-full justify-between gap-2">
          <button
            className="w-1/2 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none hover:bg-gray-300 transition duration-300"
            onClick={onClose}
          >
            닫기
          </button>
          <button className="w-1/2 btn-primary px-4 py-2">채팅</button>
        </div>
      </div>
    </div>
  );
}
