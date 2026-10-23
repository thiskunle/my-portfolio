/**
 * Mechanical odometer: each digit is a column of 0–9 (twice) inside a one-digit window.
 * The column rests on its final digit, so without JS the number reads correctly; StatsSection
 * rolls it from 0 into place. Screen readers get the plain value.
 */
export function Odometer({ value, suffix }: { value: number; suffix?: string }) {
  return (
    <span className="inline-flex items-start" aria-label={`${value}${suffix ?? ""}`} role="img">
      {String(value)
        .split("")
        .map((digit, i) => (
          <span key={i} aria-hidden className="block h-[1em] overflow-clip">
            <span
              data-odometer-column
              data-digit={digit}
              className="block"
              // Second 0–9 run: rest on index 10 + digit.
              style={{ transform: `translateY(-${((10 + Number(digit)) / 20) * 100}%)` }}
            >
              {Array.from({ length: 20 }, (_, k) => (
                <span key={k} className="block h-[1em]">
                  {k % 10}
                </span>
              ))}
            </span>
          </span>
        ))}
      {suffix ? <span aria-hidden>{suffix}</span> : null}
    </span>
  );
}
