import { UpdateUserData } from "../types/user";
import api from "./config/axios";

export const userApi = {
  // 관리자 전용: 모든 사용자 조회
  getAllUsers: async () => {
    const response = await api.get("/user");
    return response.data;
  },

  // 본인 정보 조회 (token)
  getMe: async () => {
    const response = await api.get("/user/me");
    return response.data;
  },

  // 사용자 조회 (userId)
  getUserByUserId: async (userId: string) => {
    const response = await api.get(`/user/${userId}`);
    return response.data;
  },

  // 본인 정보 수정 (token)
  updateUser: async (updateUserData: UpdateUserData) => {
    const response = await api.patch("/user", updateUserData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // 본인 친구 조회 (token)
  getFriendsByUserId: async () => {
    const response = await api.get("/user/friends");
    return response.data;
  },

  // 친구 초대 (email, token)
  inviteFriend: async (email: string) => {
    const response = await api.post("/user/invite-friend", { email });
    return response.data;
  },

  // 회원 탈퇴 (token)
  deleteUser: async () => {
    const response = await api.delete(`/user`);
    return response.data;
  },

  // 친구 삭제 (friendId, token)
  removeFriend: async (friendId: string) => {
    const response = await api.delete(`/user/remove-friend/${friendId}`);
    return response.data;
  },
};
