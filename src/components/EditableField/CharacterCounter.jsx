export default function CharacterCounter({ length, maxLength, showCount, nearLimit, atLimit }) {
  if (!showCount || !maxLength || !nearLimit) return null;

  return (
    <span
      className={`no-print block text-right text-[9px] mt-0.5 select-none font-sans ${
        atLimit ? "text-rose-500 font-bold" : "text-amber-500 font-semibold"
      }`}
      data-testid="character-counter"
    >
      {length}/{maxLength}
    </span>
  );
}
