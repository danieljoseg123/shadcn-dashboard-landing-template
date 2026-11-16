"use client"

import { useState } from "react"
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { trackRecord } from "../track-record"

type RangeKey = "r12m" | "ytd"
const RANGES: { key: RangeKey; label: string }[] = [
  { key: "r12m", label: "12 meses" },
  { key: "ytd", label: "2026" },
]

const GOLD = "#C9A268"
const STONE = "#D9D6CE"

const pct = (n: number, digits = 1) =>
  `${n > 0 ? "+" : n < 0 ? "−" : ""}${Math.abs(n).toLocaleString("es-DO", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })}%`

const monthFmt = new Intl.DateTimeFormat("es-DO", { month: "short", timeZone: "UTC" })
const dayFmt = new Intl.DateTimeFormat("es-DO", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
})
const d = (iso: string) => new Date(iso + "T00:00:00Z")

export function TrackRecordChart() {
  const [range, setRange] = useState<RangeKey>("r12m")
  const data = trackRecord[range]
  const m = data.metrics
  const points = data.points as readonly { d: string; a: number; q: number }[]

  // Un tick por mes, en el primer punto de cada mes
  const ticks: string[] = []
  let lastMonth = -1
  for (const p of points) {
    const mo = d(p.d).getUTCMonth()
    if (mo !== lastMonth) {
      ticks.push(p.d)
      lastMonth = mo
    }
  }

  // Eje Y en pasos redondos de 50 puntos
  const vals = points.flatMap((p) => [p.a, p.q])
  const lo = Math.floor(Math.min(...vals) / 50) * 50
  const hi = Math.ceil(Math.max(...vals) / 50) * 50
  const yTicks: number[] = []
  for (let v = lo; v <= hi; v += 50) yTicks.push(v)

  const metrics = [
    { label: "Rendimiento", value: pct(m.ret), note: "TWR de la cuenta" },
    { label: "QQQ", value: pct(m.qqq), note: "Mismo período" },
    { label: "Máximo", value: pct(m.max), note: "Mejor punto del período" },
    { label: "Caída desde el máximo", value: pct(m.fromPeak), note: "Posición actual" },
    { label: "Caída máxima", value: pct(m.maxDD), note: "Del pico al valle" },
  ]

  return (
    <div className="mc-track">
      <div className="mc-track__head">
        <div className="mc-legend" aria-hidden="true">
          <span className="mc-legend__item">
            <i className="mc-legend__swatch" style={{ background: GOLD }} />
            Cuenta del prestatario (TWR)
          </span>
          <span className="mc-legend__item">
            <i className="mc-legend__swatch mc-legend__swatch--dashed" />
            QQQ
          </span>
        </div>
        <div className="mc-segmented mc-segmented--dark" role="group" aria-label="Período">
          {RANGES.map((r) => (
            <button
              key={r.key}
              type="button"
              aria-pressed={r.key === range}
              onClick={() => setRange(r.key)}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <div
        className="mc-track__chart"
        role="img"
        aria-label={`Rendimiento semanal acumulado de la cuenta frente al QQQ, ${dayFmt.format(d(m.start))} al ${dayFmt.format(d(m.end))}. Cuenta ${pct(m.ret)}, QQQ ${pct(m.qqq)}, caída máxima ${pct(m.maxDD)}.`}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={points as { d: string; a: number; q: number }[]} margin={{ top: 12, right: 12, bottom: 0, left: 0 }}>
            <CartesianGrid stroke="rgba(245,243,238,0.08)" vertical={false} />
            <XAxis
              dataKey="d"
              ticks={ticks}
              tickFormatter={(v: string) => monthFmt.format(d(v)).replace(".", "")}
              stroke="rgba(245,243,238,0.25)"
              tick={{ fill: "rgba(245,243,238,0.6)", fontSize: 11 }}
              tickLine={false}
              interval="preserveStartEnd"
              minTickGap={8}
            />
            <YAxis
              domain={[lo, hi]}
              ticks={yTicks}
              tickFormatter={(v: number) => `${v}%`}
              stroke="transparent"
              tick={{ fill: "rgba(245,243,238,0.6)", fontSize: 11 }}
              width={48}
            />
            <ReferenceLine y={0} stroke="rgba(245,243,238,0.35)" />
            <Tooltip
              cursor={{ stroke: "rgba(201,162,104,0.5)", strokeWidth: 1 }}
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null
                const row = payload[0].payload as { a: number; q: number }
                return (
                  <div className="mc-tooltip">
                    <div className="mc-tooltip__date">Semana al {dayFmt.format(d(String(label)))}</div>
                    <div className="mc-tooltip__row">
                      <i style={{ background: GOLD }} /> Cuenta <b>{pct(row.a)}</b>
                    </div>
                    <div className="mc-tooltip__row">
                      <i className="dashed" /> QQQ <b>{pct(row.q)}</b>
                    </div>
                  </div>
                )
              }}
            />
            <Line
              type="monotone"
              dataKey="q"
              name="QQQ"
              stroke={STONE}
              strokeOpacity={0.7}
              strokeWidth={1.5}
              strokeDasharray="5 4"
              dot={false}
              activeDot={{ r: 4, fill: STONE, stroke: "#0B1C2E", strokeWidth: 2 }}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="a"
              name="Cuenta"
              stroke={GOLD}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4.5, fill: GOLD, stroke: "#0B1C2E", strokeWidth: 2 }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <dl className="mc-metrics">
        {metrics.map((x) => (
          <div key={x.label}>
            <dt>{x.label}</dt>
            <dd>{x.value}</dd>
            <span>{x.note}</span>
          </div>
        ))}
      </dl>

      <p className="mc-track__source">
        Fuente: Interactive Brokers, cuenta personal del prestatario. Rendimiento ponderado por
        tiempo (TWR) en USD, puntos semanales; indicadores calculados sobre cierres diarios del{" "}
        {dayFmt.format(d(m.start))} al {dayFmt.format(d(m.end))}. QQQ: variación del precio de
        cierre, sin dividendos.
      </p>
    </div>
  )
}
