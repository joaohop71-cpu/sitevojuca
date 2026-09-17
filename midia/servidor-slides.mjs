/* Servidor efemero para montar os slides do carrossel: serve as fotos e os
   rotulos do projeto, entrega a pagina que desenha, e recebe os PNG de volta. */
import http from "http"; import fs from "fs"; import path from "path";
const PROJ = process.argv[2], SAIDA = process.argv[3];
fs.mkdirSync(SAIDA, { recursive: true });
const PAGINA = fs.readFileSync(path.join(process.argv[4], "slides.html"), "utf8");

http.createServer((q, r) => {
  const u = decodeURIComponent(q.url.split("?")[0]);
  if (u === "/") { r.setHeader("content-type", "text/html; charset=utf-8"); r.end(PAGINA); return; }
  if (u.startsWith("/foto/")) {
    const p = path.join(PROJ, "src/assets", path.basename(u));
    if (!fs.existsSync(p)) { r.statusCode = 404; r.end(); return; }
    const tipo = u.endsWith(".webp") ? "image/webp" : u.endsWith(".png") ? "image/png" : "image/jpeg";
    r.setHeader("content-type", tipo);
    r.end(fs.readFileSync(p)); return;
  }
  if (u.startsWith("/rotulo/")) {
    const p = path.join(PROJ, "public/rotulos", path.basename(u));
    if (!fs.existsSync(p)) { r.statusCode = 404; r.end(); return; }
    r.setHeader("content-type", "image/webp"); r.end(fs.readFileSync(p)); return;
  }
  if (u.startsWith("/salvar/")) {
    const partes = []; q.on("data", d => partes.push(d));
    q.on("end", () => {
      const a = path.join(SAIDA, path.basename(u));
      fs.writeFileSync(a, Buffer.concat(partes));
      console.log(path.basename(a), (fs.statSync(a).size / 1024).toFixed(0) + " KB");
      r.end("ok");
    });
    return;
  }
  r.statusCode = 404; r.end();
}).listen(8790, () => console.log("8790"));
