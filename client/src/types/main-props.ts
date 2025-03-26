import { JSX } from "react";
import { Chat } from "./chat";

// ChatArea
export interface ChatAreaProps {
  selectedChat: Chat | null;
  currentUserId: string | null;
}

// ChatList
export interface ChatListProps {
  onChatSelect: (chat: Chat | null) => void;
  currentUserId: string | null;
  selectedChatId: string | null;
}

// Category
export interface CategoryProps {
  category: string;
  onChatSelect: (chat: Chat | null) => void;
  currentUserId: string | null;
  selectedChatId: string | null;
}

// Sidebar
export interface SidebarProps {
  onCategoryChange: (category: string) => void;
  onSignOut: () => void;
  activeCategory: string;
}

// Sidebar Button
export interface SidebarButtonProps {
  icon: JSX.Element;
  category: string;
  activeCategory: string;
  onClick: () => void;
}

// SignIn
export interface SignInProps {
  setIsAuthenticated: (isAuthenticated: boolean) => void;
}
