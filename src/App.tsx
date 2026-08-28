import Navegacao from "@/components/Navegacao";
import Capa from "@/components/Capa";
import Cafes from "@/components/Cafes";
import Sobre from "@/components/Sobre";
import Precos from "@/components/Precos";
import Origem from "@/components/Origem";
import Processo from "@/components/Processo";
import Galeria from "@/components/Galeria";
import Contato from "@/components/Contato";

export default function App() {
  return (
    <div className="relative z-10 min-h-screen">
      <Navegacao />
      <main>
        <Capa />
        <Cafes />
        <Sobre />
        <Precos />
        <Origem />
        <Processo />
        <Galeria />
        <Contato />
      </main>
    </div>
  );
}
