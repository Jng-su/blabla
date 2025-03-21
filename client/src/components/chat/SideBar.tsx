import {
  LogOut,
  MessageSquareMore,
  Settings,
  UserRoundPlus,
  UsersRound,
} from "lucide-react";
import { JSX, useState } from "react";
import ConfirmModal from "../modals/ConfirmModal";

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

  const handleAddFriend = () => {
    console.log("친구 추가 버튼 클릭");
    setIsAddFriendModalOpen(false);
  };

  const handleLogoutConfirm = () => {
    onSignOut();
    setIsLogoutModalOpen(false);
  };

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
          onClick={() => onCategoryChange("settings")}
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
        onClose={() => setIsAddFriendModalOpen(false)}
        title="친구 추가"
        content={
          <input
            type="email"
            placeholder="이메일을 입력하세요"
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        }
        confirmText="친구 추가"
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
    </div>
  );
}
