
import { useState } from "react";
import {
  X,
  UserPlus,
  Loader2,
  AlertCircle,
} from "lucide-react";

import EmployeeFormFields from "./EmployeeFormFields";

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

const CreateEmployeeModal = ({
  isOpen,
  onClose,
  onSubmit,
  isPending = false,
  error,
}) => {
  const [formData, setFormData] = useState(initialFormData);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await onSubmit(formData);

      setFormData(initialFormData);
    } catch (err) {
      console.error(
        "Employee creation failed:",
        err.response?.data || err
      );
    }
  };

  const handleClose = () => {
    if (isPending) return;

    setFormData(initialFormData);
    onClose();
  };

  const errorMessage =
    error?.response?.data?.message ||
    error?.message ||
    "Unable to create employee. Please try again.";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <UserPlus size={22} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Create Employee
              </h2>
              <p className="text-sm text-gray-500">
                Add a new employee to your organization.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={isPending}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
            aria-label="Close modal"
          >
            <X size={21} />
          </button>
        </div>

        {/* Form Content */}
        <div className="overflow-y-auto px-6 py-6">

          {error && (
            <div className="mb-5 flex gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
              <AlertCircle size={20} className="shrink-0" />
              <p className="text-sm">{errorMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">

            <EmployeeFormFields
              formData={formData}
              handleChange={handleChange}
              showEmploymentRole={true}
            />

            {/* Actions */}
            <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">

              <button
                type="button"
                onClick={handleClose}
                disabled={isPending}
                className="rounded-lg border border-gray-300 px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isPending}
                className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPending ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Creating Employee...
                  </>
                ) : (
                  <>
                    <UserPlus size={18} />
                    Create Employee
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateEmployeeModal;
