import { useEffect } from "react";
import { MessageSquareMore } from "lucide-react";
import { useSignOutMutation } from "../query/mutation/auth";
import { useAuthStatusQuery } from "../query/queries/auth";
import { useState } from "react";
import SideBar from "../components/main/SideBar";
import Category from "../components/main/Category";
import ChatArea from "../components/main/ChatArea";
import socket from "../api/config/socket";
import Cookies from "js-cookie";

export default function Main() {
  const { data } = useAuthStatusQuery();
  const isAuthenticated = data?.isAuthenticated || false;
  const signOutMutation = useSignOutMutation();
  const [selectedCategory, setSelectedCategory] = useState<string>("messages");
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  useEffect(() => {
    const token = Cookies.get("access_token");
    if (!socket.connected) {
      socket.auth = { token };
      socket.connect();
    }
  }, [isAuthenticated]);

  const handleSignOut = async () => {
    try {
      await signOutMutation.mutateAsync();
      socket.disconnect();
      console.log("💤 WebSocket: Disconnected");
    } catch (err) {
      alert("로그아웃에 실패했습니다.");
    }
  };

  return (
    <div className="w-3/4 h-[85vh] flex flex-col bg-white rounded-lg shadow-lg mx-auto overflow-hidden">
      {/* 헤더 (고정 높이 설정) */}
      <div className="flex gap-2 py-4 border-b border-gray-200 px-4 h-16 flex-shrink-0">
        <MessageSquareMore size={30} className="text-primary" />
        <p className="text-xl font-bold">blabla</p>
      </div>

      {/* 메인 콘텐츠 영역 (남은 공간을 모두 차지) */}
      <div className="flex w-full flex-1 overflow-hidden">
        <SideBar
          onCategoryChange={setSelectedCategory}
          onSignOut={handleSignOut}
          activeCategory={selectedCategory}
        />
        <div className="flex w-full">
          <div className="w-1/4 bg-gray-100 h-full overflow-y-auto">
            <Category
              category={selectedCategory}
              onChatSelect={setSelectedChatId}
            />
          </div>
          <div className="w-3/4 h-full overflow-hidden">
            <ChatArea selectedChatId={selectedChatId} />
          </div>
        </div>
      </div>
    </div>
  );
}
