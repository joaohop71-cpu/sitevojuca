/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** endereço do aplicativo do Apps Script que grava o pedido na planilha */
  readonly VITE_PEDIDOS_URL?: string;
  /** senha combinada com o script; sem ela o script recusa a gravação */
  readonly VITE_PEDIDOS_TOKEN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
