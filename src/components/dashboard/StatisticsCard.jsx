import { Card } from "flowbite-react";

function StatisticsCard({
  title,
  value,
  percentage,
  description,
  icon: Icon,
  positive = true,
}) {
  return (
    <Card className="border border-gray-200 bg-white shadow-sm dark:border-gray-200 dark:bg-white">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>

          <h3 className="mt-2 text-2xl font-bold text-gray-900">
            {value}
          </h3>
        </div>

        {Icon && (
          <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
            <Icon className="h-6 w-6" />
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center gap-2">
        <span
          className={`text-sm font-semibold ${
            positive ? "text-green-600" : "text-red-600"
          }`}
        >
          {positive ? "+" : ""}
          {percentage}
        </span>

        <span className="text-sm text-gray-500">{description}</span>
      </div>
    </Card>
  );
}

export default StatisticsCard;