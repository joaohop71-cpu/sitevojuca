import Navegacao from "@/components/Navegacao";
import Capa from "@/components/Capa";
import Cafes from "@/components/Cafes";
import Sobre from "@/components/Sobre";
import Arquivo from "@/components/Arquivo";
import Precos from "@/components/Precos";
import Origem from "@/components/Origem";
import Processo from "@/components/Processo";
import Contato from "@/components/Contato";
import { useRevelar } from "@/useRevelar";

export default function App() {
  useRevelar();

  return (
    <div className="relative z-10 min-h-screen">
      <Navegacao />
      <main>
        <Capa />
        <Cafes />
        <Sobre />
        <Arquivo />
        <Precos />
        <Origem />
        <Processo />
        <Contato />
      </main>
    </div>
  );
}
