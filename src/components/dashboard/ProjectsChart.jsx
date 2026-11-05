import Chart from "react-apexcharts";
import { Card } from "flowbite-react";

function ProjectsChart() {
  const options = {
    chart: {
      type: "bar",
      toolbar: {
        show: false,
      },
      fontFamily: "inherit",
    },
    colors: ["#2563eb"],
    plotOptions: {
      bar: {
        borderRadius: 5,
        columnWidth: "45%",
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
      ],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      min: 0,
      max: 100,
      labels: {
        formatter: (value) => `${value}%`,
      },
    },
    grid: {
      borderColor: "#e5e7eb",
      strokeDashArray: 4,
    },
    tooltip: {
      y: {
        formatter: (value) => `${value}%`,
      },
    },
  };

  const series = [
    {
      name: "Completion",
      data: [65, 80, 45, 90, 70, 95],
    },
  ];

  return (
    <Card className="border border-gray-200 bg-white shadow-sm dark:border-gray-200 dark:bg-white">
      <div className="mb-4">
        <h5 className="text-lg font-semibold text-gray-900">
          Project Performance
        </h5>
        <p className="text-sm text-gray-500">
          Project completion by month
        </p>
      </div>

      <Chart
        options={options}
        series={series}
        type="bar"
        height={320}
        width="100%"
      />
    </Card>
  );
}

export default ProjectsChart;