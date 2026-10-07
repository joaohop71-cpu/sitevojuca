// Renderiza um HTML local numa página só de PDF, com o motor do Safari, e
// garante que cada <a data-link> vire um link clicável no PDF.
import AppKit
import WebKit
import PDFKit

let args = CommandLine.arguments
let entrada = URL(fileURLWithPath: args[1])
let saida = URL(fileURLWithPath: args[2])
let largura: CGFloat = 430

class Dono: NSObject, WKNavigationDelegate {
  let web: WKWebView
  override init() {
    web = WKWebView(frame: NSRect(x: 0, y: 0, width: largura, height: 1200))
    super.init()
    web.navigationDelegate = self
  }
  func webView(_ w: WKWebView, didFinish n: WKNavigation!) {
    // espera as fontes e as imagens, e mede a página e os botões
    let js = """
    await document.fonts.ready;
    await Promise.all([...document.images].map(i => i.complete ? 0 : new Promise(r => { i.onload = i.onerror = r; })));
    const links = [...document.querySelectorAll('a[data-link]')].map(a => { const r = a.getBoundingClientRect(); return [r.left, r.top + scrollY, r.width, r.height, a.href]; });
    return JSON.stringify({ h: Math.ceil(document.documentElement.scrollHeight), links });
    """
    w.callAsyncJavaScript(js, arguments: [:], in: nil, in: .page) { res in
      guard case .success(let v) = res, let s = v as? String,
            let d = try? JSONSerialization.jsonObject(with: Data(s.utf8)) as? [String: Any],
            let h = d["h"] as? Double, let links = d["links"] as? [[Any]] else { print("falhou a medida", res); exit(1) }
      w.frame = NSRect(x: 0, y: 0, width: largura, height: CGFloat(h))
      DispatchQueue.main.asyncAfter(deadline: .now() + 0.6) {
        let cfg = WKPDFConfiguration()
        cfg.rect = CGRect(x: 0, y: 0, width: largura, height: CGFloat(h))
        w.createPDF(configuration: cfg) { r in
          guard case .success(let dados) = r, let doc = PDFDocument(data: dados), let pag = doc.page(at: 0) else { print("falhou o pdf"); exit(1) }
          let caixa = pag.bounds(for: .mediaBox)
          let jaTinha = pag.annotations.filter { $0.url != nil }.count
          if jaTinha < links.count {
            for l in links {
              let x = CGFloat(l[0] as! Double), y = CGFloat(l[1] as! Double), lw = CGFloat(l[2] as! Double), lh = CGFloat(l[3] as! Double)
              let esc = caixa.width / largura
              let ret = CGRect(x: x * esc, y: caixa.height - (y + lh) * esc, width: lw * esc, height: lh * esc)
              let a = PDFAnnotation(bounds: ret, forType: .link, withProperties: nil)
              a.url = URL(string: l[4] as! String)
              a.border = PDFBorder(); a.border?.lineWidth = 0
              pag.addAnnotation(a)
            }
          }
          doc.documentAttributes = [PDFDocumentAttribute.titleAttribute: "Catálogo Vô Juca", PDFDocumentAttribute.authorAttribute: "Vô Juca · Cafés especiais artesanais"]
          doc.write(to: saida)
          print("ok", Int(caixa.width), "x", Int(caixa.height), "links do webkit:", jaTinha, "total:", PDFDocument(url: saida)!.page(at: 0)!.annotations.filter { $0.url != nil }.count)
          exit(0)
        }
      }
    }
  }
}

let app = NSApplication.shared
let dono = Dono()
dono.web.loadFileURL(entrada, allowingReadAccessTo: entrada.deletingLastPathComponent())
DispatchQueue.main.asyncAfter(deadline: .now() + 40) { print("tempo esgotado"); exit(2) }
app.run()
