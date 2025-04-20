import { useEffect } from "react";
import { useSignOutMutation } from "../query/mutation/auth";
import { useAuthStatusQuery } from "../query/queries/auth";
import { useState } from "react";
import SideBar from "../components/main/SideBar";
import Category from "../components/main/Category";
import ChatArea from "../components/main/ChatArea";
import socket from "../api/config/socket";
import Cookies from "js-cookie";
import { authApi } from "../api/auth";
import { Chat } from "../types/chat";

export default function Main() {
  const { data } = useAuthStatusQuery();
  const isAuthenticated = data?.isAuthenticated || false;
  const signOutMutation = useSignOutMutation();
  const [selectedCategory, setSelectedCategory] = useState<string>("chats");
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const token = Cookies.get("access_token");
    if (token) {
      authApi.getMyInfo().then((userData) => {
        setUserId(userData.id);
      });
    }
    if (!socket.connected) {
      socket.auth = { token };
      socket.connect();
    }
  }, [isAuthenticated]);

  const handleSignOut = async () => {
    try {
      await signOutMutation.mutateAsync();
      socket.disconnect();
    } catch (err) {
      alert("로그아웃에 실패했습니다.");
    }
  };

  const handleChatSelect = (chat: Chat | null) => {
    setSelectedChat(chat);
  };

  return (
    <div className="w-3/4 h-[85vh] flex flex-col bg-white rounded-lg shadow-lg mx-auto overflow-hidden">
      <div className="flex gap-2 py-4 border-b border-gray-200 px-4 items-center">
        <img
          src="https://blabla-cloud.s3.ap-northeast-2.amazonaws.com/public/default-chat-image.png"
          alt="Chat Logo"
          className="w-9 h-9"
        />
        <p className="text-xl font-bold">blabla</p>
      </div>
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
              onChatSelect={handleChatSelect}
              currentUserId={userId}
              selectedChatId={selectedChat?.chatId || null}
            />
          </div>
          <div className="w-3/4 h-full overflow-hidden">
            <ChatArea selectedChat={selectedChat} currentUserId={userId} />
          </div>
        </div>
      </div>
    </div>
  );
}
