import { useEffect, useState } from "react";
import { selo } from "@/imagens";
import { MARCA, zap } from "@/dados";

const ITENS = [
  { href: "#cafes", rotulo: "Cafés" },
  { href: "#sobre", rotulo: "Sobre nós" },
  { href: "#arquivo", rotulo: "O arquivo" },
  { href: "#precos", rotulo: "Preços" },
  { href: "#origem", rotulo: "A terra" },
  { href: "#processo", rotulo: "Processo" },
  { href: "#contato", rotulo: "Contato" },
];

export default function Navegacao() {
  const [rolou, setRolou] = useState(false);
  const [ativo, setAtivo] = useState("");
  const [aberto, setAberto] = useState(false);

  useEffect(() => {
    const onScroll = () => setRolou(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const alvos = ITENS.map((i) => document.querySelector(i.href)).filter(Boolean) as Element[];
    const obs = new IntersectionObserver(
      (entradas) => {
        const visivel = entradas
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visivel) setAtivo("#" + visivel.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: [0, 0.2, 0.6] }
    );
    alvos.forEach((a) => obs.observe(a));
    return () => obs.disconnect();
  }, []);

  /* com o menu aberto: trava o corpo e fecha no Esc */
  useEffect(() => {
    if (!aberto) return;
    const antes = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAberto(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = antes;
      document.removeEventListener("keydown", onKey);
    };
  }, [aberto]);

  const rotulo = {
    fontFamily: '"Courier Prime", monospace',
    letterSpacing: "0.15em",
    textTransform: "uppercase",
  } as const;

  /* no alto da página a barra fica sobre a capa escura: tinta clara.
     assim que rola — ou abre o menu — volta a ser a barra de papel. */
  const claro = !rolou && !aberto;
  const tinta = claro ? "#efe3cc" : "#6b4526";
  const tintaForte = claro ? "#ffffff" : "#3a271b";
  const destaque = claro ? "#e8b98d" : "#8c3a20";

  return (
    <nav
      data-print-hide
      className="sticky top-0 z-50 transition-all duration-300"
      style={{
        background: claro ? "transparent" : "rgba(239,227,204,0.96)",
        backdropFilter: claro ? "none" : "blur(10px)",
        borderBottom: `1px solid ${claro ? "transparent" : "rgba(58,39,27,0.16)"}`,
      }}
      aria-label="Navegação principal"
    >
      <div className="mx-auto flex h-[72px] w-[min(100%-2rem,1120px)] items-center justify-between gap-4 sm:h-[76px] sm:w-[min(100%-2.5rem,1120px)]">
        <a
          href="#topo"
          onClick={() => setAberto(false)}
          className="flex shrink-0 items-center gap-2.5"
        >
          <img
            src={selo}
            alt={MARCA.nome}
            className="h-11 w-11 transition-[filter] duration-300 sm:h-[50px] sm:w-[50px]"
            style={claro ? { filter: "brightness(0) invert(1)", opacity: 0.94 } : undefined}
          />
          <span
            className="text-[17px] leading-none transition-colors duration-300 sm:text-[18px]"
            style={{
              fontFamily: "Fraunces, Georgia, serif",
              fontVariationSettings: '"SOFT" 15, "WONK" 1, "opsz" 24',
              fontWeight: 600,
              letterSpacing: "0.01em",
              color: tintaForte,
            }}
          >
            {MARCA.nome}
          </span>
        </a>

        {/* links inline — só no desktop */}
        <div className="hidden min-w-0 flex-1 items-center justify-end gap-5 lg:flex lg:gap-6">
          {ITENS.map((i) => (
            <a
              key={i.href}
              href={i.href}
              className="whitespace-nowrap py-2 transition-colors"
              style={{
                ...rotulo,
                fontSize: 13.5,
                color: ativo === i.href ? destaque : tinta,
                borderBottom: `1px solid ${ativo === i.href ? destaque : "transparent"}`,
              }}
            >
              {i.rotulo}
            </a>
          ))}
          <a
            href={zap("Olá! Quero conhecer os cafés do Vô Juca.")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 border px-4 py-2 transition-colors"
            style={{
              ...rotulo,
              fontSize: 14,
              letterSpacing: "0.14em",
              background: claro ? "#efe3cc" : "#3a271b",
              borderColor: claro ? "#efe3cc" : "#3a271b",
              color: claro ? "#2c1d14" : "#efe3cc",
            }}
          >
            Pedir
          </a>
        </div>

        {/* mobile: atalho de pedido + menu */}
        <div className="flex items-center gap-2 lg:hidden">
          <a
            href={zap("Olá! Quero conhecer os cafés do Vô Juca.")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center border px-3.5 transition-colors"
            style={{
              ...rotulo,
              fontSize: 13.5,
              letterSpacing: "0.12em",
              background: claro ? "#efe3cc" : "#3a271b",
              borderColor: claro ? "#efe3cc" : "#3a271b",
              color: claro ? "#2c1d14" : "#efe3cc",
            }}
          >
            Pedir
          </a>
          <button
            type="button"
            onClick={() => setAberto((a) => !a)}
            aria-expanded={aberto}
            aria-controls="menu-mobile"
            aria-label={aberto ? "Fechar menu" : "Abrir menu"}
            className="flex h-11 w-11 flex-col items-center justify-center gap-[5px] border transition-colors"
            style={{ borderColor: claro ? "rgba(239,227,204,0.5)" : "rgba(58,39,27,0.35)" }}
          >
            <span
              className="block h-px w-5 transition-transform duration-200"
              style={{
                background: tintaForte,
                ...(aberto ? { transform: "translateY(6px) rotate(45deg)" } : null),
              }}
            />
            <span
              className="block h-px w-5 transition-opacity duration-200"
              style={{ background: tintaForte, ...(aberto ? { opacity: 0 } : null) }}
            />
            <span
              className="block h-px w-5 transition-transform duration-200"
              style={{
                background: tintaForte,
                ...(aberto ? { transform: "translateY(-6px) rotate(-45deg)" } : null),
              }}
            />
          </button>
        </div>
      </div>

      {/* painel do menu mobile */}
      {aberto && (
        <div
          id="menu-mobile"
          className="border-t border-[rgba(58,39,27,0.16)] lg:hidden"
          style={{ background: "rgba(239,227,204,0.98)" }}
        >
          <div className="mx-auto w-[min(100%-2rem,1120px)] py-2">
            {ITENS.map((i) => (
              <a
                key={i.href}
                href={i.href}
                onClick={() => setAberto(false)}
                className="flex items-center justify-between border-b border-[rgba(58,39,27,0.14)] py-4 last:border-b-0"
                style={{
                  ...rotulo,
                  fontSize: 15,
                  color: ativo === i.href ? "#8c3a20" : "#3a271b",
                }}
              >
                {i.rotulo}
                <span aria-hidden="true" className="text-[#8c7a66]">
                  →
                </span>
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
