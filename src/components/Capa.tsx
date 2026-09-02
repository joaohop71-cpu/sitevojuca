import { logoSecundaria } from "@/imagens";
import { Botao, Grao, Ornamento } from "./base";
import { MARCA, SELOS, zap } from "@/dados";

export default function Capa() {
  return (
    <header id="topo" className="relative">
      <div className="mx-auto w-[min(100%-2rem,1120px)] pb-14 pt-10 sm:w-[min(100%-2.5rem,1120px)] sm:pb-20 sm:pt-16">
        <img
          src={logoSecundaria}
          alt={MARCA.nome}
          className="mx-auto w-[clamp(150px,40vw,189px)]"
        />

        <p className="eyebrow mt-5 text-center leading-relaxed">
          <Grao size={12} />
          <span className="ml-2.5">
            {MARCA.descritor} · {MARCA.regiao}
          </span>
        </p>

        <div className="mt-9 grid gap-x-16 gap-y-8 lg:grid-cols-[1.15fr_0.85fr]">
          <h1 className="text-[clamp(34px,5.6vw,62px)]">
            A mesma lavoura, o mesmo apelido, quatro gerações depois
          </h1>

          <div className="lg:pt-2">
            <p className="max-w-[46ch] text-[17px] text-[#5c4635]">
              Café plantado, colhido, seco, torrado e moído nos{" "}
              <strong className="font-semibold text-[#3a271b]">{MARCA.sitio}</strong>, em{" "}
              {MARCA.local}, onde meu bisavô plantou os primeiros pés no início do século 20.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap" data-print-hide>
              <Botao href={zap("Olá! Quero conhecer os cafés do Vô Juca.")} largo>
                Pedir pelo WhatsApp
              </Botao>
              <Botao href="#cafes" tom="vazio" largo>
                Ver os cafés
              </Botao>
            </div>
          </div>
        </div>

        <dl className="mt-14 grid grid-cols-2 gap-x-8 gap-y-4 border-t border-[rgba(58,39,27,0.2)] pt-6 sm:grid-cols-4">
          {SELOS.map((s) => (
            <div key={s} className="flex items-start gap-2.5">
              <span className="mt-[9px] inline-block h-px w-4 shrink-0 bg-[#8c3a20]" />
              <dt className="ficha leading-snug text-[#6b4526]">{s}</dt>
            </div>
          ))}
        </dl>

        <div className="mt-14 sm:mt-16">
          <Ornamento />
        </div>
      </div>
    </header>
  );
}
