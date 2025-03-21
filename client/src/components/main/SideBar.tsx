import { useState, ChangeEvent, JSX } from "react";
import {
  LogOut,
  MessageSquareMore,
  Settings,
  UserRoundPlus,
  UsersRound,
} from "lucide-react";
import ConfirmModal from "../modals/ConfirmModal";
import { useInviteFriend, useUpdateUser } from "../../query/mutation/user";
import { useGetMe } from "../../query/queries/user";

const buttonStyle =
  "hover:text-white hover:bg-primaryHover p-2 rounded-lg transition-all";

interface ButtonProps {
  icon: JSX.Element;
  category: string;
  activeCategory: string;
  onClick: () => void;
}

const Button = ({ icon, category, activeCategory, onClick }: ButtonProps) => {
  const isActive = activeCategory === category;
  return (
    <button
      className={`${buttonStyle} ${isActive ? "text-white bg-primary" : ""}`}
      onClick={onClick}
    >
      {icon}
    </button>
  );
};

interface SidebarProps {
  onCategoryChange: (category: string) => void;
  onSignOut: () => void;
  activeCategory: string;
}

export default function Sidebar({
  onCategoryChange,
  onSignOut,
  activeCategory,
}: SidebarProps) {
  const [isAddFriendModalOpen, setIsAddFriendModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [userData, setUserData] = useState({
    name: "",
    profile_image: "",
    statusMessage: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { mutate: inviteFriend, isPending: isInvitePending } =
    useInviteFriend();
  const { mutate: updateUser, isPending: isUpdatePending } = useUpdateUser();
  const { data: currentUser, isLoading: isUserLoading } = useGetMe();

  const handleAddFriend = () => {
    if (!email || !email.trim()) {
      setErrorMessage("이메일을 입력하세요.");
      return;
    }
    setErrorMessage(null);
    inviteFriend(email, {
      onSuccess: () => {
        console.log("친구 초대 성공");
        setIsAddFriendModalOpen(false);
        setEmail("");
      },
      onError: (error: any) => {
        console.error("친구 초대 실패:", error);
        const message =
          error.response?.data?.message || "알 수 없는 오류가 발생했습니다.";
        if (message.includes("not found")) {
          setErrorMessage("해당 이메일을 찾을 수 없습니다.");
        } else if (message.includes("Already friends")) {
          setErrorMessage("이미 친구 목록에 있습니다.");
        } else {
          setErrorMessage(message);
        }
      },
    });
  };

  const handleLogoutConfirm = () => {
    onSignOut();
    setIsLogoutModalOpen(false);
  };

  const handleUpdateUser = () => {
    const formData = new FormData();
    formData.append("name", userData.name);
    if (selectedFile) {
      formData.append("profile_image", selectedFile);
    }
    formData.append("statusMessage", userData.statusMessage);

    const userDataObject = {
      name: formData.get("name") as string,
      profile_image: formData.get("profile_image") as string,
      statusMessage: formData.get("statusMessage") as string,
    };

    updateUser(userDataObject, {
      onSuccess: () => {
        setIsSettingsModalOpen(false);
        setSelectedFile(null);
      },
      onError: (error) => {
        console.error("사용자 수정 실패:", error);
      },
    });
  };

  const handleSettingsOpen = () => {
    if (currentUser) {
      setUserData({
        name: currentUser.name,
        profile_image: currentUser.profile_image,
        statusMessage: currentUser.statusMessage || "",
      });
    }
    setIsSettingsModalOpen(true);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUserData({
        ...userData,
        profile_image: URL.createObjectURL(file),
      });
    }
  };

  if (isUserLoading) return <div>로딩 중...</div>;

  return (
    <div className="flex flex-col justify-between p-4 border-r border-gray-200">
      <div className="flex flex-col gap-4">
        <Button
          icon={<MessageSquareMore size={24} />}
          category="messages"
          activeCategory={activeCategory}
          onClick={() => onCategoryChange("messages")}
        />
        <Button
          icon={<UsersRound size={24} />}
          category="friends"
          activeCategory={activeCategory}
          onClick={() => onCategoryChange("friends")}
        />
        <button
          className={buttonStyle}
          onClick={() => setIsAddFriendModalOpen(true)}
        >
          <UserRoundPlus size={24} />
        </button>
      </div>
      <div className="flex flex-col gap-4">
        <Button
          icon={<Settings size={24} />}
          category="settings"
          activeCategory={activeCategory}
          onClick={handleSettingsOpen}
        />
        <button
          className={buttonStyle}
          onClick={() => setIsLogoutModalOpen(true)}
        >
          <LogOut size={24} />
        </button>
      </div>

      {/* 친구 초대 모달 */}
      <ConfirmModal
        isOpen={isAddFriendModalOpen}
        onClose={() => {
          setIsAddFriendModalOpen(false);
          setEmail("");
          setErrorMessage(null);
        }}
        title="친구 추가"
        content={
          <div className="flex flex-col gap-2">
            <input
              type="email"
              placeholder="이메일을 입력하세요"
              className="w-full p-2 border border-gray-300 rounded-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isInvitePending}
            />
            {errorMessage && (
              <p className="text-sm text-red-600">{errorMessage}</p>
            )}
          </div>
        }
        confirmText={isInvitePending ? "초대 중..." : "친구 추가"}
        onConfirm={handleAddFriend}
      />

      {/* 로그아웃 확인 모달 */}
      <ConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        title="로그아웃"
        content="정말 로그아웃하시겠습니까?"
        confirmText="로그아웃"
        onConfirm={handleLogoutConfirm}
      />

      {/* 설정 모달 */}
      <ConfirmModal
        isOpen={isSettingsModalOpen}
        onClose={() => {
          setIsSettingsModalOpen(false);
          setSelectedFile(null);
        }}
        title="내 정보 수정"
        content={
          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="이름"
              className="w-full p-2 border border-gray-300 rounded-lg"
              value={userData.name}
              onChange={(e) =>
                setUserData({ ...userData, name: e.target.value })
              }
              disabled={isUpdatePending}
            />
            <div className="flex flex-col gap-2">
              <img
                src={userData.profile_image}
                alt="프로필 이미지"
                className="w-20 h-20 rounded-full object-cover"
                onError={(e) =>
                  (e.currentTarget.src =
                    "https://blabla-cloud.s3.ap-northeast-2.amazonaws.com/public/default-profile-image.png")
                }
              />
              <input
                type="file"
                accept="image/*"
                className="w-full p-2 border border-gray-300 rounded-lg"
                onChange={handleFileChange}
                disabled={isUpdatePending}
              />
            </div>
            <input
              type="text"
              placeholder="상태 메시지"
              className="w-full p-2 border border-gray-300 rounded-lg"
              value={userData.statusMessage}
              onChange={(e) =>
                setUserData({ ...userData, statusMessage: e.target.value })
              }
              disabled={isUpdatePending}
            />
          </div>
        }
        confirmText={isUpdatePending ? "수정 중..." : "수정"}
        onConfirm={handleUpdateUser}
      />
    </div>
  );
}
