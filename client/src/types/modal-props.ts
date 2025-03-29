import { ChangeEvent, JSX } from "react";

// ConfirmModal
export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content?: JSX.Element | string;
  confirmText: string;
  onConfirm: () => void;
  cancelText?: string;
}

// CreateChatModal
export interface CreateChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectFriend: (selectedFriendId: string) => void;
}

// GetUserModal
export interface GetUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedFriendId: string;
}

// UpdateUserInfoModal
export interface UpdateUserInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  userData: {
    name: string;
    profile_image: string;
    statusMessage: string;
  };
  onConfirm: () => void;
  onUserDataChange: (data: {
    name: string;
    profile_image: string;
    statusMessage: string;
  }) => void;
  onFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  isPending: boolean;
}
