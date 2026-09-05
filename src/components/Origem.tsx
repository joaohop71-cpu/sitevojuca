import { Faixa, Rubrica } from "./base";
import { MARCA } from "@/dados";

export default function Origem() {
  return (
    <Faixa id="origem" className="py-16 sm:py-24">
      <Rubrica num="04">A terra</Rubrica>

      <h2 className="reveal mt-6 max-w-[22ch] text-[clamp(30px,4.4vw,52px)]">
        Por que a origem muda o que vai na xícara
      </h2>

      <div className="mt-6 grid gap-x-16 lg:grid-cols-2">
        <p className="text-[17px] text-[#5c4635]">
          Os {MARCA.sitio} estão na família desde que meu bisavô plantou os primeiros pés
          de café ali, no início do século 20, em {MARCA.local}. O café é produzido,
          beneficiado, torrado e moído na mesma propriedade; cada etapa acontece sob o
          olhar de quem planta.
        </p>
        <p className="text-[17px] text-[#5c4635]">
          Esse controle aparece de duas formas. Na xícara, como frescor e constância de
          um lote para o outro. E no atendimento, que é feito direto comigo, sem ninguém
          no meio do caminho.
        </p>
      </div>

      <blockquote className="reveal mt-12 border-y border-[rgba(58,39,27,0.25)] py-8">
        <p
          className="max-w-[30ch] text-[clamp(24px,3.4vw,40px)] leading-tight text-[#6b4526]"
          style={{ fontFamily: "Fraunces, Georgia, serif", fontStyle: "italic", fontWeight: 400 }}
        >
          “Café de origem, feito por quem vive a lavoura.”
        </p>
      </blockquote>

      <dl className="reveal mt-10 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
        {[
          { n: "4", r: "gerações na mesma terra" },
          { n: "115", r: "anos entre os dois Jucas" },
          { n: "998", r: "metros acima do mar" },
          { n: "100%", r: "arábica" },
          { n: "5", r: "etapas dentro do sítio" },
        ].map((d) => (
          <div key={d.r} className="border-t-2 border-[#3a271b] pt-4">
            <dt
              className="num text-[clamp(30px,3.8vw,44px)] leading-none text-[#8c3a20]"
              style={{
                fontFamily: "Fraunces, Georgia, serif",
                fontVariationSettings: '"SOFT" 15, "WONK" 1, "opsz" 48',
                fontWeight: 600,
              }}
            >
              {d.n}
            </dt>
            <dd className="ficha mt-2.5 text-[13px] leading-snug text-[#6b4526]">{d.r}</dd>
          </div>
        ))}
      </dl>
    </Faixa>
  );
}
