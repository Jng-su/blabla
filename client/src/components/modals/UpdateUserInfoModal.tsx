import { Pencil } from "lucide-react";
import { UpdateUserInfoModalProps } from "../../types/modal-props";

export function UpdateUserInfoModal({
  isOpen,
  onClose,
  userData,
  onConfirm,
  onUserDataChange,
  onFileChange,
  isPending,
}: UpdateUserInfoModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
      <div className="bg-white p-6 rounded-lg w-1/5">
        <h2 className="text-xl font-bold mb-4">내 정보 수정</h2>
        <div className="flex flex-col">
          {/* 이미지와 편집 아이콘 컨테이너 */}
          <div className="relative w-24 h-24 mx-auto">
            <img
              src={userData.profile_image}
              alt="프로필 이미지"
              className="w-full h-full rounded-full"
              onError={(e) =>
                (e.currentTarget.src =
                  "https://blabla-cloud.s3.ap-northeast-2.amazonaws.com/public/default-profile-image.png")
              }
            />
            <label
              htmlFor="profile-image-upload"
              className="absolute bottom-0 right-0 bg-white rounded-full p-1 border border-gray-300 cursor-pointer hover:bg-gray-100"
            >
              <Pencil size={16} className="text-gray-600" />
            </label>
            <input
              id="profile-image-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onFileChange}
              disabled={isPending}
            />
          </div>

          {/* 입력 필드 */}
          <p className="font-bold mt-4 mb-1">이름</p>
          <input
            type="text"
            placeholder="이름"
            className="w-full p-2 border border-gray-300 rounded-lg text-sm"
            value={userData.name}
            onChange={(e) =>
              onUserDataChange({ ...userData, name: e.target.value })
            }
            disabled={isPending}
          />
          <p className="font-bold mt-4 mb-1">상태 메시지</p>
          <input
            type="text"
            placeholder="상태 메시지를 입력하세요"
            className="w-full p-2 border border-gray-300 rounded-lg text-sm"
            value={userData.statusMessage}
            onChange={(e) =>
              onUserDataChange({ ...userData, statusMessage: e.target.value })
            }
            disabled={isPending}
          />
        </div>

        {/* 버튼 */}
        <div className="flex justify-end gap-2 mt-6">
          <button
            className="px-4 py-2 bg-gray-200 rounded-lg"
            onClick={onClose}
            disabled={isPending}
          >
            취소
          </button>
          <button
            className="btn-primary px-4 py-2"
            onClick={onConfirm}
            disabled={isPending}
          >
            {isPending ? "수정 중..." : "수정"}
          </button>
        </div>
      </div>
    </div>
  );
}
