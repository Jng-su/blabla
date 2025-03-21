import { JSX } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content?: JSX.Element | string;
  confirmText: string;
  onConfirm: () => void;
  cancelText?: string;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  title,
  content,
  confirmText,
  onConfirm,
  cancelText = "취소",
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
        {content && <div className="mb-4">{content}</div>}
        <div className="flex justify-end gap-2">
          <button className="px-4 py-2 text-gray-600" onClick={onClose}>
            {cancelText}
          </button>
          <button className="btn-primary px-4 py-2" onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
