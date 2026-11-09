import { AlertCircle } from "lucide-react";
import TimeClock from "../../components/TimeClock";

const EmployeeDashboard = () => (
  <div className="space-y-6">
    <TimeClock />

    <section className="rounded-xl border border-amber-200 bg-amber-50 p-5">
      <div className="flex items-start gap-3">
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
        <div>
          <h2 className="font-semibold text-amber-900">Attendance History</h2>
          <p className="mt-1 text-sm leading-6 text-amber-800">
            Previous shifts cannot be displayed yet because the attendance
            history endpoint is not available on the server. Your current shift
            attendance continues to be recorded.
          </p>
        </div>
      </div>
    </section>
  </div>
);

export default EmployeeDashboard;
