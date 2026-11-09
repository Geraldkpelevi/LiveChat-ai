import { useAssignEmployeeShift } from "../hooks/useAssignEmployeeShift";
import { CalendarClock, Loader2 } from "lucide-react";

const AssignEmployeeShift = ({ employee, shifts = [] }) => {
  const {
    assignShift,
    isAssigning,
  } = useAssignEmployeeShift();

  const currentShift =
    typeof employee.shift === "object"
      ? employee.shift?._id
      : employee.shift || "";

  const handleShiftChange = async (event) => {
    const shiftId = event.target.value || null;

    try {
      await assignShift({
        employeeId: employee._id,
        shiftId,
      });
    } catch (error) {
      console.error(
        "Failed to assign employee shift:",
        error.response?.data?.message || error.message,
      );
    }
  };

  return (
    <div className="w-full space-y-2">
      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
        <CalendarClock className="h-4 w-4 text-gray-500" />
        Assigned Shift
      </label>

      <div className="relative">
        <select
          value={currentShift}
          onChange={handleShiftChange}
          disabled={isAssigning}
          className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 py-3 pr-10 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-50"
        >
          <option value="">No shift assigned</option>

          {shifts
            .filter((shift) => shift.isActive)
            .map((shift) => (
              <option key={shift._id} value={shift._id}>
                {shift.name} ({shift.startTime} - {shift.endTime})
              </option>
            ))}
        </select>

        {isAssigning && (
          <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-blue-600" />
        )}
      </div>

      <p className="text-xs text-gray-500">
        Assign or change this employee's working schedule.
      </p>
    </div>
  );
};

export default AssignEmployeeShift;