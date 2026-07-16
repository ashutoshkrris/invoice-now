export default function EditableField({
  value,
  onChange,
  placeholder,
  className = "",
  style = {},
  type = "text",
  rows = 2,
  isExporting,
  maxLength,
  showCount = true,
  min,
  max,
}) {
  if (isExporting) {
    const hasNoContent =
      value === null || value === undefined || (typeof value === "string" && value.trim() === "");
    if (hasNoContent) {
      return null;
    }
    if (type === "textarea") {
      return (
        <div className={`${className} whitespace-pre-wrap`} style={style}>
          {value}
        </div>
      );
    }
    return (
      <div className={className} style={style}>
        {value}
      </div>
    );
  }

  const strValue = value ?? "";
  const length = typeof strValue === "string" ? strValue.length : String(strValue).length;
  const nearLimit = maxLength && length >= maxLength * 0.9;
  const atLimit = maxLength && length >= maxLength;

  // Visual outline status injections for error cues
  const limitStatusClasses = atLimit
    ? "focus:ring-rose-500 border-rose-500 dark:border-rose-500 focus:border-rose-500!"
    : nearLimit
      ? "focus:ring-amber-500 border-amber-500 dark:border-amber-500 focus:border-amber-500!"
      : "";

  // The counter will now ONLY render when showCount is true AND the length hits >= 90% of maxLength
  const counter =
    showCount && maxLength && nearLimit ? (
      <span
        className={`no-print block text-right text-[9px] mt-0.5 select-none font-sans ${
          atLimit ? "text-rose-500 font-bold" : "text-amber-500 font-semibold"
        }`}
      >
        {length}/{maxLength}
      </span>
    ) : null;

  if (type === "textarea") {
    return (
      <div className="w-full block">
        <textarea
          value={value}
          onChange={onChange}
          rows={rows}
          maxLength={maxLength}
          className={`wysiwyg-input resize-none ${limitStatusClasses} ${className}`}
          style={style}
          placeholder={placeholder}
        />
        {counter}
      </div>
    );
  }

  return (
    <div
      className={
        type === "number" ||
        className.includes("inline") ||
        className.includes("w-10") ||
        className.includes("w-14")
          ? "contents"
          : "w-full"
      }
    >
      <input
        type={type}
        value={value}
        onChange={onChange}
        maxLength={type === "number" ? undefined : maxLength}
        min={min}
        max={max}
        className={`wysiwyg-input ${limitStatusClasses} ${className}`}
        style={style}
        placeholder={placeholder}
      />
      {type !== "number" && counter}
    </div>
  );
}
