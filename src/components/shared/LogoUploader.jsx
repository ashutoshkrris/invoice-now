import { Icons } from "./Icons";

export default function LogoUploader({
  invoice,
  onLogoUpload,
  onUpdateField,
  isExporting,
  id = "logo-uploader",
  labelText = "Upload Logo",
  subLabelText = "240 x 240 px @ 72 DPI, Max 1MB", // Default fallback instruction
  containerClassName = "",
  labelClassName = "",
  imageClassName = "max-h-12 max-w-45 object-contain",
  deleteButtonClassName = "absolute -top-2 -right-2 h-4 w-4 bg-rose-500 text-white rounded-full flex items-center justify-center text-[8px] font-bold cursor-pointer no-print",
}) {
  return (
    <div className={`relative group/logo w-48 min-h-10 flex items-center ${containerClassName}`}>
      <input type="file" id={id} accept="image/*" onChange={onLogoUpload} className="hidden" />

      {invoice.businessLogo ? (
        <div className="relative">
          <img src={invoice.businessLogo} alt="Logo" className={imageClassName} />
          {!isExporting && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onUpdateField("businessLogo", "");
              }}
              className={deleteButtonClassName}
            >
              ✕
            </button>
          )}
        </div>
      ) : !isExporting ? (
        <label htmlFor={id} className={`cursor-pointer flex flex-col gap-0.5 ${labelClassName}`}>
          <span className="flex items-center gap-1 justify-center">
            <Icons.Upload /> {labelText}
          </span>
          {subLabelText && (
            <span className="text-[10px] opacity-60 font-normal block leading-tight">
              {subLabelText}
            </span>
          )}
        </label>
      ) : null}
    </div>
  );
}
