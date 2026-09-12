import { Faixa, Rubrica } from "./base";
import { MARCA } from "@/dados";

export default function Origem() {
  return (
    <Faixa id="origem" className="py-12 sm:py-16">
      <Rubrica num="05">A terra</Rubrica>

      <h2 className="reveal mt-6 max-w-[22ch] text-[clamp(30px,4.4vw,52px)]">
        Por que a origem muda o que vai na xícara
      </h2>

      <div className="mt-6 grid gap-x-16 gap-y-4 lg:grid-cols-2">
        <p className="text-[17px] text-[#5c4635]">
          Os {MARCA.sitio} ficam a 998 metros, na serra de {MARCA.local}. Altitude assim
          faz o fruto amadurecer devagar, e fruto que demora é fruto que junta açúcar. É
          de onde vem a doçura que você sente antes de sentir qualquer outra coisa.
        </p>
        <p className="text-[17px] text-[#5c4635]">
          O resto é a variedade e o ano. Arara nos lotes de mesa, Catucaí amarelo nos
          microlotes, e uma safra que nunca repete a anterior. Por isso cada Heranças sai
          com o número do lote impresso: aquele café existiu uma vez só.
        </p>
      </div>

      <dl className="reveal mt-12 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
        {[
          { n: "4", r: "gerações no café" },
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
            <dd className="ficha mt-2.5 text-[14.5px] leading-snug text-[#6b4526]">{d.r}</dd>
          </div>
        ))}
      </dl>
    </Faixa>
  );
}
