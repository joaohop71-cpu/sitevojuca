import { useEffect, useState } from "react";
import { selo } from "@/imagens";
import { MARCA, zap } from "@/dados";

const ITENS = [
  { href: "#cafes", rotulo: "Cafés" },
  { href: "#sobre", rotulo: "Sobre nós" },
  { href: "#precos", rotulo: "Preços" },
  { href: "#origem", rotulo: "A terra" },
  { href: "#processo", rotulo: "Processo" },
  { href: "#fotos", rotulo: "Fotos" },
  { href: "#contato", rotulo: "Contato" },
];

export default function Navegacao() {
  const [rolou, setRolou] = useState(false);
  const [ativo, setAtivo] = useState("");

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

  return (
    <nav
      data-print-hide
      className="sticky top-0 z-50 transition-all duration-300"
      style={{
        background: rolou ? "rgba(239,227,204,0.93)" : "rgba(239,227,204,0.7)",
        backdropFilter: "blur(10px)",
        borderBottom: rolou ? "1px solid rgba(58,39,27,0.16)" : "1px solid transparent",
      }}
      aria-label="Navegação principal"
    >
      <div className="mx-auto flex h-[76px] w-[min(100%-2.5rem,1120px)] items-center justify-between gap-5">
        <a href="#topo" className="flex shrink-0 items-center gap-2.5">
          <img src={selo} alt={MARCA.nome} style={{ height: 50, width: 50 }} />
          <span
            className="hidden text-[18px] leading-none sm:block"
            style={{
              fontFamily: "Fraunces, Georgia, serif",
              fontVariationSettings: '"SOFT" 15, "WONK" 1, "opsz" 24',
              fontWeight: 600,
              letterSpacing: "0.01em",
            }}
          >
            {MARCA.nome}
          </span>
        </a>

        <div className="flex min-w-0 flex-1 items-center justify-end gap-5 overflow-x-auto sm:gap-6">
          {ITENS.map((i) => (
            <a
              key={i.href}
              href={i.href}
              className="whitespace-nowrap py-2 transition-colors"
              style={{
                fontFamily: '"Courier Prime", monospace',
                fontSize: 11.5,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: ativo === i.href ? "#8c3a20" : "#6b4526",
                borderBottom: `1px solid ${ativo === i.href ? "#8c3a20" : "transparent"}`,
              }}
            >
              {i.rotulo}
            </a>
          ))}
          <a
            href={zap("Olá! Quero conhecer os cafés do Vô Juca.")}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden shrink-0 border border-[#3a271b] bg-[#3a271b] px-4 py-2 text-[#efe3cc] transition-colors hover:border-[#8c3a20] hover:bg-[#8c3a20] md:inline-flex"
            style={{
              fontFamily: '"Courier Prime", monospace',
              fontSize: 12,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}
          >
            Pedir
          </a>
        </div>
      </div>
    </nav>
  );
}
