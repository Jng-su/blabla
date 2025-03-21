import { useState } from "react";
import CreateChatModal from "../../modals/CreateChatModal";

interface TabButtonProps {
  label: string;
  value: "all" | "personal" | "group";
  activeTab: "all" | "personal" | "group";
  onClick: (value: "all" | "personal" | "group") => void;
}

const TabButton = ({ label, value, activeTab, onClick }: TabButtonProps) => {
  const isActive = activeTab === value;
  return (
    <button
      onClick={() => onClick(value)}
      className={`w-1/3 py-2 rounded-lg text-sm transition-all ${
        isActive
          ? "bg-primary text-white"
          : "text-gray-600 hover:bg-primaryHover hover:text-white border border-gray-200"
      }`}
    >
      {label}
    </button>
  );
};

export default function Messages() {
  const [activeTab, setActiveTab] = useState<"all" | "personal" | "group">(
    "all"
  );
  const [isCreateChatModalOpen, setIsCreateChatModalOpen] = useState(false);

  const handleCreateChat = (
    chatType: "personal" | "group",
    selectedFriends: string[]
  ) => {
    console.log(
      `채팅 생성 - 타입: ${chatType}, 선택된 친구: ${selectedFriends}`
    );
    setIsCreateChatModalOpen(false);
  };

  return (
    <div className="flex flex-col h-full">
      <button
        className="w-full btn-secondary"
        onClick={() => setIsCreateChatModalOpen(true)}
      >
        + 채팅 생성
      </button>
      <div className="flex gap-2 my-6 justify-between">
        <TabButton
          label="전체"
          value="all"
          activeTab={activeTab}
          onClick={setActiveTab}
        />
        <TabButton
          label="개인"
          value="personal"
          activeTab={activeTab}
          onClick={setActiveTab}
        />
        <TabButton
          label="단체"
          value="group"
          activeTab={activeTab}
          onClick={setActiveTab}
        />
      </div>
      <hr />
      <div className="flex-1 p-6 flex items-center justify-center">
        <p className="text-lg">선택된 탭: {activeTab} (개발 중)</p>
      </div>

      {/* 채팅 생성 모달 */}
      <CreateChatModal
        isOpen={isCreateChatModalOpen}
        onClose={() => setIsCreateChatModalOpen(false)}
        onCreate={handleCreateChat}
      />
    </div>
  );
}
