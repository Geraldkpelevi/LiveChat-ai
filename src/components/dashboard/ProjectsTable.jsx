import {
  Badge,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";

const projects = [
  {
    id: 1,
    name: "Website Redesign",
    team: "Design Team",
    deadline: "Nov 10, 2026",
    progress: 85,
    status: "In Progress",
  },
  {
    id: 2,
    name: "Mobile Application",
    team: "Development Team",
    deadline: "Nov 15, 2026",
    progress: 100,
    status: "Completed",
  },
  {
    id: 3,
    name: "Marketing Campaign",
    team: "Marketing Team",
    deadline: "Nov 20, 2026",
    progress: 45,
    status: "In Progress",
  },
  {
    id: 4,
    name: "Customer Portal",
    team: "Development Team",
    deadline: "Nov 25, 2026",
    progress: 20,
    status: "Pending",
  },
];

const statusColors = {
  Completed: "success",
  "In Progress": "info",
  Pending: "warning",
};

function ProjectProgress({ value }) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      <div
        className="h-2 min-w-0 flex-1 rounded-full bg-gray-200"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Progress: ${value}%`}
      >
        <div
          className="h-2 rounded-full bg-blue-600"
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="shrink-0 text-xs text-gray-600">{value}%</span>
    </div>
  );
}

function ProjectsTable() {
  return (
    <Card className="w-full min-w-0 border border-gray-200 bg-white shadow-sm dark:border-gray-200 dark:bg-white">
      <div className="mb-4">
        <h5 className="text-lg font-semibold text-gray-900">
          Recent Projects
        </h5>
        <p className="text-sm text-gray-500">
          Overview of your latest projects
        </p>
      </div>

      <div className="space-y-3 xl:hidden">
        {projects.map((project) => (
          <article
            key={project.id}
            className="min-w-0 rounded-lg border border-gray-200 p-3 sm:p-4"
          >
            <div className="flex min-w-0 items-start justify-between gap-3">
              <h6 className="min-w-0 wrap-break-word text-sm font-semibold text-gray-900">
                {project.name}
              </h6>
              <Badge color={statusColors[project.status]}>
                {project.status}
              </Badge>
            </div>
            <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
              <div className="min-w-0">
                <dt className="text-xs font-medium text-gray-500">Team</dt>
                <dd className="mt-1 wrap-break-word text-gray-900">
                  {project.team}
                </dd>
              </div>
              <div className="min-w-0">
                <dt className="text-xs font-medium text-gray-500">Deadline</dt>
                <dd className="mt-1 text-gray-900">{project.deadline}</dd>
              </div>
              <div className="col-span-2 min-w-0">
                <dt className="mb-1 text-xs font-medium text-gray-500">
                  Progress
                </dt>
                <dd>
                  <ProjectProgress value={project.progress} />
                </dd>
              </div>
            </dl>
          </article>
        ))}
      </div>

      <div className="hidden min-w-0 overflow-x-auto xl:block">
        <Table hoverable className="w-full min-w-170 table-fixed">
          <TableHead>
            <TableRow>
              <TableHeadCell className="w-[24%] whitespace-nowrap">
                Project
              </TableHeadCell>
              <TableHeadCell className="w-[20%] whitespace-nowrap">
                Team
              </TableHeadCell>
              <TableHeadCell className="w-[19%] whitespace-nowrap">
                Deadline
              </TableHeadCell>
              <TableHeadCell className="w-[22%] whitespace-nowrap">
                Progress
              </TableHeadCell>
              <TableHeadCell className="w-[15%] whitespace-nowrap">
                Status
              </TableHeadCell>
            </TableRow>
          </TableHead>

          <TableBody className="divide-y">
            {projects.map((project) => (
              <TableRow key={project.id} className="bg-white">
                <TableCell className="whitespace-nowrap font-medium text-gray-900">
                  {project.name}
                </TableCell>

                <TableCell className="whitespace-nowrap">{project.team}</TableCell>

                <TableCell className="whitespace-nowrap">{project.deadline}</TableCell>

                <TableCell>
                  <div className="min-w-24">
                    <ProjectProgress value={project.progress} />
                  </div>
                </TableCell>

                <TableCell>
                  <Badge color={statusColors[project.status]}>
                    {project.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}

export default ProjectsTable;