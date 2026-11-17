import type { Metadata } from "next"
import { Figtree } from "next/font/google"
import {
  IconCalendar,
  IconCapital,
  IconDisburse,
  IconInterest,
  IconNote,
  IconReturn,
  IconTerms,
  Logo,
  Monogram,
  Waves,
} from "./components/brand"
import { InterestCalculator } from "./components/calculator"
import { TrackRecordChart } from "./components/track-record-chart"
import "./miura.css"

// Brand Book: una sola familia, Figtree (Light 300, Regular 400, Medium 500).
const figtree = Figtree({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal"],
  variable: "--mc-font",
  display: "swap",
})

// Página privada: se comparte por enlace directo. No se indexa ni se sigue.
export const metadata: Metadata = {
  title: "Miura Casta · Préstamo privado a tasa fija",
  description: "Documento privado y confidencial.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
  referrer: "no-referrer",
}

function Label({ children, tone = "light" }: { children: React.ReactNode; tone?: "light" | "dark" }) {
  return <p className={`mc-label mc-label--${tone}`}>{children}</p>
}

const STEPS = [
  {
    icon: IconTerms,
    title: "Condiciones individuales",
    body: "Monto, plazo, frecuencia de intereses y convención de días se acuerdan con el prestamista.",
  },
  {
    icon: IconNote,
    title: "Pagaré notarial",
    body: "Las condiciones se formalizan en un pagaré ante notario, firmado por el prestatario.",
  },
  {
    icon: IconDisburse,
    title: "Desembolso",
    body: "El prestamista transfiere el capital prestado en dólares. Desde esa fecha corren los intereses.",
  },
  {
    icon: IconCalendar,
    title: "Intereses periódicos",
    body: "Cada 90, 120 o 180 días, según lo pactado, se paga el interés fijo del período.",
  },
  {
    icon: IconReturn,
    title: "Devolución del capital",
    body: "Al vencimiento se devuelve el capital íntegro junto con el último pago de intereses.",
  },
]

const SUBJECT_TO = [
  ["Fechas y plazo", "Fecha de desembolso, calendario de pagos y fecha de vencimiento."],
  ["Frecuencia", "Pagos de intereses cada 90, 120 o 180 días."],
  ["Convención de días", "Base de cálculo y tratamiento de días no laborables."],
  ["Garantía", "Descripción y condiciones de la garantía ofrecida."],
  ["Retenciones fiscales", "Retenciones aplicables a los intereses según la ley vigente."],
  ["Aviso y devolución anticipada", "Plazos de aviso y condiciones para devolver el capital antes del vencimiento."],
  ["Identificación y origen de los fondos", "Documentación de identidad del prestamista y origen lícito del capital."],
  ["Moneda de pago", "Intereses y capital se pagan en dólares estadounidenses (USD)."],
]

export default function MiuraCastaPage() {
  return (
    <div lang="es" className={`mc ${figtree.variable}`}>
      {/* 1 · PORTADA */}
      <header className="mc-cover">
        <div className="mc-cover__bar">
          <span className="mc-caps">Santo Domingo</span>
          <span className="mc-caps">Privado y confidencial</span>
        </div>

        <div className="mc-cover__brand">
          <Logo className="mc-cover__logo" />
          <span className="mc-rule" aria-hidden="true" />
          <p className="mc-caps mc-caps--gold">Miura Casta · Préstamo privado a tasa fija</p>
        </div>

        <div className="mc-cover__copy">
          <h1 className="mc-display">Estructura de financiamiento</h1>
          <p className="mc-lead">
            12% anual fijo en dólares. Intereses periódicos, capital íntegro al vencimiento y ningún
            componente variable.
          </p>
        </div>

        <Waves className="mc-cover__waves" />
      </header>

      <main>
        {/* 2 · TÉRMINOS */}
        <section className="mc-section mc-section--ivory" aria-labelledby="terminos">
          <div className="mc-wrap">
            <Label>Términos</Label>
            <h2 id="terminos" className="mc-title">
              Lo que se pacta, y lo que no
            </h2>

            <div className="mc-cards">
              <article className="mc-card">
                <p className="mc-card__kicker">Hierro</p>
                <h3 className="mc-card__title">Interés fijo en dólares</h3>
                <p className="mc-card__quote">
                  El hierro certifica el origen: lo que lleva el nombre Miura, Miura lo responde.
                </p>

                <div className="mc-rate">
                  <span className="mc-rate__value">12%</span>
                  <span className="mc-rate__unit">anual fijo · USD</span>
                </div>

                <div className="mc-amounts" aria-label="Montos disponibles">
                  <span>US$33,200</span>
                  <span>US$50,000</span>
                  <span>US$75,000</span>
                </div>

                <ul className="mc-list">
                  <li>
                    Intereses cada <strong>90, 120 o 180 días</strong>. Base ACT/360, ajustable a lo que
                    se pacte.
                  </li>
                  <li>Capital íntegro al vencimiento, sin amortización.</li>
                  <li>Remuneración: solo el interés fijo.</li>
                </ul>

                <p className="mc-formula">
                  Interés = Capital × 12% × (Días ÷ 360)
                </p>
              </article>

              <article className="mc-card">
                <p className="mc-card__kicker">Naturaleza</p>
                <h3 className="mc-card__title">Un préstamo personal, por cuenta propia</h3>

                <dl className="mc-defs">
                  <div>
                    <dt>Prestatario</dt>
                    <dd>Daniel Gómez, persona física. Miura Holdings es la marca, no una sociedad.</dd>
                  </div>
                  <div>
                    <dt>Prestamista</dt>
                    <dd>Uno solo. Es acreedor: no participa en resultados ni es dueño de activos.</dd>
                  </div>
                  <div>
                    <dt>Documento</dt>
                    <dd>Pagaré notarial.</dd>
                  </div>
                  <div>
                    <dt>Destino de los fondos</dt>
                    <dd>
                      Pasan a ser capital propio del prestatario, que los invierte por cuenta propia en
                      acciones de EE. UU. Una parte puede destinarse a saldar el financiamiento del
                      vehículo ofrecido en garantía.
                    </dd>
                  </div>
                  <div>
                    <dt>Obligación de pago</dt>
                    <dd>
                      Intereses y capital se pagan con independencia de los resultados de la
                      inversión.
                    </dd>
                  </div>
                </dl>

                <div className="mc-isnot">
                  <p className="mc-isnot__title">Lo que no es</p>
                  <p>
                    No es un fondo ni gestión de capital de terceros. No hay participación en
                    ganancias, High-Water Mark ni retornos vinculados a resultados, y el prestamista
                    no tiene acceso a la cuenta.
                  </p>
                </div>
              </article>
            </div>
          </div>

          <div className="mc-band">
            <div className="mc-wrap mc-band__inner">
              <span className="mc-band__accent" aria-hidden="true" />
              <p>
                <strong>Una sola posición disponible.</strong> Miura Casta se cierra con un único
                prestamista.
              </p>
            </div>
          </div>
        </section>

        {/* 3 · DOS FLUJOS */}
        <section className="mc-section mc-section--negro" aria-labelledby="flujos">
          <div className="mc-wrap">
            <Label tone="dark">Flujos</Label>
            <h2 id="flujos" className="mc-title mc-title--dark">
              Dos flujos, una obligación
            </h2>
            <div className="mc-flows">
              <div className="mc-flow">
                <IconInterest ink="#F5F3EE" />
                <div>
                  <p className="mc-flow__when">Periódico</p>
                  <h3 className="mc-flow__title">Interés fijo</h3>
                  <p>
                    Se paga cada 90, 120 o 180 días sobre el capital prestado, a la tasa pactada.
                    No varía con los resultados.
                  </p>
                </div>
              </div>
              <div className="mc-flow">
                <IconCapital ink="#F5F3EE" />
                <div>
                  <p className="mc-flow__when">Al vencimiento</p>
                  <h3 className="mc-flow__title">Capital</h3>
                  <p>
                    Se devuelve íntegro en la fecha de vencimiento, junto con el último pago de
                    intereses.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4 · CALCULADORA */}
        <section className="mc-section mc-section--ivory" aria-labelledby="calculadora">
          <div className="mc-wrap">
            <Label>Calculadora de intereses</Label>
            <h2 id="calculadora" className="mc-title">
              El calendario, antes de firmar
            </h2>
            <p className="mc-intro">
              Ajusta los parámetros para ver los pagos ilustrativos. Las condiciones definitivas son
              las del pagaré.
            </p>
            <InterestCalculator />
          </div>
        </section>

        {/* 5 · CÓMO FUNCIONA */}
        <section className="mc-section mc-section--navy" aria-labelledby="como">
          <div className="mc-wrap">
            <Label tone="dark">Cómo funciona</Label>
            <h2 id="como" className="mc-title mc-title--dark">
              Cinco pasos
            </h2>
            <ol className="mc-steps">
              {STEPS.map(({ icon: Icon, title, body }, i) => (
                <li key={title} className="mc-step">
                  <span className="mc-step__n">{String(i + 1).padStart(2, "0")}</span>
                  <Icon ink="#F5F3EE" />
                  <h3 className="mc-step__title">{title}</h3>
                  <p>{body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* 6 · TENTADERO · TRAYECTORIA */}
        <section className="mc-section mc-section--negro" aria-labelledby="trayectoria">
          <div className="mc-wrap">
            <Label tone="dark">Tentadero · Trayectoria</Label>
            <h2 id="trayectoria" className="mc-title mc-title--dark">
              La trayectoria, con sus caídas
            </h2>
            <p className="mc-intro mc-intro--dark">
              En mercados de capitales desde 2023, con participación en la gestión de carteras
              institucionales de renta fija y renta variable.
            </p>

            <TrackRecordChart />

            <div className="mc-callout">
              <span className="mc-callout__rule" aria-hidden="true" />
              <p>
                La trayectoria respalda la disciplina y la capacidad de pago del prestatario, pero el
                interés pactado <strong>no depende de estos resultados</strong>. Se muestran las
                caídas, no solo el máximo. Rendimientos pasados no garantizan resultados futuros.
              </p>
            </div>
          </div>
        </section>

        {/* 7 · SUJETO AL PAGARÉ */}
        <section className="mc-section mc-section--ivory" aria-labelledby="pagare">
          <div className="mc-wrap">
            <Label>Pagaré notarial</Label>
            <h2 id="pagare" className="mc-title">
              Sujeto a lo que establezca el pagaré
            </h2>
            <dl className="mc-subject">
              {SUBJECT_TO.map(([t, b]) => (
                <div key={t}>
                  <dt>{t}</dt>
                  <dd>{b}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      </main>

      {/* 8 · CIERRE */}
      <footer className="mc-close">
        <Monogram className="mc-close__m" color="#3A4F66" title="" aria-hidden="true" />
        <div className="mc-wrap mc-close__inner">
          <p className="mc-close__motto">
            La casta no se promete.
            <br />
            <span>Se demuestra.</span>
          </p>
          <p className="mc-close__sign">
            Daniel Gómez <span aria-hidden="true">·</span> Miura Holdings
          </p>
          <p className="mc-legal">
            Préstamo personal entre particulares, dirigido a un prestamista específico. No constituye
            oferta pública, invitación al público ni participación en un fondo. Las cifras son
            ilustrativas. Rendimientos pasados no garantizan resultados futuros. Todos los términos
            están sujetos al pagaré notarial.
          </p>
        </div>
      </footer>
    </div>
  )
}
