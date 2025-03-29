import { useState, ChangeEvent } from "react";
import {
  LogOut,
  MessageSquareMore,
  UserRoundPlus,
  UsersRound,
} from "lucide-react";
import ConfirmModal from "../modals/ConfirmModal";
import { useInviteFriend, useUpdateUser } from "../../query/mutation/user";
import { useGetMe } from "../../query/queries/user";
import { UpdateUserInfoModal } from "../modals/UpdateUserInfoModal";
import { SidebarProps } from "../../types/main-props";
import SidebarButton from "../common/SidebarButton";

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
  const { data: currentUser } = useGetMe();

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
      email: currentUser?.email || "",
      password: "",
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

  return (
    <div className="flex flex-col justify-between p-4 border-r border-gray-200">
      <div className="flex flex-col gap-4">
        <SidebarButton
          icon={<MessageSquareMore size={24} />}
          category="chats"
          activeCategory={activeCategory}
          onClick={() => onCategoryChange("chats")}
        />
        <SidebarButton
          icon={<UsersRound size={24} />}
          category="friends"
          activeCategory={activeCategory}
          onClick={() => onCategoryChange("friends")}
        />
        <button
          className="sidebar-button"
          onClick={() => setIsAddFriendModalOpen(true)}
        >
          <UserRoundPlus size={24} />
        </button>
      </div>
      <div className="flex flex-col gap-4">
        <SidebarButton
          icon={
            <div className="w-6 h-6 rounded-full overflow-hidden">
              {currentUser?.profile_image && (
                <img
                  src={currentUser?.profile_image}
                  alt="프로필 이미지"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          }
          category="settings"
          activeCategory={activeCategory}
          onClick={handleSettingsOpen}
        />
        <button
          className="sidebar-button"
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
              className="w-full p-2 input-style"
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
      <UpdateUserInfoModal
        isOpen={isSettingsModalOpen}
        onClose={() => {
          setIsSettingsModalOpen(false);
          setSelectedFile(null);
        }}
        userData={userData}
        onConfirm={handleUpdateUser}
        onUserDataChange={setUserData}
        onFileChange={handleFileChange}
        isPending={isUpdatePending}
      />
    </div>
  );
}
