
import { CheckCheck } from "lucide-react";

export default function MessageBubble({ message }) {
  const isMine = message.sender === "me";

  return (
    <div
      className={`flex w-full ${
        isMine ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-[85%] wrap-break-word rounded-2xl px-4 py-3 sm:max-w-[75%] ${
          isMine
            ? "rounded-br-md bg-indigo-600 text-white"
            : "rounded-bl-md bg-gray-100 text-gray-800"
        }`}
      >
        <p className="whitespace-pre-wrap text-base leading-6">
          {message.text}
        </p>

        <div
          className={`mt-1 flex items-center justify-end gap-1 text-[11px] ${
            isMine ? "text-indigo-100" : "text-gray-500"
          }`}
        >
          <span>{message.time}</span>
          {isMine && <CheckCheck size={14} />}
        </div>
      </div>
    </div>
  );
}
