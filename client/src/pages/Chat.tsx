import { MessageSquareMore } from "lucide-react";
import { useSignOutMutation } from "../query/mutation/auth";
import { useAuthStatusQuery } from "../query/queries/auth";
import { useState } from "react";
import SideBar from "../components/main/SideBar";
import Category from "../components/main/Category";
import ChatArea from "../components/main/ChatArea";
import socket from "../api/config/socket";

export default function Chat() {
  const { data } = useAuthStatusQuery();
  const isAuthenticated = data?.isAuthenticated || false;
  const signOutMutation = useSignOutMutation();
  const [selectedCategory, setSelectedCategory] = useState<string>("messages");
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  const handleSignOut = async () => {
    try {
      await signOutMutation.mutateAsync();
    } catch (err) {
      alert("로그아웃에 실패했습니다.");
    }
  };

  socket.emit("Socket test in FriendsList");
  if (!isAuthenticated) return null;

  return (
    <div className="w-3/4 h-[85vh] flex flex-col bg-white rounded-lg shadow-lg mx-auto">
      <div className="flex gap-2 py-4 border-b border-gray-200 p-4">
        <MessageSquareMore size={30} className="text-primary" />
        <p className="text-xl font-bold">blabla</p>
      </div>
      <div className="flex w-full h-full">
        <SideBar
          onCategoryChange={setSelectedCategory}
          onSignOut={handleSignOut}
          activeCategory={selectedCategory}
        />
        <div className="flex w-full">
          <div className="w-1/4">
            <Category
              category={selectedCategory}
              onChatSelect={setSelectedChatId}
            />
          </div>
          <div className="w-3/4">
            <ChatArea selectedChatId={selectedChatId} />
          </div>
        </div>
      </div>
    </div>
  );
}
