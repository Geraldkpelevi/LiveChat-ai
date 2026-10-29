import {
  ArrowLeft,
  Bot,
  MoreVertical,
  Phone,
  Sparkles,
  Video,
} from "lucide-react";
import MessageBubble from "./MessageBubble.jsx";
import MessageInput from "./MessageInput.jsx";

export default function ChatWindow({
  conversation,
  onSendMessage,
  aiEnabled,
  onToggleAI,
  onBack,
}) {
  if (!conversation) {
    return (
      <div className="flex h-full items-center justify-center bg-gray-50 p-6">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
            <Bot size={30} />
          </div>

          <h2 className="text-lg font-semibold text-gray-900">
            Your conversations
          </h2>

          <p className="mt-2 max-w-xs text-sm leading-6 text-gray-500">
            Select a conversation to start chatting.
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className="flex h-full min-h-0 min-w-0 flex-col bg-white">
      <header className="flex min-h-16 shrink-0 items-center justify-between gap-3 border-b border-gray-100 px-3 py-3 sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            aria-label="Back to conversations"
            className="shrink-0 rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 lg:hidden"
          >
            <ArrowLeft size={20} />
          </button>

          <div className="relative shrink-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700">
              {conversation.avatar}
            </div>

            {conversation.online && (
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
            )}
          </div>

          <div className="min-w-0">
            <h2 className="truncate text-sm font-semibold text-gray-900 sm:text-base">
              {conversation.name}
            </h2>

            <p className="mt-0.5 text-xs text-gray-500">
              {conversation.online ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            aria-label="Voice call"
            title="Voice call (coming soon)"
            className="hidden rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 sm:block"
          >
            <Phone size={18} />
          </button>

          <button
            type="button"
            aria-label="Video call"
            title="Video call (coming soon)"
            className="hidden rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 sm:block"
          >
            <Video size={19} />
          </button>

          <button
            type="button"
            aria-label="More options"
            title="More options (coming soon)"
            className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100"
          >
            <MoreVertical size={19} />
          </button>
        </div>
      </header>

      <div className="flex shrink-0 flex-wrap items-center justify-between gap-x-3 gap-y-2 border-b border-gray-100 bg-gray-50/70 px-3 py-3 sm:px-5">
        <div className="flex min-w-0 items-center gap-2">
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
              aiEnabled
                ? "bg-indigo-100 text-indigo-600"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            <Sparkles size={18} />
          </div>

          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-800">AI Auto-Reply</p>

            <p aria-live="polite" className="text-xs text-gray-500">
              {aiEnabled ? "Automatic replies enabled" : "Replies are manual"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
            <button
          type="button"
          role="switch"
          aria-checked={aiEnabled}
          aria-label={`${aiEnabled ? "Disable" : "Enable"} AI auto-reply`}
          onClick={onToggleAI}
          className={`relative flex h-7 w-12 shrink-0 items-center justify-between rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${
            aiEnabled ? "bg-indigo-600" : "bg-gray-300"
          }`}
        >
          <span
            className={`h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
              aiEnabled ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
        <span
          aria-hidden="true"
          className={`min-w-7  font-bold text-md ${
            aiEnabled ? "text-indigo-700" : "text-gray-500"
          }`}
        >
          {aiEnabled ? "On" : "Off"}
        </span>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-3 py-5 sm:px-6">
        <div className="mb-6 text-center">
          <span className="rounded-full bg-gray-100 px-3 py-1.5 text-[11px] text-gray-500">
            Conversation with {conversation.name}
          </span>
        </div>

        <div className="mt-auto space-y-4">
          {conversation.messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
        </div>
      </div>

      <MessageInput onSend={onSendMessage} />
    </section>
  );
}
