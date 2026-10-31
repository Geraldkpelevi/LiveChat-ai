
import {
  Bot,
  MessageCircle,
  Settings,
  Users,
  LayoutDashboard ,
} from "lucide-react";

export const navigationItems = [

  {
    id: "dashboard",
    label: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard ,
  },
  {
    id: "messages",
    label: "Messages",
    path: "/messages",
    icon: MessageCircle,
    badge: "Live",
  },
  {
    id: "contacts",
    label: "Contacts",
    path: "/contacts",
    icon: Users,
  },
  {
    id: "ai",
    label: "AI Assistant",
    path: "/ai",
    icon: Bot,
  },
  {
    id: "settings",
    label: "Settings",
    path: "/settings",
    icon: Settings,
  },
];
