
import { useState } from "react";
import {
  User,
  Mail,
  Lock,
  Briefcase,
  Building2,
  Clock,
  Eye,
  EyeOff,
} from "lucide-react";

const inputClass =
  "w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

const labelClass = "mb-2 block text-sm font-medium text-gray-700";

const EmployeeFormFields = ({
  formData,
  handleChange,
  showEmploymentRole = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Personal Information
        </h2>

        <div className="space-y-4">
          <div>
            <label className={labelClass}>Full Name</label>
            <div className="relative">
              <User
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter full name"
                className={`${inputClass} pl-10`}
                required
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Email Address</label>
            <div className="relative">
              <Mail
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@company.com"
                className={`${inputClass} pl-10`}
                required
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Password</label>
            <div className="relative">
              <Lock
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Minimum 8 characters"
                minLength={8}
                className={`${inputClass} pl-10 pr-12`}
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="border-t border-gray-100" />

      {/* Employment Information */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Employment Information
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Job Title</label>
            <div className="relative">
              <Briefcase
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleChange}
                placeholder="Software Developer"
                className={`${inputClass} pl-10`}
                required
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Department</label>
            <div className="relative">
              <Building2
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                placeholder="IT"
                className={`${inputClass} pl-10`}
                required
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Employment Type</label>
            <select
              name="employmentType"
              value={formData.employmentType}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="FULL_TIME">Full Time</option>
              <option value="PART_TIME">Part Time</option>
              <option value="CONTRACT">Contract</option>
              <option value="INTERN">Intern</option>
            </select>
          </div>

          {showEmploymentRole && (
            <div>
              <label className={labelClass}>Employment Role</label>
              <select
                name="employmentRole"
                value={formData.employmentRole}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="EMPLOYEE">Employee</option>
                <option value="DEVELOPER">Developer</option>
                <option value="DESIGNER">Designer</option>
                <option value="ANALYST">Analyst</option>
                <option value="CONSULTANT">Consultant</option>
                <option value="SALES">Sales</option>
                <option value="MARKETING">Marketing</option>
                <option value="IT_SUPPORT">IT Support</option>
                <option value="TEAM_LEAD">Team Lead</option>
                <option value="PROJECT_MANAGER">Project Manager</option>
              </select>
            </div>
          )}
        </div>
      </section>

      <div className="border-t border-gray-100" />

      {/* Timezone */}
      <section>
        <label className={labelClass}>Timezone</label>

        <div className="relative">
          <Clock
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            name="timezone"
            value={formData.timezone}
            onChange={handleChange}
            placeholder="Africa/Accra"
            className={`${inputClass} pl-10`}
            required
          />
        </div>

        <p className="mt-2 text-xs text-gray-500">
          Used for attendance records and employee working hours.
        </p>
      </section>
    </div>
  );
};

export default EmployeeFormFields;
