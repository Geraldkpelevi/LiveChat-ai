
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Briefcase,
  AlertCircle,
  Loader2,
} from "lucide-react";

import { useEmployeeRegistration } from "../hooks/useEmployees";
import EmployeeFormFields from "../components/employees/EmployeeFormFields";

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
  const navigate = useNavigate();

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

    if (error) reset();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await registerAsync(formData);

      navigate("/signin", {
        replace: true,
        state: {
          message:
            response.message ||
            "Registration submitted successfully. Awaiting admin approval.",
        },
      });
    } catch (err) {
      console.error(
        "Employee registration failed:",
        err.response?.data || err
      );
    }
  };

  const errorMessage =
    error?.response?.data?.message ||
    error?.message ||
    "Something went wrong. Please try again.";

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">

        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white">
            <Briefcase size={28} />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Employee Registration
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Create your employee account and submit your employment
            details for approval.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">

          {error && (
            <div className="mb-6 flex gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
              <AlertCircle size={20} className="mt-0.5 shrink-0" />
              <p className="text-sm">{errorMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">

            <EmployeeFormFields
              formData={formData}
              handleChange={handleChange}
              showEmploymentRole={false}
            />

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
              Your employment details will be reviewed by an administrator.
            </p>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already registered?{" "}
          <Link
            to="/signin"
            className="font-semibold text-blue-600 hover:text-blue-700"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default EmployeeRegistration;
