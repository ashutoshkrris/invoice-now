import ExportFieldView from "./ExportFieldView";
import CharacterCounter from "./CharacterCounter";

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
    return <ExportFieldView value={value} type={type} className={className} style={style} />;
  }

  const strValue = value ?? "";
  const length = typeof strValue === "string" ? strValue.length : String(strValue).length;
  const nearLimit = maxLength && length >= maxLength * 0.9;
  const atLimit = maxLength && length >= maxLength;

  const limitStatusClasses = atLimit
    ? "focus:ring-rose-500 border-rose-500 dark:border-rose-500 focus:border-rose-500!"
    : nearLimit
      ? "focus:ring-amber-500 border-amber-500 dark:border-amber-500 focus:border-amber-500!"
      : "";

  const renderCounter = () => (
    <CharacterCounter
      length={length}
      maxLength={maxLength}
      showCount={showCount}
      nearLimit={nearLimit}
      atLimit={atLimit}
    />
  );

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
        {renderCounter()}
      </div>
    );
  }

  const wrapperClass =
    type === "number" ||
    className.includes("inline") ||
    className.includes("w-10") ||
    className.includes("w-14")
      ? "contents"
      : "w-full";

  return (
    <div className={wrapperClass}>
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
      {type !== "number" && renderCounter()}
    </div>
  );
}
