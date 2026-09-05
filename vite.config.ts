import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";

/*
 * A foto da capa é o maior elemento visível ao abrir o site — é ela que define
 * a nota de LCP no celular. Como está dentro do React, o navegador só descobre
 * que precisa dela depois de baixar e executar o JavaScript.
 *
 * O nome do arquivo leva um hash que só existe depois do build, então não dá
 * para escrevê-lo à mão no index.html. Este plugin pega o nome final no fim do
 * build e insere o <link rel="preload">, para o download começar junto com o
 * HTML em vez de esperar o JavaScript.
 */
function preloadCapa(): Plugin {
  return {
    name: "preload-capa",
    enforce: "post",
    apply: "build",
    transformIndexHtml: {
      order: "post",
      handler(html, ctx) {
        const arquivo = Object.keys(ctx.bundle ?? {}).find((n) =>
          /capa-terra.*\.webp$/.test(n)
        );
        if (!arquivo) return html;
        const tag = `<link rel="preload" as="image" href="/${arquivo}" type="image/webp" fetchpriority="high" />`;
        return html.replace("</head>", `    ${tag}\n  </head>`);
      },
    },
  };
}

export default defineConfig({
  plugins: [react(), preloadCapa()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
});
