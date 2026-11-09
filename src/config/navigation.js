
import {
  Bot,
  MessageCircle,
  Settings,
  Users,
  LayoutDashboard,
  UserRoundGroup as UserRound,
} from "lucide-react";

/**
 * Navigation configuration
 *
 * Future options:
 * - roles: restrict an item to specific roles
 * - permission: permission-based navigation
 * - badge: display a notification/status badge
 * - end: control exact route matching
 * - children: support nested navigation
 */

export const navigationConfig = {
  CUSTOMER: [
    {
      id: "dashboard",
      label: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
      end: true,
    },
    {
      id: "messages",
      label: "Messages",
      path: "/messages",
      icon: MessageCircle,
      badge: "Live",
      end: false,
    },
    {
      id: "contacts",
      label: "Contacts",
      path: "/contacts",
      icon: Users,
      end: true,
    },
    {
      id: "settings",
      label: "Settings",
      path: "/customer-settings",
      icon: Settings,
      end: true,
    },
  ],

  EMPLOYEE: [
    {
      id: "dashboard",
      label: "Dashboard",
      path: "/employee/dashboard",
      icon: LayoutDashboard,
      end: true,
    },
  ],

  AGENT: [
    {
      id: "dashboard",
      label: "Dashboard",
      path: "/agent/dashboard",
      icon: LayoutDashboard,
      end: true,
    },
    {
      id: "messages",
      label: "Messages",
      path: "/agent/messages",
      icon: MessageCircle,
      badge: "Live",
      end: false,
    },
    {
      id: "contacts",
      label: "Contacts",
      path: "/agent/contacts",
      icon: Users,
      end: true,
    },
    {
      id: "settings",
      label: "Settings",
      path: "/agent/settings",
      icon: Settings,
      end: true,
    },
  ],

  ADMIN: [
    {
      id: "dashboard",
      label: "Dashboard",
      path: "/admin/dashboard",
      icon: LayoutDashboard,
      end: true,
    },
    {
      id: "employees",
      label: "Employees",
      path: "/admin/employees",
      icon: Users,
      end: true,
    },
    
   
    {
      id: "customers",
      label: "Customers",
      path: "/admin/customers-list",
      icon: UserRound,
      end: true,
    },
    {
      id: "contacts",
      label: "Contacts",
      path: "/admin/contacts",
      icon: Users,
      end: true,
    },
    {
      id: "messages",
      label: "Messages",
      path: "/admin/messages",
      icon: MessageCircle,
      badge: "Live",
      end: false,
    },
    {
      id: "ai",
      label: "AI Assistant",
      path: "/admin/aiassistant",
      icon: Bot,
      end: true,
    },
    {
      id: "settings",
      label: "Settings",
      path: "/admin/settings",
      icon: Settings,
      end: true,
    },
  ],
};

/**
 * Account menu configuration
 */
export const accountNavigationConfig = {
  CUSTOMER: {
    personalDetails: "/profile",
    changePassword: "/change-password",
  },

  EMPLOYEE: {
    personalDetails: "/employee/profile",
    changePassword: "/employee/change-password",
  },

  AGENT: {
    personalDetails: "/agent/profile",
    changePassword: "/agent/change-password",
  },

  ADMIN: {
    personalDetails: "/admin/profile",
    changePassword: "/admin/change-password",
  },
};

/**
 * Get navigation items based on role.
 */
export const getNavigationItems = (role) => {
  return navigationConfig[role] || [];
};

/**
 * Get account menu configuration based on role.
 */
export const getAccountNavigation = (role) => {
  return accountNavigationConfig[role] || accountNavigationConfig.CUSTOMER;
};

/**
 * Backward compatibility with existing imports.
 */
export const customerNavigationItems = navigationConfig.CUSTOMER;
export const agentNavigationItems = navigationConfig.AGENT;
export const adminNavigationItems = navigationConfig.ADMIN;
export const navigationItems = customerNavigationItems;
