import Navegacao from "@/components/Navegacao";
import Capa from "@/components/Capa";
import Cafes from "@/components/Cafes";
import Precos from "@/components/Precos";
import Empresas from "@/components/Empresas";
import Sobre from "@/components/Sobre";
import Origem from "@/components/Origem";
import Processo from "@/components/Processo";
import Contato from "@/components/Contato";
import { useRevelar } from "@/useRevelar";

export default function App() {
  useRevelar();

  return (
    <div className="relative z-10 min-h-screen">
      {/* primeiro elemento focável da página: sem ele, quem navega por teclado
          atravessa os oito itens do menu antes de chegar no conteúdo */}
      <a href="#conteudo" className="pula-menu">
        Pular para o conteúdo
      </a>
      <Navegacao />
      <main id="conteudo">
        <Capa />
        <Cafes />
        <Precos />
        <Empresas />
        <Processo />
        <Sobre />
        <Origem />
        <Contato />
      </main>
    </div>
  );
}
