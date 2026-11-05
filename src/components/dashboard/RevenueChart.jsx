import Chart from "react-apexcharts";
import { Card } from "flowbite-react";

function RevenueChart() {
  const options = {
    chart: {
      type: "area",
      toolbar: {
        show: false,
      },
      fontFamily: "inherit",
    },
    colors: ["#2563eb"],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 3,
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.25,
        opacityTo: 0.02,
        stops: [0, 90, 100],
      },
    },
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        formatter: (value) => `$${value.toLocaleString()}`,
      },
    },
    grid: {
      borderColor: "#e5e7eb",
      strokeDashArray: 4,
    },
    tooltip: {
      y: {
        formatter: (value) => `$${value.toLocaleString()}`,
      },
    },
  };

  const series = [
    {
      name: "Revenue",
      data: [
        12000, 18000, 15000, 25000, 22000, 30000,
        28000, 35000, 32000, 42000, 39000, 48000,
      ],
    },
  ];

  return (
    <Card className="border border-gray-200 bg-white shadow-sm dark:border-gray-200 dark:bg-white">
      <div className="mb-4">
        <h5 className="text-lg font-semibold text-gray-900">
          Revenue Overview
        </h5>
        <p className="text-sm text-gray-500">
          Monthly revenue performance
        </p>
      </div>

      <Chart
        options={options}
        series={series}
        type="area"
        height={320}
        width="100%"
      />
    </Card>
  );
}

export default RevenueChart;