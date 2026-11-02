import {
  CurrencyDollarIcon,
  ShoppingCartIcon,
  UsersIcon,
  BriefcaseIcon,
} from "@heroicons/react/24/outline";

import StatisticsCard from "../../components/dashboard/StatisticsCard";
import RevenueChart from "../../components/dashboard/RevenueChart";
import ProjectsChart from "../../components/dashboard/ProjectsChart";
import ProjectsTable from "../../components/dashboard/ProjectsTable";
import ActivitySection from "../../components/dashboard/ActivitySection";

function Home() {
  const statistics = [
    {
      title: "Total Revenue",
      value: "kwd 11,230",
      percentage: "12.5%",
      description: "vs last month",
      icon: CurrencyDollarIcon,
      positive: true,
    },
    {
      title: "Total Orders",
      value: "12,450",
      percentage: "8.2%",
      description: "vs last month",
      icon: ShoppingCartIcon,
      positive: true,
    },
    {
      title: "Total Customers",
      value: "35,840",
      percentage: "5.4%",
      description: "vs last month",
      icon: UsersIcon,
      positive: true,
    },
    {
      title: "Active Projects",
      value: "194",
      percentage: "2.1%",
      description: "vs last month",
      icon: BriefcaseIcon,
      positive: false,
    },
  ];

  return (
    <div className="min-h-full w-full min-w-0 bg-gray-50">
      <div className="mx-auto w-full max-w-7xl min-w-0 space-y-6">
        {/* Dashboard Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Dashboard
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Welcome back! Here's what's happening with your business today.
            </p>
          </div>

          <div className="text-sm text-gray-500">
            Overview / Dashboard
          </div>
        </div>

        {/* Statistics Cards */}
        <section>
          <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 md:grid-cols-4">
            {statistics.map((statistic) => (
              <div key={statistic.title} className="min-w-0">
                <StatisticsCard {...statistic} />
              </div>
            ))}
          </div>
        </section>

        {/* Charts */}
        <section className="grid min-w-0 grid-cols-1 gap-6 xl:grid-cols-2 md:grid-cols-2">
          <div className="min-w-0">
            <RevenueChart />
          </div>
          <div className="min-w-0">
            <ProjectsChart />
          </div>
        </section>

        {/* Projects and Activity */}
        <section className="grid min-w-0 grid-cols-1 gap-6 xl:grid-cols-3 md:grid-cols-2">
          <div className="min-w-0 xl:col-span-2">
            <ProjectsTable />
          </div>

          <div className="min-w-0">
            <ActivitySection />
          </div>
        </section>
      </div>
    </div>
  );
}

export default Home;