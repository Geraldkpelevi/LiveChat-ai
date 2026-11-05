import { useState } from "react";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import useChangePassword from "../hooks/useChangePassword";
import { useAuth } from "../context/AuthContext";

const PasswordField = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  autoComplete,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-medium text-gray-700"
      >
        {label}
      </label>

      <div className="relative">
        <input
          id={name}
          name={name}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 pr-12 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />

        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          aria-label={showPassword ? "Hide password" : "Show password"}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
        >
          {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
        </button>
      </div>
    </div>
  );
};

const ChangePassword = ({ onSuccess, onCancel }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [validationError, setValidationError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const {
    mutateAsync,
    isPending,
    error,
    reset,
  } = useChangePassword();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setValidationError("");
    setSuccessMessage("");
    reset();
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
      return;
    }

    setFormData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setValidationError("");
    setSuccessMessage("");
    reset();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      currentPassword,
      newPassword,
      confirmPassword,
    } = formData;

    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      setValidationError("All password fields are required.");
      return;
    }

    if (newPassword.length < 8) {
      setValidationError(
        "New password must be at least 8 characters."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setValidationError(
        "New password and confirmation do not match."
      );
      return;
    }

    if (currentPassword === newPassword) {
      setValidationError(
        "New password must be different from your current password."
      );
      return;
    }

    setValidationError("");
    setSuccessMessage("");

    try {
      const response = await mutateAsync(formData);

      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setSuccessMessage(
        response.message || "Password changed successfully."
      );

      logout();
      navigate("/signin", {
        replace: true,
        state: { message: "Password changed. Please sign in again." },
      });
      onSuccess?.(response);
    } catch {
      // React Query exposes the error through the error property.
    }
  };

  return (
    <div className="w-full rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-6 flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
          <LockKeyhole size={22} />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Change Password
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Update your password to keep your account secure.
          </p>
        </div>
      </div>

      <div className="mb-6 flex items-start gap-3 rounded-lg bg-blue-50 p-3">
        <ShieldCheck
          size={19}
          className="mt-0.5 shrink-0 text-blue-600"
        />

        <p className="text-sm text-blue-700">
          Choose a strong password containing at least 8 characters.
        </p>
      </div>

      {successMessage && (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-green-50 p-3 text-sm text-green-700">
          <CheckCircle2 size={18} />
          {successMessage}
        </div>
      )}

      {(validationError || error) && (
        <div className="mb-4 flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />

          <span>
            {validationError ||
              error?.response?.data?.message ||
              "Unable to change password. Please try again."}
          </span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <PasswordField
          label="Current Password"
          name="currentPassword"
          value={formData.currentPassword}
          onChange={handleChange}
          placeholder="Enter current password"
          autoComplete="current-password"
        />

        <PasswordField
          label="New Password"
          name="newPassword"
          value={formData.newPassword}
          onChange={handleChange}
          placeholder="Enter new password"
          autoComplete="new-password"
        />

        <PasswordField
          label="Confirm New Password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm new password"
          autoComplete="new-password"
        />

        <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={navigate ? () => navigate(-1) : handleCancel}
            disabled={isPending}
            className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isPending}
            className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? (
              <>
                <Loader2 size={17} className="animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <LockKeyhole size={17} />
                Update Password
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;