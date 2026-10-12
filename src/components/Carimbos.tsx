import type { CSSProperties, ReactNode } from "react";

/**
 * Os selos da casa, como carimbos de borracha batidos à mão.
 *
 * Eram quatro linhas soltas com um traço na frente. Agora cada um é um
 * carimbo redondo, na cor de destaque da capa, com a borda da tinta falhada
 * (um filtro de ruído recorta o traço, como borracha em papel) e cada um um
 * pouco torto; passando o mouse, ele endireita.
 *
 * Os quatro ficam numa linha só, no computador e no celular: o carimbo
 * encolhe com a tela e a faixa nunca vira uma lista de duas colunas. O que
 * precisa ser lido está no meio de cada um, grande; o anel é a assinatura.
 */

const FR = { fontFamily: "Fraunces, Georgia, serif", fontWeight: 600 } as const;
const MONO = { fontFamily: '"Courier Prime", monospace', fontWeight: 700 } as const;

const CARIMBOS: { nome: string; anel: string; giro: number; meio: ReactNode }[] = [
  {
    nome: "100% arábica",
    anel: "100% ARÁBICA · CAFÉ ESPECIAL · ",
    giro: -6,
    meio: (
      <>
        <text x="100" y="106" fontSize="44" textAnchor="middle" style={FR}>100%</text>
        <text x="100" y="126" fontSize="14" textAnchor="middle" letterSpacing="2" style={MONO}>ARÁBICA</text>
      </>
    ),
  },
  {
    nome: "Quatro gerações",
    anel: "QUATRO GERAÇÕES · DESDE O JUCA · ",
    giro: 4,
    meio: (
      <>
        <text x="100" y="113" fontSize="66" textAnchor="middle" style={FR}>4</text>
        <text x="100" y="133" fontSize="14" textAnchor="middle" letterSpacing="2" style={MONO}>GERAÇÕES</text>
      </>
    ),
  },
  {
    nome: "Produção própria",
    anel: "PRODUÇÃO PRÓPRIA · DO PÉ AO PACOTE · ",
    giro: -3,
    meio: (
      <>
        <mask id="carimbo-grao" maskUnits="userSpaceOnUse" x="78" y="62" width="44" height="58">
          <image href="/carimbo-grao.png" x="79.3" y="62" width="41.4" height="58" />
        </mask>
        <rect x="78" y="62" width="44" height="58" fill="currentColor" mask="url(#carimbo-grao)" />
        <text x="100" y="137" fontSize="14" textAnchor="middle" letterSpacing="2" style={MONO}>PRÓPRIA</text>
      </>
    ),
  },
  {
    nome: "Atendimento direto",
    anel: "ATENDIMENTO DIRETO · FALE COM O JUCA · ",
    giro: 7,
    meio: (
      <g transform="translate(0 -9)">
        <path
          d="M74 76 H126 Q132 76 132 82 V106 Q132 112 126 112 H97 L84 123 L86 112 H74 Q68 112 68 106 V82 Q68 76 74 76 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinejoin="round"
        />
        <circle cx="87" cy="94" r="4" fill="currentColor" />
        <circle cx="100" cy="94" r="4" fill="currentColor" />
        <circle cx="113" cy="94" r="4" fill="currentColor" />
        <text x="100" y="142" fontSize="14" textAnchor="middle" letterSpacing="2" style={MONO}>DIRETO</text>
      </g>
    ),
  },
];

export default function Carimbos({ className = "", style }: { className?: string; style?: CSSProperties }) {
  return (
    <>
      {/* a tinta do carimbo: o ruído apaga pedacinhos do traço, poucos e
          espalhados, para o carimbo pequeno continuar legível */}
      <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
        <filter id="carimbo-tinta">
          <feTurbulence type="fractalNoise" baseFrequency="0.55" numOctaves="2" seed="4" result="ruido" />
          <feColorMatrix in="ruido" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.5 1.75" result="mascara" />
          <feComposite in="SourceGraphic" in2="mascara" operator="in" />
        </filter>
      </svg>
      <ul className={`carimbos ${className}`} style={style} aria-label="Selos da casa">
        {CARIMBOS.map((c, i) => (
          <li key={c.nome} className="carimbo" style={{ ["--giro" as string]: `${c.giro}deg` }}>
            <svg viewBox="0 0 200 200" role="img" aria-label={c.nome}>
              <defs>
                <path id={`carimbo-anel-${i}`} d="M100,100 m-72.5,0 a72.5,72.5 0 1,1 145,0 a72.5,72.5 0 1,1 -145,0" />
              </defs>
              <g filter="url(#carimbo-tinta)" fill="currentColor">
                <circle cx="100" cy="100" r="94" fill="none" stroke="currentColor" strokeWidth="5" />
                <circle cx="100" cy="100" r="63" fill="none" stroke="currentColor" strokeWidth="2" />
                <text fontSize="17" style={MONO}>
                  <textPath href={`#carimbo-anel-${i}`} textLength="451" lengthAdjust="spacing">
                    {c.anel}
                  </textPath>
                </text>
                {c.meio}
              </g>
            </svg>
          </li>
        ))}
      </ul>
    </>
  );
}
