/**
 * O que cada linha da ficha técnica quer dizer.
 *
 * "84 pontos SCA", "peneira 16" e "Catucaí Amarelo" são o argumento de um café
 * especial, e quase ninguém sabe o que significam. Estas são as explicações
 * que aparecem quando a pessoa toca numa linha do rótulo.
 *
 * O texto depende do valor impresso, e não só do nome da linha: peneira 14 e
 * peneira 16 são grãos de tamanhos diferentes, 82 e 84 pontos caem em pontos
 * diferentes da escala. Quando o valor não tem explicação segura, a função diz
 * o que a linha é e não inventa o que o número significa.
 */

const mm = (peneira: number) =>
  ((peneira * 25.4) / 64).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const VARIEDADES: Record<string, string> = {
  "Catucaí Amarelo":
    "Nasceu do cruzamento do Icatu com o Catuaí, duas variedades de arábica. O “amarelo” é a cor do fruto maduro, no lugar do vermelho mais comum.",
  Arara:
    "Variedade brasileira de arábica, lançada pela Fundação Procafé. Tem fruto amarelo e resiste à ferrugem, a doença que mais castiga o cafezal.",
};

export function explicaFicha(rotulo: string, valor: string): string {
  const n = parseFloat(valor.replace(",", "."));

  switch (rotulo) {
    case "Espécie":
      return "Coffea arabica, a espécie dos cafés especiais. A outra plantada no Brasil é a canéfora — conilon e robusta —, com mais cafeína, mais amargor e menos doçura. Aqui não entra nenhum grão dela.";

    case "Seleção":
      return "Os grãos com defeito — quebrados, verdes, brocados — são separados à mão, e não só por máquina. É mais lento, e é o que deixa o gosto limpo na xícara.";

    case "Catação":
      return "Catação é a separação à mão dos grãos com defeito — quebrados, verdes, brocados — antes da torra.";

    case "Categoria":
      return "Café especial é a categoria do café que passa dos 80 pontos na prova da Specialty Coffee Association, numa escala de 0 a 100. Abaixo disso ficam o tradicional e o superior.";

    case "Pontuação SCA": {
      const escala =
        "A Specialty Coffee Association prova o café às cegas e dá uma nota de 0 a 100. A partir de 80 ele é especial: de 80 a 84,99 a escala chama de “muito bom”; de 85 em diante, de “excelente”.";
      if (!Number.isFinite(n)) return escala;
      const onde =
        n >= 85 ? `Com ${n}, este já está na faixa “excelente”.`
        : n >= 83 ? `Com ${n}, este fica no alto da primeira faixa.`
        : n >= 80 ? `Com ${n}, este entra com folga na primeira faixa.`
        : "";
      return `${escala} ${onde}`.trim();
    }

    case "Peneira":
      return Number.isFinite(n)
        ? `A peneira classifica o grão pelo tamanho, em 64 avos de polegada: a ${n} segura o grão que não passa num furo de ${mm(n)} mm, e o “+” quer dizer desse tamanho para cima. Grão parelho torra por igual, sem uns queimando enquanto outros ainda estão crus.`
        : "A peneira classifica o grão pelo tamanho. Grão parelho torra por igual, sem uns queimando enquanto outros ainda estão crus.";

    case "Variedade":
      return VARIEDADES[valor] ?? "A variedade é a planta de onde vem o café, dentro da espécie arábica — como a uva, no vinho.";

    case "Torra":
      return valor.toLowerCase().startsWith("média")
        ? "O ponto em que o grão já desenvolveu doçura e corpo, mas ainda guarda a acidez e as notas da origem. Torra mais clara puxa a acidez; mais escura, o amargor e o corpo."
        : "O ponto até onde o grão foi torrado. Torra mais clara puxa a acidez; mais escura, o amargor e o corpo.";

    case "Altitude":
      return "Quanto mais alto, mais fria a noite e mais devagar o fruto amadurece. Fruto que demora junta açúcar: é de onde vem a doçura que se sente antes de qualquer outra nota.";

    default:
      return "";
  }
}
