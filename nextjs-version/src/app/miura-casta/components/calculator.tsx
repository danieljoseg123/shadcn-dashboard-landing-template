"use client"

import { useMemo, useState, useSyncExternalStore } from "react"

type DayCount = "ACT/360" | "ACT/365" | "30/360"

const AMOUNTS = [33200, 50000, 75000]
const TERMS = [12, 14, 18, 24]
const FREQS = [90, 120, 180]
const CONVENTIONS: DayCount[] = ["ACT/360", "ACT/365", "30/360"]

const DAY = 86_400_000

/* ---------- Utilidades de fecha (UTC, sin husos) ---------- */
function parseISO(s: string) {
  const [y, m, d] = s.split("-").map(Number)
  return new Date(Date.UTC(y, m - 1, d))
}
function toISO(d: Date) {
  return d.toISOString().slice(0, 10)
}
function addDays(d: Date, n: number) {
  return new Date(d.getTime() + n * DAY)
}
function addMonths(d: Date, n: number) {
  const y = d.getUTCFullYear()
  const m = d.getUTCMonth() + n
  const last = new Date(Date.UTC(y, m + 1, 0)).getUTCDate()
  return new Date(Date.UTC(y, m, Math.min(d.getUTCDate(), last)))
}
function actualDays(a: Date, b: Date) {
  return Math.round((b.getTime() - a.getTime()) / DAY)
}
function days30360(a: Date, b: Date) {
  const d1 = Math.min(a.getUTCDate(), 30)
  const d2 = d1 === 30 && b.getUTCDate() === 31 ? 30 : b.getUTCDate()
  return (
    360 * (b.getUTCFullYear() - a.getUTCFullYear()) +
    30 * (b.getUTCMonth() - a.getUTCMonth()) +
    (d2 - d1)
  )
}

/* ---------- Formatos ---------- */
const money = (n: number) =>
  "US$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const moneyShort = (n: number) => "US$" + n.toLocaleString("en-US", { maximumFractionDigits: 0 })
const dateFmt = new Intl.DateTimeFormat("es-DO", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
})
const fmtDate = (d: Date) => dateFmt.format(d).replace(".", "")

type Row = {
  n: number
  start: Date
  pay: Date
  days: number
  interest: number
  capital: number
  total: number
  pending: number
  short: boolean
}

export function buildSchedule(
  principal: number,
  ratePct: number,
  termMonths: number,
  freqDays: number,
  convention: DayCount,
  disbursement: Date
) {
  const maturity = addMonths(disbursement, termMonths)
  const basis = convention === "ACT/365" ? 365 : 360
  const r = ratePct / 100
  const rows: Row[] = []
  let start = disbursement
  for (let k = 1; k < 1000; k++) {
    let pay = addDays(disbursement, k * freqDays)
    const last = pay.getTime() >= maturity.getTime()
    if (last) pay = maturity
    const days = convention === "30/360" ? days30360(start, pay) : actualDays(start, pay)
    const interest = Math.round(principal * r * (days / basis) * 100) / 100
    const capital = last ? principal : 0
    rows.push({
      n: k,
      start,
      pay,
      days,
      interest,
      capital,
      total: interest + capital,
      pending: last ? 0 : principal,
      short: last && actualDays(start, pay) < freqDays,
    })
    if (last) break
    start = pay
  }
  const fullPeriodInterest =
    convention === "30/360"
      ? Math.round(principal * r * (days30360(disbursement, addDays(disbursement, freqDays)) / 360) * 100) / 100
      : Math.round(principal * r * (freqDays / basis) * 100) / 100
  const totalInterest = rows.reduce((s, x) => s + x.interest, 0)
  return { rows, maturity, fullPeriodInterest, totalInterest, finalPayment: rows[rows.length - 1].total }
}

const noopSubscribe = () => () => {}

function defaultDisbursement() {
  const now = new Date()
  // primer día del mes siguiente, como fecha ilustrativa
  return toISO(new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1)))
}

export function InterestCalculator() {
  const [amount, setAmount] = useState(50000)
  const [rate, setRate] = useState(12)
  const [term, setTerm] = useState(12)
  const [freq, setFreq] = useState(90)
  const [conv, setConv] = useState<DayCount>("ACT/360")
  // La fecha por defecto se calcula en el cliente para no congelarla en el prerender.
  const clientDefault = useSyncExternalStore(noopSubscribe, defaultDisbursement, () => "2026-12-01")
  const [picked, setDisb] = useState<string | null>(null)
  const disb = picked ?? clientDefault

  const valid = amount > 0 && rate >= 0 && /^\d{4}-\d{2}-\d{2}$/.test(disb)
  const result = useMemo(
    () => (valid ? buildSchedule(amount, rate, term, freq, conv, parseISO(disb)) : null),
    [valid, amount, rate, term, freq, conv, disb]
  )

  return (
    <div className="mc-calc">
      <div className="mc-calc__controls">
        <fieldset className="mc-field mc-field--wide">
          <legend className="mc-field__label">Monto del préstamo</legend>
          <div className="mc-chips" role="group">
            {AMOUNTS.map((a) => (
              <button
                key={a}
                type="button"
                className="mc-chip"
                aria-pressed={amount === a}
                onClick={() => setAmount(a)}
              >
                {moneyShort(a)}
              </button>
            ))}
          </div>
          <div className="mc-input mc-input--prefix">
            <span aria-hidden="true">US$</span>
            <input
              type="number"
              inputMode="decimal"
              min={0}
              step={100}
              value={Number.isFinite(amount) ? amount : ""}
              onChange={(e) => setAmount(Number(e.target.value))}
              aria-label="Monto en dólares"
            />
          </div>
        </fieldset>

        <label className="mc-field">
          <span className="mc-field__label">Tasa anual fija</span>
          <div className="mc-input mc-input--suffix">
            <input
              type="number"
              inputMode="decimal"
              min={0}
              max={100}
              step={0.25}
              value={Number.isFinite(rate) ? rate : ""}
              onChange={(e) => setRate(Number(e.target.value))}
            />
            <span aria-hidden="true">%</span>
          </div>
        </label>

        <Segmented
          label="Plazo ilustrativo · meses"
          options={TERMS.map((t) => ({ value: t, label: String(t) }))}
          value={term}
          onChange={setTerm}
        />
        <Segmented
          label="Intereses cada · días"
          options={FREQS.map((f) => ({ value: f, label: String(f) }))}
          value={freq}
          onChange={setFreq}
        />
        <Segmented
          label="Convención de días"
          options={CONVENTIONS.map((c) => ({ value: c, label: c }))}
          value={conv}
          onChange={setConv}
        />

        <label className="mc-field">
          <span className="mc-field__label">Desembolso ilustrativo</span>
          <div className="mc-input">
            <input type="date" value={disb} onChange={(e) => setDisb(e.target.value)} />
          </div>
        </label>
      </div>

      {result ? (
        <>
          <dl className="mc-calc__summary">
            <div>
              <dt>Interés bruto por período completo</dt>
              <dd>{money(result.fullPeriodInterest)}</dd>
              <span>cada {freq} días</span>
            </div>
            <div>
              <dt>Total de intereses</dt>
              <dd>{money(result.totalInterest)}</dd>
              <span>en {term} meses</span>
            </div>
            <div>
              <dt>Número de pagos</dt>
              <dd>{result.rows.length}</dd>
              <span>vence el {fmtDate(result.maturity)}</span>
            </div>
            <div className="is-accent">
              <dt>Pago final</dt>
              <dd>{money(result.finalPayment)}</dd>
              <span>último interés + capital</span>
            </div>
          </dl>

          <div className="mc-table-wrap" tabIndex={0} aria-label="Calendario de pagos ilustrativo">
            <table className="mc-table">
              <thead>
                <tr>
                  <th scope="col">N.º</th>
                  <th scope="col">Inicio</th>
                  <th scope="col">Fecha de pago</th>
                  <th scope="col" className="num">Días</th>
                  <th scope="col" className="num">Interés</th>
                  <th scope="col" className="num">Capital</th>
                  <th scope="col" className="num">Pago total</th>
                  <th scope="col" className="num">Principal pendiente</th>
                </tr>
              </thead>
              <tbody>
                {result.rows.map((r) => (
                  <tr key={r.n} className={r.capital ? "is-final" : undefined}>
                    <td>{r.n}</td>
                    <td>{fmtDate(r.start)}</td>
                    <td>
                      {fmtDate(r.pay)}
                      {r.capital ? <span className="mc-tag">Vencimiento</span> : null}
                    </td>
                    <td className="num">
                      {r.days}
                      {r.short ? <sup title="Período final corto">*</sup> : null}
                    </td>
                    <td className="num">{money(r.interest)}</td>
                    <td className="num">{r.capital ? money(r.capital) : "—"}</td>
                    <td className="num">{money(r.total)}</td>
                    <td className="num">{money(r.pending)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={4}>Total</td>
                  <td className="num">{money(result.totalInterest)}</td>
                  <td className="num">{money(amount)}</td>
                  <td className="num">{money(result.totalInterest + amount)}</td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
        </>
      ) : (
        <p className="mc-note">Introduce un monto, una tasa y una fecha válidos.</p>
      )}

      <p className="mc-note">
        Interés = Capital × Tasa × (Días ÷ Base). Cifras ilustrativas de intereses brutos, antes de
        retenciones fiscales. Los pagos se calculan cada {freq} días desde el desembolso; el período
        final, si es más corto, se paga al vencimiento junto con el capital. El asterisco (*) marca un período final corto. No se ajustan días no
        laborables. Fechas, plazo y montos definitivos quedan sujetos a lo que establezca el pagaré
        notarial.
      </p>
    </div>
  )
}

function Segmented<T extends string | number>({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: { value: T; label: string }[]
  value: T
  onChange: (v: T) => void
}) {
  return (
    <fieldset className="mc-field">
      <legend className="mc-field__label">{label}</legend>
      <div className="mc-segmented">
        {options.map((o) => (
          <button
            key={String(o.value)}
            type="button"
            aria-pressed={o.value === value}
            onClick={() => onChange(o.value)}
          >
            {o.label}
          </button>
        ))}
      </div>
    </fieldset>
  )
}
