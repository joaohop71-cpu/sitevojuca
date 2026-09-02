import { useEffect } from "react";

/**
 * Faz os blocos marcados com a classe `reveal` aparecerem conforme entram na
 * tela. Uma vez visto, o bloco fica — nao some ao rolar de volta.
 *
 * Chamado uma unica vez no App: um observer so' para a pagina inteira.
 */
export function useRevelar() {
  useEffect(() => {
    const alvos = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    if (!alvos.length) return;

    const mostrarTudo = () => alvos.forEach((a) => a.classList.add("vis"));

    /* quem pediu menos movimento ve tudo de uma vez; idem se o navegador
       nao tiver IntersectionObserver — melhor visivel do que escondido */
    const semMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (semMovimento || typeof IntersectionObserver === "undefined") {
      mostrarTudo();
      return;
    }

    /* O que ja esta na tela aparece de imediato. O IntersectionObserver fica
       suspenso enquanto a aba esta em segundo plano — sem isto, quem abre o
       site numa aba de fundo acharia a pagina em branco ao voltar. */
    const naTela = (el: HTMLElement) => {
      const r = el.getBoundingClientRect();
      return r.top < window.innerHeight && r.bottom > 0;
    };
    alvos.forEach((a) => naTela(a) && a.classList.add("vis"));

    const obs = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (!e.isIntersecting) continue;
          e.target.classList.add("vis");
          obs.unobserve(e.target); // ja apareceu: para de observar
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    alvos.forEach((a) => a.classList.contains("vis") || obs.observe(a));
    return () => obs.disconnect();
  }, []);
}
