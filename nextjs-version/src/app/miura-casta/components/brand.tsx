/**
 * Elementos de marca de Miura Holdings, dibujados en SVG.
 *
 * - Logo (MIURA con astas) y símbolo (M con astas): reconstruidos a partir de
 *   la geometría del Brand Book (V de la M al 68% de la altura, astas más anchas
 *   que la letra, terminales redondeados).
 * - Toro: trazo de línea fina. Si existe el archivo vectorial original del toro,
 *   basta con reemplazar el contenido de <Bull />.
 */
import type { SVGProps } from "react"

const GOLD = "#C9A268"

/* ---------- Geometría compartida del logo ---------- */
const HORNS = "M-53 -218 C-42 -130 40 -85 166 -85 C292 -85 374 -130 385 -218"
const LETTER_M = "M0 275 V0 L165 187 L330 0 V275"
const LETTERS_IURA = [
  "M555 0 V275",
  "M782 0 V146 A129 129 0 0 0 1040 146 V0",
  "M1265 275 V0 H1382 C1448 0 1495 35 1495 77.5 C1495 120 1448 155 1382 155 H1265 M1372 155 L1490 275",
  "M1690 275 L1828 0 L1966 275 M1740 175 H1916",
]

type MarkProps = SVGProps<SVGSVGElement> & { color?: string; title?: string }

/** Símbolo: la M con astas. Solo donde la palabra no cabe. */
export function Monogram({ color = "#C2A684", title = "Miura", ...props }: MarkProps) {
  return (
    <svg viewBox="-70 -235 525 527" role="img" aria-label={title} {...props}>
      <g fill="none" stroke={color} strokeWidth={16} strokeLinecap="round" strokeLinejoin="round">
        <path d={HORNS} />
        <path d={LETTER_M} />
      </g>
    </svg>
  )
}

/** Logotipo: MIURA con astas sobre la M. */
export function Wordmark({ color = GOLD, title = "Miura", ...props }: MarkProps) {
  return (
    <svg viewBox="-70 -235 2052 527" role="img" aria-label={title} {...props}>
      <g fill="none" stroke={color} strokeWidth={16} strokeLinecap="round" strokeLinejoin="round">
        <path d={HORNS} />
        <path d={LETTER_M} />
        {LETTERS_IURA.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
    </svg>
  )
}

/** Toro dorado, trazo fino, sin fondo. */
export function Bull({ color = GOLD, title = "Toro Miura", ...props }: MarkProps) {
  return (
    <svg viewBox="0 0 240 200" role="img" aria-label={title} {...props}>
      <g
        fill="none"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      >
        {/* Astas */}
        <path d="M82 62 C58 64 30 56 18 36 C12 26 12 14 18 6 C22 18 30 32 46 40 C60 47 72 50 84 50" />
        <path d="M158 62 C182 64 210 56 222 36 C228 26 228 14 222 6 C218 18 210 32 194 40 C180 47 168 50 156 50" />
        {/* Testuz */}
        <path d="M84 50 C100 44 140 44 156 50" />
        {/* Orejas */}
        <path d="M82 64 C68 64 54 72 46 84 C62 88 76 82 86 74" />
        <path d="M158 64 C172 64 186 72 194 84 C178 88 164 82 154 74" />
        {/* Cara y morro */}
        <path d="M84 52 C82 72 88 100 96 128 C99 140 100 152 100 162 C100 176 110 182 120 182 C130 182 140 176 140 162 C140 152 141 140 144 128 C152 100 158 72 156 52" />
        {/* Rizos del testuz */}
        <path d="M108 56 C112 62 116 60 118 56 M122 56 C124 60 128 62 132 56 M112 66 C116 70 124 70 128 66" strokeOpacity={0.8} />
        {/* Ojos */}
        <path d="M94 96 C98 91 106 91 110 96 C106 99 98 99 94 96" />
        <path d="M146 96 C142 91 134 91 130 96 C134 99 142 99 146 96" />
        {/* Morro y ollares */}
        <path d="M104 158 C112 154 128 154 136 158" />
        <path d="M108 168 C110 172 114 172 116 169" />
        <path d="M132 168 C130 172 126 172 124 169" />
      </g>
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
