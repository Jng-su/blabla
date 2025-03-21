import { Send } from "lucide-react";

export default function ChatArea() {
  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="flex-1 p-6 overflow-y-auto"></div>
      <div className="p-3 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="메시지를 입력하세요..."
            className="flex-1 px-4 text-sm"
          />
          <button className="btn-primary px-4">
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
