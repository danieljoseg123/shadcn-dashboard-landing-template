/**
 * Elementos de marca de Miura Holdings.
 *
 * - Logo (MIURA con astas + HOLDINGS) y símbolo (M con astas): trazos vectorizados
 *   del Brand Book. Regla de marca: donde dice MIURA no va la M sola, y viceversa.
 * - Oro solo sobre oscuro; sobre claro, Oro Profundo o Navy.
 */
import type { SVGProps } from "react"
import { LOGO_PATH, LOGO_VIEWBOX, SYMBOL_PATH, SYMBOL_VIEWBOX } from "./logo-paths"

const GOLD = "#C9A268"

type MarkProps = SVGProps<SVGSVGElement> & { color?: string; title?: string }

/** Símbolo: la M con astas. Solo donde la palabra no cabe. */
export function Monogram({ color = GOLD, title = "Miura", ...props }: MarkProps) {
  return (
    <svg viewBox={SYMBOL_VIEWBOX} role="img" aria-label={title || undefined} {...props}>
      <path fill={color} fillRule="evenodd" d={SYMBOL_PATH} />
    </svg>
  )
}

/** Logotipo completo: MIURA con astas sobre la M, y HOLDINGS. */
export function Logo({ color = GOLD, title = "Miura Holdings", ...props }: MarkProps) {
  return (
    <svg viewBox={LOGO_VIEWBOX} role="img" aria-label={title} {...props}>
      <path fill={color} fillRule="evenodd" d={LOGO_PATH} />
    </svg>
  )
}

/** Ondas de línea fina para el pie de la portada. */
export function Waves({ color = GOLD, ...props }: SVGProps<SVGSVGElement> & { color?: string }) {
  // Senoides suaves muestreadas: sin uniones visibles entre tramos
  const lines = Array.from({ length: 7 }, (_, i) => {
    const base = 40 + i * 11
    const amp = 6 + i * 1.6
    const phase = i * 0.55
    const pts: string[] = []
    for (let x = -20; x <= 1220; x += 20) {
      const y = base + amp * Math.sin((x / 1200) * Math.PI * 2 + phase) + amp * 0.35 * Math.sin((x / 1200) * Math.PI * 5 - phase)
      pts.push(`${x} ${y.toFixed(2)}`)
    }
    return "M" + pts.join(" L")
  })
  return (
    <svg viewBox="0 0 1200 130" preserveAspectRatio="none" aria-hidden="true" {...props}>
      <g fill="none" stroke={color} strokeWidth={1} vectorEffect="non-scaling-stroke">
        {lines.map((d, i) => (
          <path key={d} d={d} strokeOpacity={0.12 + i * 0.06} vectorEffect="non-scaling-stroke" />
        ))}
      </g>
    </svg>
  )
}

/* ---------- Íconos de línea delgada: navy con acento dorado ---------- */
type IconProps = SVGProps<SVGSVGElement> & { ink?: string; accent?: string }

function Icon({ children, ink = "#0B1C2E", ...props }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={44}
      height={44}
      fill="none"
      stroke={ink}
      strokeWidth={1.25}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  )
}

/** Interés periódico: ciclo. */
export function IconInterest({ accent = GOLD, ...p }: IconProps) {
  return (
    <Icon {...p}>
      <path d="M38 20 A15 15 0 0 0 11 15" />
      <path d="M10 28 A15 15 0 0 0 37 33" />
      <path d="M11 8 V15 H18" />
      <path d="M37 40 V33 H30" />
      <circle cx="24" cy="24" r="3.2" stroke={accent} />
    </Icon>
  )
}

/** Capital al vencimiento: pilar. */
export function IconCapital({ accent = GOLD, ...p }: IconProps) {
  return (
    <Icon {...p}>
      <path d="M8 17 L24 8 L40 17 Z" />
      <path d="M13 21 V35 M20 21 V35 M28 21 V35 M35 21 V35" />
      <path d="M7 40 H41" stroke={accent} />
    </Icon>
  )
}

export function IconTerms({ accent = GOLD, ...p }: IconProps) {
  return (
    <Icon {...p}>
      <path d="M13 6 H30 L37 13 V42 H13 Z" />
      <path d="M30 6 V13 H37" />
      <path d="M18 21 H31 M18 27 H31 M18 33 H25" />
      <path d="M27 35 L30 38 L35 32" stroke={accent} />
    </Icon>
  )
}

export function IconNote({ accent = GOLD, ...p }: IconProps) {
  return (
    <Icon {...p}>
      <path d="M8 12 H40 V36 H8 Z" />
      <path d="M13 19 H27 M13 25 H24" />
      <circle cx="33" cy="28" r="4.5" stroke={accent} />
      <path d="M31 32 L30 38 L33 36 L36 38 L35 32" stroke={accent} />
    </Icon>
  )
}

export function IconDisburse({ accent = GOLD, ...p }: IconProps) {
  return (
    <Icon {...p}>
      <path d="M8 28 V40 H40 V28" />
      <path d="M24 6 V30" stroke={accent} />
      <path d="M17 23 L24 30 L31 23" stroke={accent} />
    </Icon>
  )
}

export function IconCalendar({ accent = GOLD, ...p }: IconProps) {
  return (
    <Icon {...p}>
      <path d="M8 12 H40 V40 H8 Z" />
      <path d="M8 19 H40" />
      <path d="M16 7 V14 M32 7 V14" />
      <circle cx="30" cy="30" r="3" stroke={accent} />
    </Icon>
  )
}

export function IconReturn({ accent = GOLD, ...p }: IconProps) {
  return (
    <Icon {...p}>
      <path d="M12 16 H32 A8 8 0 0 1 32 32 H14" />
      <path d="M18 10 L12 16 L18 22" />
      <path d="M8 40 H40" stroke={accent} />
    </Icon>
  )
}
