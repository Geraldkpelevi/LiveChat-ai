
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
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";

import {useEmployeeRegistration} from "../hooks/useEmployees";

const initialFormData = {
  name: "",
  email: "",
  password: "",
  jobTitle: "",
  department: "",
  employmentType: "FULL_TIME",
  employmentRole: "EMPLOYEE",
  timezone: "Africa/Accra",
};

const EmployeeRegistration = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const {
    registerAsync,
    isPending,
    error,
    reset,
  } = useEmployeeRegistration();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (successMessage) {
      setSuccessMessage("");
    }

    if (error) {
      reset();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSuccessMessage("");

    try {
      const response = await registerAsync(formData);

      setSuccessMessage(
        response.message ||
          "Registration submitted successfully. Awaiting admin approval."
      );

      setFormData(initialFormData);
    } catch (err) {
      console.error(
        "Employee registration failed:",
        err.response?.data || err
      );
    }
  };

  const inputClass =
    "w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

  const labelClass =
    "mb-2 block text-sm font-medium text-gray-700";

  const errorMessage =
    error?.response?.data?.message ||
    error?.message ||
    "Something went wrong. Please try again.";

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white">
            <Briefcase size={28} />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Employee Registration
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Create your employee account and submit your
            employment details for approval.
          </p>
        </div>

        {/* Registration Card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">

          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 flex gap-3 rounded-lg border border-green-200 bg-green-50 p-4 text-green-700">
              <CheckCircle2
                size={20}
                className="mt-0.5 shrink-0"
              />

              <div>
                <p className="font-semibold">
                  Registration successful
                </p>

                <p className="mt-1 text-sm">
                  {successMessage}
                </p>

                <p className="mt-2 text-xs">
                  Your account is awaiting administrator approval.
                </p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 flex gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
              <AlertCircle
                size={20}
                className="mt-0.5 shrink-0"
              />

              <p className="text-sm">{errorMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Personal Information */}
            <div>
              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                Personal Information
              </h2>

              <div className="space-y-4">

                {/* Full Name */}
                <div>
                  <label className={labelClass}>
                    Full Name
                  </label>

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
                      placeholder="Enter your full name"
                      className={`${inputClass} pl-10`}
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className={labelClass}>
                    Email Address
                  </label>

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

                {/* Password */}
                <div>
                  <label className={labelClass}>
                    Password
                  </label>

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
                      onClick={() =>
                        setShowPassword((prev) => !prev)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
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
            </div>

            <div className="border-t border-gray-100" />

            {/* Employment Information */}
            <div>
              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                Employment Information
              </h2>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                {/* Job Title */}
                <div>
                  <label className={labelClass}>
                    Job Title
                  </label>

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

                {/* Department */}
                <div>
                  <label className={labelClass}>
                    Department
                  </label>

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

                {/* Employment Type */}
                <div>
                  <label className={labelClass}>
                    Employment Type
                  </label>

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

                {/* Employment Role */}
                <div>
                  <label className={labelClass}>
                    Employment Role
                  </label>

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
                    <option value="PROJECT_MANAGER">
                      Project Manager
                    </option>
                  </select>
                </div>

              </div>
            </div>

            <div className="border-t border-gray-100" />

            {/* Timezone */}
            <div>
              <label className={labelClass}>
                Timezone
              </label>

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
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isPending}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Submitting Registration...
                </>
              ) : (
                "Submit Employee Registration"
              )}
            </button>

            <p className="text-center text-xs text-gray-500">
              By registering, you agree to have your employment
              details reviewed by an administrator.
            </p>

          </form>
        </div>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already registered?{" "}
          <a
            href="/signin"
            className="font-semibold text-blue-600 hover:text-blue-700"
          >
            Sign in
          </a>
        </p>

      </div>
    </div>
  );
};

export default EmployeeRegistration;
