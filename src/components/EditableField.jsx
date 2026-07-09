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
  showCount = false,
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

  const counter =
    showCount && maxLength ? (
      <span
        className={`no-print block text-right text-[10px] mt-0.5 ${
          atLimit ? "text-rose-500 font-semibold" : nearLimit ? "text-amber-500" : "text-slate-400"
        }`}
      >
        {length}/{maxLength}
      </span>
    ) : null;

  if (type === "textarea") {
    return (
      <div className="w-full">
        <textarea
          value={value}
          onChange={onChange}
          rows={rows}
          maxLength={maxLength}
          className={`wysiwyg-input resize-none ${className}`}
          style={style}
          placeholder={placeholder}
        />
        {counter}
      </div>
    );
  }

  return (
    <div className={type === "number" ? "contents" : "w-full"}>
      <input
        type={type}
        value={value}
        onChange={onChange}
        maxLength={type === "number" ? undefined : maxLength}
        className={`wysiwyg-input ${className}`}
        style={style}
        placeholder={placeholder}
      />
      {type !== "number" && counter}
    </div>
  );
}
