import { useState } from "react";
import {
  Settings,
  ShieldCheck,
  Bot,
  MessageSquare,
  Bell,
  Lock,
  Save,
  Users,
} from "lucide-react";

const Toggle = ({ label, description, checked, onChange }) => (
  <div className="flex items-center justify-between gap-4 py-4">
    <div>
      <p className="text-sm font-semibold text-gray-800">{label}</p>
      <p className="mt-1 text-xs text-gray-500">{description}</p>
    </div>

    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition ${
        checked ? "bg-indigo-600" : "bg-gray-300"
      }`}
    >
      <span
        className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-all ${
          checked ? "left-6" : "left-1"
        }`}
      />
    </button>
  </div>
);

const Section = ({ title, description, children }) => (
  <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
    <div className="mb-5 border-b border-gray-100 pb-4">
      <h3 className="text-base font-semibold text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
    </div>

    {children}
  </div>
);

const Input = ({ label, value, onChange, type = "text" }) => (
  <div>
    <label className="mb-2 block text-sm font-medium text-gray-700">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
    />
  </div>
);

const Select = ({ label, value, onChange, options }) => (
  <div>
    <label className="mb-2 block text-sm font-medium text-gray-700">
      {label}
    </label>
    <select
      value={value}
      onChange={onChange}
      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
);

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState("general");

  const [settings, setSettings] = useState({
    platformName: "ReplyMate AI",
    supportEmail: "support@replymate.ai",
    timezone: "UTC",
    language: "English",

    aiEnabled: true,
    aiAutoReply: true,
    aiConfidence: 80,
    aiResponseStyle: "Professional",

    manualTakeover: true,
    saveConversations: true,
    allowGuestChat: false,

    emailNotifications: true,
    newUserNotifications: true,
    conversationNotifications: true,

    requireEmailVerification: true,
    allowRegistration: true,
    twoFactorAuth: false,
  });

  const tabs = [
    { id: "general", label: "General", icon: Settings },
    { id: "users", label: "User Management", icon: Users },
    { id: "ai", label: "AI Configuration", icon: Bot },
    { id: "conversations", label: "Conversations", icon: MessageSquare },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: ShieldCheck },
  ];

  const updateSetting = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = () => {
    // Connect this handler to your admin settings API.
    console.log("Updated admin settings:", settings);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
              <Settings size={16} />
              <span>Administration</span>
              <span>/</span>
              <span className="text-gray-900">Settings</span>
            </div>

            <h1 className="text-2xl font-bold text-gray-900">
              Admin Settings
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Manage your platform configuration and preferences.
            </p>
          </div>

          <button
            onClick={handleSave}
            className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            <Save size={17} />
            Save Changes
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">

          {/* Sidebar */}
          <aside className="lg:col-span-3">
            <div className="rounded-2xl border border-gray-200 bg-white p-3">
              <p className="px-3 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                Settings Menu
              </p>

              <div className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;

                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex shrink-0 items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                        isActive
                          ? "bg-indigo-50 text-indigo-700"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <Icon size={18} />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* Settings Content */}
          <main className="lg:col-span-9">

            {/* General */}
            {activeTab === "general" && (
              <>
                <Section
                  title="Platform Information"
                  description="Configure your application details."
                >
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <Input
                      label="Platform Name"
                      value={settings.platformName}
                      onChange={(e) =>
                        updateSetting("platformName", e.target.value)
                      }
                    />

                    <Input
                      label="Support Email"
                      type="email"
                      value={settings.supportEmail}
                      onChange={(e) =>
                        updateSetting("supportEmail", e.target.value)
                      }
                    />

                    <Select
                      label="Timezone"
                      value={settings.timezone}
                      onChange={(e) =>
                        updateSetting("timezone", e.target.value)
                      }
                      options={["UTC", "Africa/Accra", "Asia/Kuwait", "America/New_York"]}
                    />

                    <Select
                      label="Language"
                      value={settings.language}
                      onChange={(e) =>
                        updateSetting("language", e.target.value)
                      }
                      options={["English", "French", "Spanish"]}
                    />
                  </div>
                </Section>
              </>
            )}

            {/* User Management */}
            {activeTab === "users" && (
              <Section
                title="User Registration"
                description="Manage how users access your platform."
              >
                <Toggle
                  label="Allow New Registrations"
                  description="Allow visitors to create new accounts."
                  checked={settings.allowRegistration}
                  onChange={(v) => updateSetting("allowRegistration", v)}
                />

                <div className="border-t border-gray-100">
                  <Toggle
                    label="Require Email Verification"
                    description="Require users to verify their email before accessing the platform."
                    checked={settings.requireEmailVerification}
                    onChange={(v) => updateSetting("requireEmailVerification", v)}
                  />
                </div>
              </Section>
            )}

            {/* AI Configuration */}
            {activeTab === "ai" && (
              <>
                <Section
                  title="AI Assistant"
                  description="Configure how your AI assistant handles customer conversations."
                >
                  <Toggle
                    label="Enable AI Assistant"
                    description="Allow the AI assistant to respond to incoming conversations."
                    checked={settings.aiEnabled}
                    onChange={(v) => updateSetting("aiEnabled", v)}
                  />

                  <div className="border-t border-gray-100">
                    <Toggle
                      label="Automatic Replies"
                      description="Automatically respond to incoming messages."
                      checked={settings.aiAutoReply}
                      onChange={(v) => updateSetting("aiAutoReply", v)}
                    />
                  </div>

                  <div className="border-t border-gray-100 pt-5">
                    <label className="mb-3 block text-sm font-semibold text-gray-800">
                      AI Confidence Threshold
                    </label>

                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={settings.aiConfidence}
                        onChange={(e) =>
                          updateSetting("aiConfidence", Number(e.target.value))
                        }
                        className="w-full accent-indigo-600"
                      />

                      <span className="min-w-12 rounded-lg bg-indigo-50 px-3 py-2 text-center text-sm font-semibold text-indigo-700">
                        {settings.aiConfidence}%
                      </span>
                    </div>

                    <p className="mt-2 text-xs text-gray-500">
                      Define the minimum confidence required before the AI responds.
                    </p>
                  </div>

                  <div className="mt-5">
                    <Select
                      label="AI Response Style"
                      value={settings.aiResponseStyle}
                      onChange={(e) =>
                        updateSetting("aiResponseStyle", e.target.value)
                      }
                      options={["Professional", "Friendly", "Casual", "Formal"]}
                    />
                  </div>
                </Section>
              </>
            )}

            {/* Conversations */}
            {activeTab === "conversations" && (
              <Section
                title="Conversation Management"
                description="Control how conversations are handled and stored."
              >
                <Toggle
                  label="Manual Takeover"
                  description="Allow administrators to take over conversations from the AI."
                  checked={settings.manualTakeover}
                  onChange={(v) => updateSetting("manualTakeover", v)}
                />

                <div className="border-t border-gray-100">
                  <Toggle
                    label="Save Conversations"
                    description="Store conversation history for future reference."
                    checked={settings.saveConversations}
                    onChange={(v) => updateSetting("saveConversations", v)}
                  />
                </div>

                <div className="border-t border-gray-100">
                  <Toggle
                    label="Guest Conversations"
                    description="Allow visitors to chat without creating an account."
                    checked={settings.allowGuestChat}
                    onChange={(v) => updateSetting("allowGuestChat", v)}
                  />
                </div>
              </Section>
            )}

            {/* Notifications */}
            {activeTab === "notifications" && (
              <Section
                title="Notification Preferences"
                description="Choose which platform events trigger notifications."
              >
                <Toggle
                  label="Email Notifications"
                  description="Enable email notifications for administrators."
                  checked={settings.emailNotifications}
                  onChange={(v) => updateSetting("emailNotifications", v)}
                />

                <div className="border-t border-gray-100">
                  <Toggle
                    label="New User Notifications"
                    description="Get notified when a new user registers."
                    checked={settings.newUserNotifications}
                    onChange={(v) => updateSetting("newUserNotifications", v)}
                  />
                </div>

                <div className="border-t border-gray-100">
                  <Toggle
                    label="Conversation Notifications"
                    description="Get notified when a new conversation arrives."
                    checked={settings.conversationNotifications}
                    onChange={(v) => updateSetting("conversationNotifications", v)}
                  />
                </div>
              </Section>
            )}

            {/* Security */}
            {activeTab === "security" && (
              <Section
                title="Security Settings"
                description="Manage account protection and access security."
              >
                <Toggle
                  label="Two-Factor Authentication"
                  description="Require an additional verification step for administrator accounts."
                  checked={settings.twoFactorAuth}
                  onChange={(v) => updateSetting("twoFactorAuth", v)}
                />

                <div className="mt-5 rounded-xl border border-amber-100 bg-amber-50 p-4">
                  <div className="flex gap-3">
                    <Lock className="shrink-0 text-amber-600" size={20} />

                    <div>
                      <p className="text-sm font-semibold text-amber-800">
                        Security Notice
                      </p>
                      <p className="mt-1 text-xs leading-5 text-amber-700">
                        Security preferences must be enforced by your backend.
                        Changing these controls alone does not enable additional
                        authentication protection.
                      </p>
                    </div>
                  </div>
                </div>
              </Section>
            )}

            {/* <div className="flex justify-end">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
              >
                <Save size={17} />
                Save Changes
              </button>
            </div> */}
          </main>
        </div>
      </div>
    </div>
  );
}