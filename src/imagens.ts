/*
 * As imagens entram como arquivos de verdade, não como data URI.
 *
 * Antes elas vinham embutidas em base64 dentro deste módulo: 2,8 MB de foto
 * viravam 3,9 MB de texto dentro do JavaScript, e o navegador tinha de baixar
 * e interpretar tudo isso antes de desenhar a primeira letra da página.
 *
 * Importadas assim, o Vite emite cada uma como arquivo próprio, com hash no
 * nome. O navegador baixa em paralelo, guarda em cache entre visitas, e as
 * que estão fora da tela só chegam quando o leitor rola até elas.
 */

export { default as selo } from "@/assets/selo.png";
export { default as logoSecundaria } from "@/assets/logo-secundaria.png";

/* a lavoura hoje */
export { default as jucaLavoura } from "@/assets/juca-lavoura.jpg";
export { default as cerejas } from "@/assets/cerejas.jpg";
export { default as talhoes } from "@/assets/talhoes.jpg";
export { default as montanhas } from "@/assets/montanhas.jpg";
export { default as poente } from "@/assets/poente.jpg";
export { default as cerejasSerra } from "@/assets/cerejas-serra.jpg";
export { default as cerejaGota } from "@/assets/cereja-gota.jpg";
export { default as linhasCafezal } from "@/assets/linhas-cafezal.jpg";

/* o arquivo do bisavô */
export { default as jucaEstudio } from "@/assets/juca-estudio.jpg";
export { default as jucaLinho } from "@/assets/juca-linho.jpg";
export { default as jucaCavalo } from "@/assets/juca-cavalo.jpg";
export { default as jucaRetratoSelo } from "@/assets/juca-retrato-selo.jpg";
