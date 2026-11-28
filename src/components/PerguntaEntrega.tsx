import { useRef } from "react";
import { createPortal } from "react-dom";
import type { MouseEvent, ReactNode } from "react";
import { zap } from "@/dados";
import type { useResumo } from "@/carrinho";
import { registrarPedido } from "@/pedido";

type Resumo = ReturnType<typeof useResumo>;

/* quem já disse que não quer o motoboy não é perguntado de novo nesta visita */
let semMotoboy = false;

const LINHA_SEM_CEP = "Meu CEP para a entrega: ";

/**
 * A pergunta antes do WhatsApp, quando o CEP ficou em branco.
 *
 * O campo do CEP fica no carrinho, e quem escolhe o café e vai direto no
 * "Fechar pedido" da barra de baixo nem passa por ele. Antes de abrir a
 * conversa sem o frete, o site pergunta: com entrega, leva até o CEP; sem,
 * segue para o WhatsApp avisando que a entrega se combina lá.
 */
export function usePerguntaEntrega(resumo: Resumo): {
  aoFechar: (e: MouseEvent<HTMLElement>) => void;
  pergunta: ReactNode;
} {
  const ref = useRef<HTMLDialogElement>(null);

  const aoFechar = (e: MouseEvent<HTMLElement>) => {
    if (resumo.entrega || semMotoboy) {
      registrarPedido(resumo);
      return;
    }
    e.preventDefault();
    ref.current?.showModal();
  };

  const comEntrega = () => {
    ref.current?.close();
    const campo = document.getElementById("ent-cep");
    const caixa = campo?.closest(".ent");
    if (!campo) {
      document.getElementById("precos")?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    campo.scrollIntoView({ block: "center", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    campo.focus({ preventScroll: true });
    /* um piscar na caixa, para o olho achar onde está o campo */
    caixa?.classList.remove("ent-chamando");
    void (caixa as HTMLElement | null)?.offsetWidth;
    caixa?.classList.add("ent-chamando");
  };

  const semEntrega = () => {
    semMotoboy = true;
    ref.current?.close();
    registrarPedido(resumo);
    window.open(
      zap(resumo.mensagem.replace(LINHA_SEM_CEP, "Entrega: sem motoboy, combino na conversa")),
      "_blank",
      "noopener,noreferrer"
    );
  };

  /* no corpo da página, e não dentro de quem chama: a barra de baixo tem
     transparência e transição próprias, que o aviso herdaria */
  const pergunta = createPortal(
    <dialog
      ref={ref}
      className="pergunta"
      aria-labelledby="pergunta-titulo"
      onClick={(e) => {
        /* um toque fora do papel fecha, como em qualquer aviso */
        if (e.target === ref.current) ref.current?.close();
      }}
    >
      <div className="pergunta-papel">
        <p className="eyebrow">Antes de mandar</p>
        <h3 id="pergunta-titulo">Quer receber por motoboy?</h3>
        <p className="pergunta-texto">
          Você ainda não pôs o seu CEP. Com ele, a entrega na Grande Florianópolis já
          entra no pedido, com o preço certo.
        </p>
        <div className="pergunta-botoes">
          <button type="button" className="pergunta-sim" onClick={comEntrega}>
            Sim, pôr o CEP
          </button>
          <button type="button" className="pergunta-nao" onClick={semEntrega}>
            Não, mandar assim
          </button>
        </div>
      </div>
    </dialog>,
    document.body
  );

  return { aoFechar, pergunta };
}
