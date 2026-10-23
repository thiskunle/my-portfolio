/**
 * Mechanical odometer: each digit is a column of 0–9 inside a one-digit window. The column
 * rests on its final digit, so without JS the number reads correctly; StatsSection counts it
 * up from 0. Screen readers get the plain value.
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
              style={{ transform: `translateY(-${Number(digit) * 10}%)` }}
            >
              {Array.from({ length: 10 }, (_, k) => (
                <span key={k} className="block h-[1em]">
                  {k}
                </span>
              ))}
            </span>
          </span>
        ))}
      {suffix ? <span aria-hidden>{suffix}</span> : null}
    </span>
  );
}
