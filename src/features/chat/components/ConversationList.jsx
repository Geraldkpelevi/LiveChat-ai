
import { Search, MessageCircle } from "lucide-react";

export default function ConversationList({
  conversations,
  activeConversationId,
  onSelectConversation,
  searchQuery,
  onSearchChange,
}) {
  const filteredConversations = conversations.filter((conversation) =>
    `${conversation.name} ${conversation.lastMessage}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase()),
  );

  return (
    <section className="flex h-full min-h-0 flex-col bg-white">
      <div className="border-b border-gray-100 p-4">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Messages
            </h2>
            <p className="mt-1 text-xs text-gray-500">
              {conversations.length} conversations
            </p>
          </div>

          <button
            type="button"
            aria-label="Messages"
            className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600"
          >
            <MessageCircle size={19} />
          </button>
        </div>

        <label className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 transition focus-within:border-indigo-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-100">
          <Search size={17} className="shrink-0 text-gray-400" />

          <input
            type="search"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search conversations..."
            aria-label="Search conversations"
            className="h-10 min-w-0 flex-1 bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
          />
        </label>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-2">
        {filteredConversations.length === 0 ? (
          <div className="px-4 py-10 text-center">
            <MessageCircle
              size={28}
              className="mx-auto mb-3 text-gray-300"
            />
            <p className="text-sm font-medium text-gray-700">
              No conversations found
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Try searching for another name or message.
            </p>
          </div>
        ) : (
          filteredConversations.map((conversation) => {
            const isActive =
              conversation.id === activeConversationId;

            return (
              <button
                key={conversation.id}
                type="button"
                onClick={() => onSelectConversation(conversation.id)}
                aria-pressed={isActive}
                className={`mb-1 flex w-full min-w-0 items-center gap-3 rounded-xl p-3 text-left transition ${
                  isActive
                    ? "bg-indigo-50 ring-1 ring-indigo-100"
                    : "hover:bg-gray-50"
                }`}
              >
                <div className="relative shrink-0">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-full text-sm font-semibold ${
                      isActive
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {conversation.avatar}
                  </div>

                  {conversation.online && (
                    <span
                      aria-label="Online"
                      className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500"
                    />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex min-w-0 items-center justify-between gap-2">
                    <span className="truncate text-sm font-semibold text-gray-900">
                      {conversation.name}
                    </span>

                    <span className="shrink-0 text-[10px] text-gray-400">
                      {conversation.time}
                    </span>
                  </div>

                  <div className="mt-1 flex min-w-0 items-center justify-between gap-2">
                    <p className="truncate text-xs text-gray-500">
                      {conversation.lastMessage}
                    </p>

                    {conversation.unread > 0 && (
                      <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-indigo-600 px-1.5 text-[10px] font-semibold text-white">
                        {conversation.unread}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </section>
  );
}
