export const MARCA = {
  nome: "Vô Juca",
  antiga: "Minassanta",
  descritor: "Cafés Especiais Artesanais",
  fundador: "José Palma Chaves",
  fundadorApelido: "Juca Chaves",
  fundadorNasc: 1887,
  fundadorFalec: 1976,
  bisneto: "João Henrique Pinto",
  bisnetoNasc: 2002,
  anosEntreOsJucas: 115,
  local: "Santa Rita do Sapucaí",
  sitio: "Sítios Dois Coqueiros e JR",
  regiao: "Sul de Minas",
  whatsapp: "5548991127997",
  whatsappVisivel: "(48) 99112-7997",
  email: "cafeminassanta@gmail.com",
  mapaLat: -22.2098652,
  mapaLng: -45.6187367,
  mapaLink:
    "https://www.google.com/maps/place/S%C3%ADtios+Dois+Coqueiros+e+JR/@-22.2100134,-45.6209657,847m/data=!3m1!1e3!4m6!3m5!1s0x94cba1004ad44a0f:0xbab140c06250648f!8m2!3d-22.2098652!4d-45.6187367!16s%2Fg%2F11n3zp72d7",
};

export function zap(mensagem: string) {
  return `https://wa.me/${MARCA.whatsapp}?text=${encodeURIComponent(mensagem)}`;
}

export type Moagem = "grao" | "moido";

export type Cafe = {
  id: string;
  nome: string;
  categoria: string;
  chamada: string;
  descricao: string;
  notas?: string[];
  fichas: { rotulo: string; valor: string }[];
  preco: { grao: number | null; moido: number };
  destaque?: boolean;
  sub?: { nome: string; chamada: string; descricao: string; fichas: string[] }[];
};

export const CAFES: Cafe[] = [
  {
    id: "jukafe",
    nome: "O Jukafé",
    categoria: "Tradicional",
    chamada: "O café do dia a dia, com origem e regularidade.",
    descricao:
      "Café tradicional do dia a dia, feito para quem preza qualidade em cada xícara. É o carro-chefe da casa — presente na rotina de quem não abre mão de um bom café, seja em casa, no escritório ou em qualquer momento do dia.",
    fichas: [
      { rotulo: "Espécie", valor: "100% arábica" },
      { rotulo: "Bebida", valor: "Dura riada 3/7" },
      { rotulo: "Peneira", valor: "14+" },
      { rotulo: "Cata", valor: "10%" },
    ],
    preco: { grao: 35.9, moido: 37.9 },
    destaque: true,
  },
  {
    id: "premium",
    nome: "Café Blend Premium",
    categoria: "Especial",
    chamada: "Equilíbrio e sofisticação para subir de nível.",
    descricao:
      "Corpo encorpado, acidez cítrica e finalização doce e longa. O rótulo certo para quem já valoriza cafés melhores sem abrir mão de um perfil amplo e agradável.",
    notas: ["Caramelo", "Chocolate", "Malte", "Rapadura"],
    fichas: [
      { rotulo: "Espécie", valor: "100% arábica" },
      { rotulo: "Classificação", valor: "Café especial" },
      { rotulo: "Pontuação", valor: "82 pontos+" },
      { rotulo: "Peneira", valor: "15+" },
      { rotulo: "Torra", valor: "Média" },
    ],
    preco: { grao: 39.9, moido: 41.9 },
  },
  {
    id: "cultivares",
    nome: "Cafés Cultivares",
    categoria: "Cultivares especiais",
    chamada: "Microlotes para quem valoriza sensorial e experiência.",
    descricao:
      "A faixa mais alta do portfólio: 84 pontos+, peneira 16+ e identidade varietal nítida. Dois cultivares colhidos na própria lavoura, indicados para presente, degustação e revenda diferenciada.",
    fichas: [
      { rotulo: "Pontuação", valor: "84 pontos+" },
      { rotulo: "Peneira", valor: "16+" },
      { rotulo: "Lote", valor: "Microlote" },
    ],
    preco: { grao: 41.5, moido: 43.5 },
    sub: [
      {
        nome: "Catucaí 24-137",
        chamada: "Delicadeza floral e notas de pêssego.",
        descricao:
          "Notas florais e aroma de frutas cítricas, sabor de frutas amarelas e pêssego em calda. Corpo encorpado, acidez cítrica e finalização longa e doce.",
        fichas: ["Frutado", "Floral", "Pêssego"],
      },
      {
        nome: "Catucaí 2SL",
        chamada: "Mel, capim-limão e personalidade marcante.",
        descricao:
          "Notas florais e aroma de mel, sabor de mel, floral e capim-limão. Corpo licoroso, acidez cítrica e finalização longa e doce.",
        fichas: ["Mel", "Capim-limão", "Licoroso"],
      },
    ],
  },
  {
    id: "primeiro-gole",
    nome: "Café Primeiro Gole",
    categoria: "Mais acessível",
    chamada: "Intenso, prático e direto ao ponto.",
    descricao:
      "Torra mais forte e sabor pronunciado, para quem prioriza intensidade, rendimento e preço. Uma alternativa superior aos tradicionais de mercado: origem controlada e seleção criteriosa, sem torra excessiva para mascarar impurezas.",
    fichas: [
      { rotulo: "Espécie", valor: "100% arábica" },
      { rotulo: "Torra", valor: "Mais forte" },
      { rotulo: "Perfil", valor: "Intenso" },
    ],
    preco: { grao: null, moido: 27.5 },
  },
];

export const ETAPAS = [
  {
    n: "01",
    nome: "Colheita",
    texto: "Grãos colhidos na própria lavoura, respeitando o tempo do fruto e a vocação da safra.",
  },
  {
    n: "02",
    nome: "Secagem",
    texto: "Conduzida no sítio, para preservar a qualidade e a estabilidade de cada lote.",
  },
  {
    n: "03",
    nome: "Seleção",
    texto: "Peneiramento e separação por perfil, do tradicional aos cafés especiais.",
  },
  {
    n: "04",
    nome: "Torra",
    texto: "Feita na propriedade e ajustada à proposta sensorial de cada linha.",
  },
  {
    n: "05",
    nome: "Moagem",
    texto: "Só na hora de embalar, para o café em pó chegar com mais frescor.",
  },
];

export const SELOS = [
  "100% arábica",
  "Quatro gerações",
  "Torra própria",
  "Atendimento direto",
];

export function brl(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function porQuilo(v: number) {
  return (v * 4).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
