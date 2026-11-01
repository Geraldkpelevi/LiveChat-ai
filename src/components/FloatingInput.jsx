
const FloatingInput = ({
  id,
  label,
  icon: Icon,
  type = "text",
  registration,
  error,
  rightElement,
  ...inputProps
}) => {
  return (
    <div className="w-full">
      <div className="relative">
        {/* LEFT ICON */}
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-600 z-10" />
        )}

        {/* INPUT */}
        <input
          id={id}
          type={type}
          placeholder=" "
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          {...inputProps}
          {...registration}
          className={`
            peer w-full pl-10 pr-3 pt-3.5 pb-2.5
            text-sm bg-transparent rounded-lg outline-none
            border transition-all duration-200 text-white
            ${
              error
                ? "border-red-500 focus:border-red-500"
                : "border-gray-300 focus:border-blue-600"
            }
            focus:border-2
            ${rightElement ? "pr-10" : ""}
          `}
        />

        {/* FLOATING LABEL */}
        <label
          htmlFor={id}
          className="
            absolute left-10 top-0 -translate-y-1/2
            px-1 text-xs text-gray-500 bg-white
            pointer-events-none transition-all duration-200

            peer-placeholder-shown:top-1/2
            peer-placeholder-shown:left-10
            peer-placeholder-shown:-translate-y-1/2
            peer-placeholder-shown:text-xs
            peer-placeholder-shown:px-1
            peer-placeholder-shown:bg-transparent

            peer-focus:top-0
            peer-focus:left-10
            peer-focus:-translate-y-1/2
            peer-focus:px-1
            peer-focus:bg-white
            peer-focus:text-sm
            peer-focus:text-blue-600
          "
        >
          {label}
        </label>

        {/* RIGHT ELEMENT */}
        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 z-10">
            {rightElement}
          </div>
        )}
      </div>

      {/* VALIDATION ERROR */}
      {error && (
        <p
          id={`${id}-error`}
          className="text-xs text-red-600 mt-1"
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default FloatingInput;
