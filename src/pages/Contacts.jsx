import { useMemo, useState } from "react";
import { Mail, Phone, Search, Users } from "lucide-react";
import { dummyContacts } from "../features/chat/data/contacts";

export default function Contacts() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredContacts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) return dummyContacts;

    return dummyContacts.filter((contact) =>
      `${contact.name} ${contact.email} ${contact.phone}`
        .toLowerCase()
        .includes(query),
    );
  }, [searchQuery]);

  return (
    <section className="mx-auto flex h-full min-h-0 w-full max-w-7xl flex-col">
      <header className="mb-4 flex flex-wrap items-end justify-between gap-3 sm:mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
            Contacts
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Browse and connect with your contacts.
          </p>
        </div>
        <p className="text-sm text-gray-500">
          {filteredContacts.length}{" "}
          {filteredContacts.length === 1 ? "contact" : "contacts"}
        </p>
      </header>

      <label className="mb-4 flex shrink-0 items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 sm:mb-6 sm:max-w-md">
        <Search size={18} className="shrink-0 text-gray-400" />
        <input
          type="search"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Search name, email, or phone..."
          aria-label="Search contacts"
          className="h-11 min-w-0 flex-1 bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
        />
      </label>

      {filteredContacts.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white px-5 py-12 text-center">
          <Users size={30} className="mb-3 text-gray-300" />
          <h2 className="text-sm font-semibold text-gray-800">
            No contacts found
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Try a different name, email, or phone number.
          </p>
        </div>
      ) : (
        <div className="grid min-h-0 flex-1 auto-rows-max grid-cols-1 gap-3 overflow-y-auto pb-2 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
          {filteredContacts.map((contact) => (
            <article
              key={contact.id}
              className="min-w-0 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:border-indigo-200 hover:shadow-md sm:p-5"
            >
              <div className="flex min-w-0 items-start gap-3">
                <div className="relative h-12 w-12 shrink-0">
                  <img
                    src={contact.avatar}
                    alt=""
                    className="h-12 w-12 rounded-full bg-indigo-100 object-cover"
                    loading="lazy"
                  />
                  <span
                    aria-label={contact.status === "online" ? "Online" : "Offline"}
                    title={contact.status === "online" ? "Online" : "Offline"}
                    className={`absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white ${
                      contact.status === "online"
                        ? "bg-emerald-500"
                        : "bg-gray-300"
                    }`}
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex min-w-0 items-center gap-2">
                    <h2 className="truncate text-sm font-semibold text-gray-900">
                      {contact.name}
                    </h2>
                    {contact.isPinned && (
                      <span className="shrink-0 rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-medium text-indigo-700">
                        Pinned
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs capitalize text-gray-500">
                    {contact.status}
                  </p>
                </div>

                {contact.unreadCount > 0 && (
                  <span
                    aria-label={`${contact.unreadCount} unread messages`}
                    className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-indigo-600 px-1.5 text-[10px] font-semibold text-white"
                  >
                    {contact.unreadCount}
                  </span>
                )}
              </div>

              <p className="mt-4 line-clamp-2 min-h-10 text-sm leading-5 text-gray-600">
                {contact.lastMessage}
              </p>
              <p className="mt-1 text-xs text-gray-400">
                {contact.lastMessageTime}
              </p>

              <div className="mt-4 flex min-w-0 flex-col gap-2 border-t border-gray-100 pt-3">
                <a
                  href={`mailto:${contact.email}`}
                  className="flex min-w-0 items-center gap-2 text-xs text-gray-500 hover:text-indigo-600"
                >
                  <Mail size={14} className="shrink-0" />
                  <span className="truncate">{contact.email}</span>
                </a>
                <a
                  href={`tel:${contact.phone}`}
                  className="flex min-w-0 items-center gap-2 text-xs text-gray-500 hover:text-indigo-600"
                >
                  <Phone size={14} className="shrink-0" />
                  <span className="truncate">{contact.phone}</span>
                </a>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
