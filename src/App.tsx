import Navegacao from "@/components/Navegacao";
import Capa from "@/components/Capa";
import Cafes from "@/components/Cafes";
import Precos from "@/components/Precos";
import Sobre from "@/components/Sobre";
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
        <Precos />
        <Sobre />
        <Origem />
        <Processo />
        <Contato />
      </main>
    </div>
  );
}
