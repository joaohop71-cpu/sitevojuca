import { useSyncExternalStore } from "react";

/**
 * A entrega por motoboy, calculada pelo CEP.
 *
 * Todo pedido sai do mesmo ponto, no Centro de Florianópolis, e o preço é por
 * raio: a distância em linha reta até o endereço, não o caminho que a moto
 * faz. Isso é de propósito, porque é assim que a tabela foi pensada, e porque
 * a linha reta se calcula aqui mesmo, sem depender de um serviço de rotas.
 *
 * O CEP vira coordenada em até três tentativas, todas gratuitas e abertas a
 * chamadas do navegador: a AwesomeAPI, que já devolve latitude e longitude; o
 * ViaCEP, que devolve só o bairro e a cidade, quando a primeira não conhece o
 * CEP; e o OpenStreetMap, que acha o bairro no mapa quando falta a coordenada.
 * Se nenhuma responder, o pedido segue sem o frete, e ele é combinado na
 * conversa, como era antes.
 */

/** Av. Prefeito Osmar Cunha, 525, Centro: de onde todo pedido sai */
const ORIGEM = { lat: -27.590925, lng: -48.5520883 };

/** até quantos km (inclusive) vale cada preço; acima do último, sob consulta */
export const FAIXAS = [
  { ate: 2.5, valor: 5 },
  { ate: 5, valor: 8 },
  { ate: 8, valor: 12 },
  { ate: 12, valor: 17 },
  { ate: 15, valor: 23 },
  { ate: 20, valor: 29 },
];

/** acima disto não é mais a Grande Florianópolis, e o motoboy não vai */
const LONGE_KM = 40;

export type Entrega = {
  cep: string;
  bairro: string;
  cidade: string;
  uf: string;
  km: number;
  /** null: sob consulta, acima de 12 km */
  valor: number | null;
  /** fora da região do motoboy: o envio é outro, combinado na conversa */
  longe: boolean;
};

export const valorDoRaio = (km: number) => FAIXAS.find((f) => km <= f.ate)?.valor ?? null;

export const cepComTraco = (cep: string) => `${cep.slice(0, 5)}-${cep.slice(5)}`;

function distanciaKm(lat: number, lng: number) {
  const r = (g: number) => (g * Math.PI) / 180;
  const h =
    Math.sin(r(lat - ORIGEM.lat) / 2) ** 2 +
    Math.cos(r(ORIGEM.lat)) * Math.cos(r(lat)) * Math.sin(r(lng - ORIGEM.lng) / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
}

/* uma consulta que desiste sozinha: no 4G fraco, esperar para sempre é pior
   do que passar para a próxima tentativa */
async function consulta(url: string): Promise<Record<string, unknown> | null> {
  const parar = new AbortController();
  const prazo = setTimeout(() => parar.abort(), 6000);
  try {
    const r = await fetch(url, { signal: parar.signal });
    return r.ok ? ((await r.json()) as Record<string, unknown>) : null;
  } catch {
    return null;
  } finally {
    clearTimeout(prazo);
  }
}

const numero = (v: unknown) => {
  const n = typeof v === "string" || typeof v === "number" ? Number(v) : NaN;
  return Number.isFinite(n) && n !== 0 ? n : null;
};
const texto = (v: unknown) => (typeof v === "string" ? v : "");

/** devolve a entrega calculada, ou null quando o CEP não foi encontrado */
export async function calcularEntrega(cep: string): Promise<Entrega | null> {
  let lugar: { bairro: string; cidade: string; uf: string } | null = null;
  let lat: number | null = null;
  let lng: number | null = null;

  const a = await consulta(`https://cep.awesomeapi.com.br/json/${cep}`);
  if (a && texto(a.city)) {
    lugar = { bairro: texto(a.district), cidade: texto(a.city), uf: texto(a.state) };
    lat = numero(a.lat);
    lng = numero(a.lng);
  }
  if (!lugar) {
    const v = await consulta(`https://viacep.com.br/ws/${cep}/json/`);
    if (v && !v.erro && texto(v.localidade))
      lugar = { bairro: texto(v.bairro), cidade: texto(v.localidade), uf: texto(v.uf) };
  }
  if (!lugar) return null;
  if (lat === null || lng === null) {
    /* sem coordenada do CEP: o centro do bairro, ou da cidade, serve, que a
       tabela é de faixas de quilômetros e não de metros */
    const q = [lugar.bairro, lugar.cidade, lugar.uf, "Brasil"].filter(Boolean).join(", ");
    const n = await consulta(
      `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=br&q=${encodeURIComponent(q)}`
    );
    const achado = Array.isArray(n) ? (n[0] as Record<string, unknown> | undefined) : undefined;
    lat = numero(achado?.lat);
    lng = numero(achado?.lon);
  }
  if (lat === null || lng === null) return null;

  const km = Math.round(distanciaKm(lat, lng) * 10) / 10;
  return { cep, ...lugar, km, valor: valorDoRaio(km), longe: km > LONGE_KM || lugar.uf !== "SC" };
}

/**
 * O CEP calculado fica guardado no navegador, como o carrinho: quem volta
 * amanhã para pedir de novo não precisa digitar de novo. O preço não é
 * guardado, só a distância: se a tabela mudar, vale a tabela nova.
 */
const CHAVE = "vojuca:entrega";
const VALIDADE = 30 * 24 * 60 * 60 * 1000;

function ler(): Entrega | null {
  try {
    const cru = localStorage.getItem(CHAVE);
    if (!cru) return null;
    const g = JSON.parse(cru) as Omit<Entrega, "valor"> & { salvoEm: string };
    if (Date.now() - new Date(g.salvoEm).getTime() > VALIDADE || !/^\d{8}$/.test(g.cep) || !Number.isFinite(g.km)) {
      localStorage.removeItem(CHAVE);
      return null;
    }
    return { cep: g.cep, bairro: g.bairro, cidade: g.cidade, uf: g.uf, km: g.km, valor: valorDoRaio(g.km), longe: !!g.longe };
  } catch {
    return null;
  }
}

let estado: Entrega | null = ler();
const ouvintes = new Set<() => void>();

export function guardarEntrega(e: Entrega | null) {
  estado = e;
  try {
    if (!e) localStorage.removeItem(CHAVE);
    else {
      const { cep, bairro, cidade, uf, km, longe } = e;
      localStorage.setItem(CHAVE, JSON.stringify({ cep, bairro, cidade, uf, km, longe, salvoEm: new Date().toISOString() }));
    }
  } catch {
    /* sem permissão para guardar: vale só nesta visita */
  }
  ouvintes.forEach((f) => f());
}

export function useEntrega() {
  return useSyncExternalStore(
    (f) => {
      ouvintes.add(f);
      return () => ouvintes.delete(f);
    },
    () => estado,
    () => estado
  );
}

/** "Trindade, Florianópolis · 2,8 km" */
export const ondeFica = (e: Entrega) =>
  `${[e.bairro, e.cidade].filter(Boolean).join(", ")} · ${e.km.toLocaleString("pt-BR")} km`;
