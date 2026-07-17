export default function ExportFieldView({ value, type, className = "", style = {} }) {
  const hasNoContent =
    value === null || value === undefined || (typeof value === "string" && value.trim() === "");

  if (hasNoContent) {
    return null;
  }

  if (type === "textarea") {
    return (
      <div
        className={`${className} whitespace-pre-wrap`}
        style={style}
        data-testid="export-textarea"
      >
        {value}
      </div>
    );
  }

  return (
    <div className={className} style={style} data-testid="export-input">
      {value}
    </div>
  );
}
