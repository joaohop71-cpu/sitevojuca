import { useEffect, useState } from "react";
import { PROMO, brl, zap } from "@/dados";
import { useResumo } from "@/carrinho";

/**
 * A barra do pedido, presa no pé da tela.
 *
 * A página tem umas vinte telas de rolagem. Quem escolhia um café no alto e
 * seguia lendo não recebia nenhuma confirmação de que o pedido existe, nem
 * tinha como fechá-lo sem voltar. Ela só aparece quando há o que fechar.
 */
export default function BarraPedido() {
  const { pacotes, quilos, total, mensagem } = useResumo();
  /* com a lista do pedido na tela a barra não tem o que fazer, e ainda cobria
     o botão de fechar que já está ali */
  const [naLista, setNaLista] = useState(false);

  useEffect(() => {
    const alvo = document.getElementById("precos");
    if (!alvo || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(
      ([e]) => setNaLista(e.isIntersecting),
      { rootMargin: "-20% 0px -20% 0px" }
    );
    obs.observe(alvo);
    return () => obs.disconnect();
  }, []);

  /* enquanto a barra estiver no ar, o corpo ganha a altura dela de folga no
     pé: sem isso ela cobre o rodapé quando a pessoa chega ao fim */
  useEffect(() => {
    if (!pacotes) return;
    const antes = document.body.style.paddingBottom;
    document.body.style.paddingBottom = "78px";
    return () => {
      document.body.style.paddingBottom = antes;
    };
  }, [pacotes]);

  if (!pacotes || naLista) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40"
      style={{
        background: "#2c1d14",
        color: "#efe3cc",
        /* o iPhone come a faixa de baixo com a barra de gestos */
        paddingBottom: "env(safe-area-inset-bottom)",
        boxShadow: "0 -10px 30px rgba(28,18,12,0.28)",
      }}
      data-print-hide
    >
      <div className="mx-auto flex w-[min(100%-1.5rem,1120px)] items-center justify-between gap-3 py-2.5 sm:gap-6 sm:py-3">
        <div className="min-w-0">
          <div className="ficha num text-[13px] leading-tight text-[#c0ab8c] sm:text-[14px]">
            {pacotes} {pacotes === 1 ? "pacote" : "pacotes"} ·{" "}
            {quilos.toLocaleString("pt-BR", { maximumFractionDigits: 2 })} kg
          </div>
          <div className="flex items-baseline gap-2">
            <span
              className="num text-[21px] leading-none sm:text-[24px]"
              style={{
                fontFamily: "Fraunces, Georgia, serif",
                fontVariationSettings: '"SOFT" 15, "WONK" 1, "opsz" 36',
                fontWeight: 600,
                color: "#f7efe0",
              }}
            >
              {brl(total)}
            </span>
            <span className="ficha hidden text-[12.5px] uppercase tracking-[0.12em] text-[#e8b98d] sm:inline">
              {PROMO.rotulo} já aplicado
            </span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <a
            href="#precos"
            className="ficha hidden px-2 py-3 text-[13.5px] uppercase tracking-[0.1em] text-[#c0ab8c] underline-offset-4 hover:underline sm:inline-block"
          >
            Ver a lista
          </a>
          <a
            href={zap(mensagem)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center whitespace-nowrap border px-4 py-3 text-[13.5px] uppercase tracking-[0.1em] transition-colors sm:px-6"
            style={{
              fontFamily: '"Courier Prime", monospace',
              background: "#efe3cc",
              borderColor: "#efe3cc",
              color: "#2c1d14",
            }}
          >
            Fechar pedido
          </a>
        </div>
      </div>
    </div>
  );
}
