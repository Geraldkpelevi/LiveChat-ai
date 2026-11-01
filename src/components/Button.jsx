import React from "react";
import clsx from "clsx";

const baseStyles =
  "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 outline-none select-none disabled:opacity-50 disabled:pointer-events-none focus-visible:ring-2 focus-visible:ring-offset-2 relative";

const variants = {
  primary:
    "bg-indigo-600 text-white hover:bg-indigo-700 focus-visible:ring-indigo-500 hover:cursor-pointer",
  secondary:
    "bg-gray-100 text-gray-900 hover:bg-gray-200 focus-visible:ring-gray-400 hover:cursor-pointer",
  danger:
    "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-800 hover:cursor-pointer",
  ghost:
    "bg-transparent text-gray-800 hover:bg-gray-100 focus-visible:ring-gray-400",
  outline:
    "border border-gray-300 bg-white text-gray-900 hover:bg-gray-50 focus-visible:ring-gray-400",
  success:
    "bg-emerald-600 text-white hover:bg-emerald-700 focus-visible:ring-emerald-500",
};

const sizes = {
  sm: "h-9 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
  icon: "h-10 w-10",
};

function buttonClasses({
  variant = "primary",
  size = "md",
  fullWidth = false,
}) {
  return clsx(
    baseStyles,
    variants[variant],
    sizes[size],
    fullWidth && "w-full"
  );
}

function Spinner() {
  return (
    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
  );
}

const Button = React.forwardRef(function Button(
  {
    children,
    variant = "primary",
    size = "md",
    loading = false,
    disabled = false,
    leftIcon,
    rightIcon,
    fullWidth = false,
    className = "",
    ...props
  },
  ref
) {
  return (
    <button
      ref={ref}
      className={clsx(
        buttonClasses({ variant, size, fullWidth }),
        className
      )}
      disabled={disabled || loading}
      aria-busy={loading}
      aria-live="polite"
      {...props}
    >
      {/* Keep original content for layout */}
      <span
        className={clsx(
          "inline-flex items-center gap-2 whitespace-nowrap",
          loading && "opacity-0",
        )}
      >
        {leftIcon}
        {children}
        {rightIcon}
      </span>

      {/* Spinner overlay (no layout shift) */}
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <Spinner />
        </span>
      )}

      {/* Screen reader only text */}
      {loading && (
        <span className="sr-only">
          Loading, please wait
        </span>
      )}
    </button>
  );
});

export default Button;