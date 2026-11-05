import {
  CheckCircleIcon,
  DocumentTextIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";
import { Card } from "flowbite-react";

const activities = [
  {
    id: 1,
    title: "New user registered",
    description: "Michael joined the platform.",
    time: "10 minutes ago",
    icon: UserPlusIcon,
    color: "bg-blue-100 text-blue-600",
  },
  {
    id: 2,
    title: "Project completed",
    description: "Mobile Application was completed.",
    time: "1 hour ago",
    icon: CheckCircleIcon,
    color: "bg-green-100 text-green-600",
  },
  {
    id: 3,
    title: "New report created",
    description: "Monthly revenue report was generated.",
    time: "3 hours ago",
    icon: DocumentTextIcon,
    color: "bg-purple-100 text-purple-600",
  },
  {
    id: 4,
    title: "Project completed",
    description: "Mobile Application was completed.",
    time: "1 hour ago",
    icon: CheckCircleIcon,
    color: "bg-green-100 text-green-600",
  },
  {
    id: 5,
    title: "New report created",
    description: "Monthly revenue report was generated.",
    time: "3 hours ago",
    icon: DocumentTextIcon,
    color: "bg-purple-100 text-purple-600",
  },
  {
    id: 6,
    title: "Project completed",
    description: "Mobile Application was completed.",
    time: "1 hour ago",
    icon: CheckCircleIcon,
    color: "bg-green-100 text-green-600",
  },
  {
    id: 7,
    title: "New report created",
    description: "Monthly revenue report was generated.",
    time: "3 hours ago",
    icon: DocumentTextIcon,
    color: "bg-purple-100 text-purple-600",
  },
];

function ActivitySection() {
  return (
    <Card className="border border-gray-200 bg-white shadow-sm dark:border-gray-200 dark:bg-white">
      <div className="mb-4">
        <h5 className="text-lg font-semibold text-gray-900">Recent Activity</h5>
        <p className="text-sm text-gray-500">
          Latest updates from your platform
        </p>
      </div>

      <div className="space-y-6">
        {activities.map((activity) => {
          const Icon = activity.icon;

          return (
            <div key={activity.id} className="flex gap-3">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${activity.color}`}
              >
                <Icon className="h-5 w-5" />
              </div>

              <div className="min-w-0 flex-1">
                <h6 className="text-sm font-semibold text-gray-900">
                  {activity.title}
                </h6>

                <p className="mt-1 text-sm text-gray-500">
                  {activity.description}
                </p>

                <span className="mt-2 block text-xs text-gray-400">
                  {activity.time}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

export default ActivitySection;
