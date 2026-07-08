export default function EditableField({
  value,
  onChange,
  placeholder,
  className = "",
  style = {},
  type = "text",
  rows = 2,
  isExporting,
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

  if (type === "textarea") {
    return (
      <textarea
        value={value}
        onChange={onChange}
        rows={rows}
        className={`wysiwyg-input resize-none ${className}`}
        style={style}
        placeholder={placeholder}
      />
    );
  }

  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      className={`wysiwyg-input ${className}`}
      style={style}
      placeholder={placeholder}
    />
  );
}
