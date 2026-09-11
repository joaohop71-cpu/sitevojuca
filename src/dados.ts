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
  email: "cafevojuca@gmail.com",
  mapaLat: -22.2098652,
  mapaLng: -45.6187367,
  mapaLink:
    "https://www.google.com/maps/place/S%C3%ADtios+Dois+Coqueiros+e+JR/@-22.2100134,-45.6209657,847m/data=!3m1!1e3!4m6!3m5!1s0x94cba1004ad44a0f:0xbab140c06250648f!8m2!3d-22.2098652!4d-45.6187367!16s%2Fg%2F11n3zp72d7",
  safra: "2025 / 2026",
};

export function zap(mensagem: string) {
  return `https://wa.me/${MARCA.whatsapp}?text=${encodeURIComponent(mensagem)}`;
}

export type Moagem = "grao" | "moido";

/** Cor da tinta do rótulo — uma por linha de café. */
export type CorRotulo = "vinho" | "verde" | "tinta";

export type Cafe = {
  id: string;
  nome: string;
  /**
   * Nome-base do rótulo em /public/banners — o site monta a partir dele os
   * quatro arquivos: `banner_<base>_{1x,2x}.{webp,png}`.
   * Sem isto, o rótulo é desenhado em CSS a partir dos campos abaixo.
   */
  banner: string;
  /** cultivar impresso sob o nome, quando a linha tem mais de um lote */
  lote?: string;
  /** tarja do canto superior direito do rótulo */
  tarja: string;
  /** linhas de qualificação acima do nome */
  qualificacao: string[];
  /** frase em itálico sob o nome */
  chamada: string;
  notas: string[];
  fichas: { rotulo: string; valor: string }[];
  /** 1 a 5 */
  intensidade: number;
  gramas: number;
  /** como o café é entregue, impresso no pé do rótulo */
  formato: string;
  cor: CorRotulo;
  descricao: string;
  preco: { grao: number | null; moido: number };
};

export const CAFES: Cafe[] = [
  {
    id: "cafe-vo-juca",
    nome: "Café Vô Juca",
    banner: "vojuca",
    tarja: "Seleção especial",
    qualificacao: ["Café especial · 100% arábica", "Torra e colheita artesanal"],
    chamada: "Da nossa lavoura, o sabor suave de sempre",
    notas: ["Frutado", "Doce", "Floral"],
    fichas: [
      { rotulo: "Tipo", valor: "100% arábica" },
      { rotulo: "Seleção", valor: "Manual" },
      { rotulo: "Pontuação SCA", valor: "82 pontos +" },
      { rotulo: "Peneira", valor: "16 +" },
      { rotulo: "Variedade", valor: "Arara" },
      { rotulo: "Altitude", valor: "998 m" },
    ],
    intensidade: 3,
    gramas: 300,
    formato: "Torrado em grãos",
    cor: "verde",
    descricao:
      "Perfil suave, doce e floral. O rótulo de quem já presta atenção no que vai na xícara, sem abrir mão de um café fácil de gostar.",
    preco: { grao: 43.08, moido: 45.48 },
  },
  {
    id: "herancas-2sl",
    nome: "Heranças",
    lote: "2 SL",
    banner: "herancas_2sl",
    tarja: "Coleção limitada",
    qualificacao: ["Café especial · Microlote", "100% arábica · Colheita manual"],
    chamada: "Coleção limitada de uma experiência sensorial única",
    notas: ["Mel", "Floral", "Capim-limão"],
    fichas: [
      { rotulo: "Tipo", valor: "100% arábica" },
      { rotulo: "Seleção", valor: "Manual" },
      { rotulo: "Pontuação SCA", valor: "84 pontos +" },
      { rotulo: "Peneira", valor: "16 +" },
      { rotulo: "Variedade", valor: "Catucaí Amarelo" },
      { rotulo: "Altitude", valor: "998 m" },
    ],
    intensidade: 3,
    gramas: 300,
    formato: "Torrado em grãos",
    cor: "vinho",
    descricao:
      "Notas florais e aroma de mel, com sabor de mel e capim-limão. Corpo licoroso, acidez cítrica e finalização longa e doce. Microlote de Catucaí 2SL colhido à mão.",
    preco: { grao: 49.8, moido: 52.2 },
  },
  {
    id: "herancas-24-137",
    nome: "Heranças",
    lote: "24 / 137",
    banner: "herancas_24137",
    tarja: "Coleção limitada",
    qualificacao: ["Café especial · Microlote", "100% arábica · Colheita manual"],
    chamada: "Coleção limitada de uma experiência sensorial única",
    notas: ["Floral", "Frutas amarelas", "Pêssego em calda"],
    fichas: [
      { rotulo: "Tipo", valor: "100% arábica" },
      { rotulo: "Seleção", valor: "Manual" },
      { rotulo: "Pontuação SCA", valor: "84 pontos +" },
      { rotulo: "Peneira", valor: "16 +" },
      { rotulo: "Variedade", valor: "Catucaí Amarelo" },
      { rotulo: "Altitude", valor: "998 m" },
    ],
    intensidade: 3,
    gramas: 300,
    formato: "Torrado em grãos",
    cor: "vinho",
    descricao:
      "Notas florais e aroma de frutas cítricas, com sabor de frutas amarelas e pêssego em calda. Corpo encorpado, acidez cítrica e finalização longa e doce. Microlote de Catucaí 24-137.",
    preco: { grao: 49.8, moido: 52.2 },
  },
  {
    id: "minas-santa",
    nome: "Minas Santa",
    banner: "minassanta",
    tarja: "Para o dia a dia",
    qualificacao: ["Café superior · Blend 100% arábica", "Torra e colheita artesanal"],
    chamada: "Corpo e presença para o seu dia a dia",
    notas: ["Encorpado", "Sabor marcante", "Tradicional"],
    fichas: [
      { rotulo: "Tipo", valor: "Blend 100% arábica" },
      { rotulo: "Peneira", valor: "14 +" },
      { rotulo: "Catação", valor: "10 %" },
      { rotulo: "Torra", valor: "Média" },
      { rotulo: "Variedade", valor: "Arara" },
      { rotulo: "Altitude", valor: "998 m" },
    ],
    intensidade: 4,
    gramas: 500,
    formato: "Torrado e moído · moagem fina",
    cor: "tinta",
    descricao:
      "O café da rotina, feito para quem preza qualidade em cada xícara. É o carro-chefe da casa, presente no dia de quem não abre mão de um bom café, em casa, no escritório ou a qualquer hora.",
    preco: { grao: null, moido: 55.0 },
  },
];

/**
 * A história em três capítulos: como a ideia nasceu, de onde vem o apelido e
 * como a empresa funciona hoje. Quem ler só as três frases grandes sai com a
 * história inteira; o resto é para quem quiser.
 */
export const MARCOS = [
  { ano: "1887", titulo: "Nasce o Juca", texto: "Em Santa Rita do Sapucaí." },
  { ano: "Início do séc. XX", titulo: "Planta café", texto: "Junta terra no Sul de Minas." },
  { ano: "1976", titulo: "Morre aos 88", texto: "O café fica. O apelido some." },
  { ano: "2002", titulo: "Nasce o bisneto", texto: "Cento e quinze anos depois." },
  { ano: "Hoje", titulo: "O apelido volta", texto: "Pelos amigos, por acaso." },
];

/** quem faz o quê, hoje */
export const DUPLA = [
  {
    nome: "Fernandinho",
    foto: "fernandinho",
    papel: "Do pé à torra",
    texto:
      "Cuida da lavoura, conduz a colheita, a secagem e a torra, e assina a classificação: é classificador e degustador de café com certificado. O que chega na sua xícara passou pela mesa dele.",
  },
  {
    nome: "João Henrique",
    foto: "joaoHenrique",
    papel: "Daqui para fora",
    texto:
      "Respondo o WhatsApp, escrevo o site, cuido das vendas e das redes. Se você mandar mensagem, quem lê sou eu.",
  },
];

export const ETAPAS = [
  {
    n: "01",
    nome: "Colheita",
    chamada: "Na mão, pé por pé",
    texto:
      "A colheita é manual, sem máquina. Alguém olha cada fruto antes de tirar, e só sai o que está no ponto. É mais lento de propósito: quem manda no calendário é a maturação do talhão, não o contrário.",
    resumo: "Sem colheitadeira. Só mão e olho.",
  },
  {
    n: "02",
    nome: "Secagem",
    chamada: "No terreiro, ao sol",
    texto:
      "Do pé, o café vai direto para o terreiro. Espalhado fino e revirado ao longo do dia, perde umidade devagar e por igual. Secar rápido demais estraga; secar torto deixa metade do lote fora do padrão.",
    resumo: "É aqui que o lote ganha ou perde o padrão.",
  },
  {
    n: "03",
    nome: "Seleção",
    chamada: "Peneira, prova e nota",
    texto:
      "Esta é a etapa que separa café de café especial. Primeiro a peneira, que classifica o grão por tamanho. Depois a prova: o café é torrado em amostra, moído e provado na mesa, gole a gole, para receber nota e perfil. É daí que sai o que vira Heranças e o que vira Minas Santa.",
    resumo: "Quem prova é classificador e degustador com certificado.",
  },
  {
    n: "04",
    nome: "Torra",
    chamada: "Na máquina do bisavô",
    texto:
      "Feita à mão, em máquinas do século passado, das mesmas que rodavam no tempo do Juca. Sem programa automático: alguém acompanha, escuta e decide a hora de tirar. O padrão da casa é a torra média, que é onde este café abre mais aroma sem perder o corpo.",
    resumo: "Ponto escolhido no olho e no ouvido, não no botão.",
  },
  {
    n: "05",
    nome: "Moagem",
    chamada: "Só na hora de enviar",
    texto:
      "O café só é moído quando o seu pedido está saindo. Grão moído perde aroma em dias, então não faz sentido moer antes e deixar parado na prateleira.",
    resumo: "É por isso que o pó chega mais fresco.",
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

/** Preço por quilo — os pacotes têm pesos diferentes, então o peso entra na conta. */
export function porQuilo(preco: number, gramas: number) {
  return ((preco * 1000) / gramas).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}
