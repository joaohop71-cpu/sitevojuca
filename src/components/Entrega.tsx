import { useState } from "react";
import { brl } from "@/dados";
import { FAIXAS, calcularEntrega, cepComTraco, guardarEntrega, ondeFica, useEntrega } from "@/frete";

/**
 * O CEP e o frete, dentro do carrinho.
 *
 * Calcula sozinho quando o oitavo número é digitado: no celular, procurar o
 * botão depois de digitar é um passo a mais que ninguém precisa. O botão fica
 * para quem cola o CEP ou usa o teclado.
 */
export default function Entrega() {
  const entrega = useEntrega();
  const [digitos, setDigitos] = useState("");
  const [buscando, setBuscando] = useState(false);
  const [erro, setErro] = useState(false);
  const [trocando, setTrocando] = useState(false);

  const calcular = async (d: string) => {
    if (d.length !== 8 || buscando) return;
    setBuscando(true);
    setErro(false);
    const e = await calcularEntrega(d);
    setBuscando(false);
    if (!e) {
      setErro(true);
      return;
    }
    guardarEntrega(e);
    setTrocando(false);
  };

  const comCampo = !entrega || trocando;

  return (
    <div className="ent">
      <div className="ent-topo">
        <span className="eyebrow">Entrega por motoboy</span>
        <span className="ent-regiao">Grande Florianópolis</span>
      </div>

      {comCampo ? (
        <form
          className="ent-form"
          onSubmit={(e) => {
            e.preventDefault();
            void calcular(digitos);
          }}
        >
          <label htmlFor="ent-cep">Seu CEP</label>
          <input
            id="ent-cep"
            type="text"
            inputMode="numeric"
            autoComplete="postal-code"
            placeholder="00000-000"
            maxLength={9}
            value={digitos.length > 5 ? cepComTraco(digitos) : digitos}
            onChange={(e) => {
              const d = e.target.value.replace(/\D/g, "").slice(0, 8);
              setDigitos(d);
              setErro(false);
              if (d.length === 8) void calcular(d);
            }}
          />
          <button type="submit" disabled={digitos.length !== 8 || buscando}>
            {buscando ? "Calculando…" : "Calcular"}
          </button>
        </form>
      ) : (
        <div className="ent-resultado">
          <div className="min-w-0">
            <b className="num">
              {entrega.longe ? "A combinar" : entrega.valor === null ? "Sob consulta" : brl(entrega.valor)}
            </b>
            <span>
              CEP {cepComTraco(entrega.cep)} · {ondeFica(entrega)}
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              setDigitos(entrega.cep);
              setTrocando(true);
            }}
          >
            Trocar CEP
          </button>
        </div>
      )}

      <p className="ent-nota" aria-live="polite">
        {buscando
          ? "Procurando o seu CEP…"
          : erro
            ? "Não achei esse CEP. Confira os números, ou mande o pedido assim mesmo, que eu calculo na conversa."
            : entrega && !comCampo && entrega.longe
              ? `Esse CEP fica fora da entrega por motoboy (${entrega.cidade}/${entrega.uf}). O envio a gente combina na conversa.`
              : entrega && !comCampo && entrega.valor === null
                ? `Acima de ${FAIXAS[FAIXAS.length - 1].ate} km o valor é combinado na conversa.`
                : null}
      </p>

      {/* a tabela inteira, à vista: o preço da entrega não é surpresa de
          ninguém, nem de quem ainda não digitou o CEP */}
      <ul className="ent-tabela" aria-label="Preço da entrega por distância">
        {FAIXAS.map((f, i) => (
          <li key={f.ate}>
            <span>{i === 0 ? `até ${f.ate} km` : `${FAIXAS[i - 1].ate} a ${f.ate} km`}</span>
            <b className="num">{brl(f.valor)}</b>
          </li>
        ))}
        <li>
          <span>acima de {FAIXAS[FAIXAS.length - 1].ate} km</span>
          <b>sob consulta</b>
        </li>
      </ul>
      <p className="ent-como">Distância em linha reta do Centro de Florianópolis, de onde o pedido sai.</p>
    </div>
  );
}
