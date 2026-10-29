
import { useState } from "react";
import ConversationList from "../features/chat/components/ConversationList";
import ChatWindow from "../features/chat/components/ChatWindow";
import { mockConversations } from "../features/chat/data/mockConversations";

export default function Messages() {
  const [conversations, setConversations] = useState(() =>
    mockConversations.map((conversation) => ({
      ...conversation,
      messages: conversation.messages.map((message) => ({ ...message })),
    })),
  );
  const [activeConversationId, setActiveConversationId] = useState(
    mockConversations[0]?.id ?? null,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [aiEnabled, setAiEnabled] = useState(false);
  const [mobileView, setMobileView] = useState("conversations");

  const activeConversation = conversations.find(
    (conversation) => conversation.id === activeConversationId,
  );

  function handleSelectConversation(conversationId) {
    setActiveConversationId(conversationId);
    setMobileView("chat");
    setConversations((currentConversations) =>
      currentConversations.map((conversation) =>
        conversation.id === conversationId
          ? { ...conversation, unread: 0 }
          : conversation,
      ),
    );
  }

  function handleSendMessage(text) {
    const time = new Intl.DateTimeFormat("en", {
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date());
    const message = {
      id: crypto.randomUUID(),
      text,
      time,
      sender: "me",
    };

    setConversations((currentConversations) =>
      currentConversations.map((conversation) =>
        conversation.id === activeConversationId
          ? {
              ...conversation,
              lastMessage: text,
              time,
              messages: [...conversation.messages, message],
            }
          : conversation,
      ),
    );
  }

  return (
    <div className="flex h-full min-h-0 min-w-0 overflow-hidden rounded-lg border border-gray-200 bg-white sm:rounded-xl">
      <div
        className={`${
          mobileView === "conversations" ? "flex" : "hidden"
        } min-h-0 min-w-0 w-full flex-col lg:flex lg:w-[320px] lg:shrink-0 xl:w-90`}
      >
        <ConversationList
          conversations={conversations}
          activeConversationId={activeConversationId}
          onSelectConversation={handleSelectConversation}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </div>

      <div
        className={`${
          mobileView === "chat" ? "flex" : "hidden"
        } min-h-0 min-w-0 flex-1 flex-col lg:flex`}
      >
        <ChatWindow
          conversation={activeConversation}
          onSendMessage={handleSendMessage}
          aiEnabled={aiEnabled}
          onToggleAI={() => setAiEnabled((enabled) => !enabled)}
          onBack={() => setMobileView("conversations")}
        />
      </div>
    </div>
  );
}
