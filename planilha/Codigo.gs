/**
 * Vô Juca — a ponte entre o site e a planilha de controle.
 *
 * O pedido nasce no site e termina numa conversa de WhatsApp. Este script
 * existe para que ele não precise ser digitado uma terceira vez: o site grava
 * o que foi escolhido numa aba de espera, e o pedido só entra no faturamento
 * quando você disser que fechou.
 *
 * Três coisas que ele faz:
 *
 *   doPost    recebe o pedido do site e escreve na aba Pedidos, como aguardando
 *   onEdit    quando você marca Confirmado, copia as linhas para Vendas
 *   doGet     serve um formulário de lançamento rápido, para o pedido que
 *             chegou direto no seu WhatsApp e nunca passou pelo site
 *
 * A senha é a mesma string que está no arquivo .env do site. Ela não é
 * segredo de verdade — quem abrir o código-fonte da página a encontra — e não
 * pretende ser: serve para que um robô que varre endereços não consiga sujar
 * a planilha por acaso. O que protege de fato é o script só saber acrescentar
 * linha na aba de espera, e nunca apagar nem alterar nada.
 */

const SENHA = 'TROQUE-ESTA-SENHA';

const ABA_PEDIDOS = 'Pedidos';
const ABA_VENDAS = 'Vendas';
const ABA_PRODUTOS = 'Produtos';

/* a primeira linha de dados das abas que já existem na planilha */
const PRIMEIRA_LINHA = 5;

const COL = { codigo: 1, quando: 2, status: 3, cliente: 4, item: 5, gramas: 6,
              desconto: 7, valor: 8, origem: 9, obs: 10 };

const STATUS = ['Aguardando', 'Confirmado', 'Lançado', 'Perdido'];


/* ────────────────────────────────  o site escreve aqui  ──────────────────── */

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    /* dois cliques seguidos, ou dois clientes ao mesmo tempo, escreveriam na
       mesma linha e um apagaria o outro */
    lock.waitLock(20000);

    var d = JSON.parse(e.postData.contents);
    if (String(d.senha || '') !== SENHA) return resposta({ ok: false, erro: 'senha' });
    if (!d.itens || !d.itens.length) return resposta({ ok: false, erro: 'vazio' });

    var aba = garantirPedidos();
    var quando = d.quando ? new Date(d.quando) : new Date();
    var desconto = Number(d.promo) || 0;
    var linhas = d.itens.map(function (i) {
      var tabela = (Number(i.tabela) || 0) / 100;      /* centavos → reais */
      var gramas = Number(i.gramas) || 0;
      var linha = [];
      linha[COL.codigo - 1] = d.codigo || '';
      linha[COL.quando - 1] = quando;
      linha[COL.status - 1] = 'Aguardando';
      linha[COL.cliente - 1] = '';
      linha[COL.item - 1] = i.item || '';
      linha[COL.gramas - 1] = gramas;
      linha[COL.desconto - 1] = desconto;
      /* o pacote inteiro já com o desconto, que é o número que apareceu na
         tela do cliente; a planilha vai recalcular pelo preço por quilo */
      linha[COL.valor - 1] = (tabela * (Number(i.qtd) || 0)) * (1 - desconto);
      linha[COL.origem - 1] = d.origem || 'site';
      linha[COL.obs - 1] = conhecido(i.item) ? '' : 'Item não existe na aba Produtos';
      return linha;
    });

    aba.getRange(aba.getLastRow() + 1, 1, linhas.length, 10).setValues(linhas);
    return resposta({ ok: true, codigo: d.codigo, linhas: linhas.length });

  } catch (erro) {
    return resposta({ ok: false, erro: String(erro) });
  } finally {
    lock.releaseLock();
  }
}

function resposta(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function conhecido(item) {
  return itensDoCatalogo().indexOf(item) !== -1;
}

function itensDoCatalogo() {
  var aba = SpreadsheetApp.getActive().getSheetByName(ABA_PRODUTOS);
  if (!aba) return [];
  var n = aba.getLastRow() - PRIMEIRA_LINHA + 1;
  if (n < 1) return [];
  return aba.getRange(PRIMEIRA_LINHA, 1, n, 1).getValues()
    .map(function (r) { return String(r[0]).trim(); })
    .filter(function (v) { return v; });
}


/* ──────────────────────────  a aba de espera  ────────────────────────────── */

function garantirPedidos() {
  var ss = SpreadsheetApp.getActive();
  var aba = ss.getSheetByName(ABA_PEDIDOS);
  if (aba) return aba;

  aba = ss.insertSheet(ABA_PEDIDOS, 2);
  aba.getRange('A1').setValue('Pedidos recebidos pelo site')
     .setFontSize(14).setFontWeight('bold');
  aba.getRange('A2').setValue(
    'Cada linha é um item de um pedido que chegou pelo site e ainda não é venda. ' +
    'Escreva o nome do cliente e mude o Status para Confirmado quando fechar no WhatsApp: ' +
    'a linha vai sozinha para a aba Vendas e o Status vira Lançado. ' +
    'Se não fechar, deixe Perdido — é assim que você fica sabendo quantos pedidos evaporam.'
  ).setFontSize(9).setFontColor('#666666').setWrap(true);
  aba.getRange('A2:J2').merge();

  var cab = ['Código', 'Quando', 'Status', 'Cliente', 'Item', 'Quantidade (g)',
             'Desconto', 'Valor estimado', 'Origem', 'Observação'];
  aba.getRange(4, 1, 1, cab.length).setValues([cab])
     .setFontWeight('bold').setBackground('#3a271b').setFontColor('#efe3cc');
  aba.setFrozenRows(4);

  aba.getRange('B:B').setNumberFormat('dd/mm/yyyy hh:mm');
  aba.getRange('G:G').setNumberFormat('0%');
  aba.getRange('H:H').setNumberFormat('R$ #,##0.00');
  aba.setColumnWidth(1, 90);
  aba.setColumnWidth(2, 130);
  aba.setColumnWidth(5, 180);
  aba.setColumnWidth(10, 220);

  var regra = SpreadsheetApp.newDataValidation().requireValueInList(STATUS, true).build();
  aba.getRange(PRIMEIRA_LINHA, COL.status, 2000, 1).setDataValidation(regra);

  /* o que está só aguardando precisa saltar aos olhos; o que já virou venda
     não deve competir por atenção */
  var faixa = aba.getRange(PRIMEIRA_LINHA, 1, 2000, 10);
  aba.setConditionalFormatRules([
    SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=$C5="Aguardando"').setBackground('#fff3d6')
      .setRanges([faixa]).build(),
    SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=$C5="Lançado"').setFontColor('#999999')
      .setRanges([faixa]).build(),
    SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=$C5="Perdido"').setFontColor('#c0392b')
      .setRanges([faixa]).build(),
  ]);
  return aba;
}


/* ─────────────────────  confirmar vira venda, sozinho  ───────────────────── */

/**
 * Roda a cada edição da planilha, inclusive pelo aplicativo do celular, que é
 * onde você vai estar quando o pedido fechar. Sai na hora se a edição não foi
 * na coluna Status da aba Pedidos.
 */
function onEdit(e) {
  if (!e || !e.range) return;
  var aba = e.range.getSheet();
  if (aba.getName() !== ABA_PEDIDOS) return;
  if (e.range.getColumn() !== COL.status) return;
  if (String(e.value) !== 'Confirmado') return;
  lancar(e.range.getRow());
}

/** Do menu: varre a aba inteira, para quando o gatilho não pegou. */
function lancarConfirmados() {
  var aba = garantirPedidos();
  var n = aba.getLastRow() - PRIMEIRA_LINHA + 1;
  if (n < 1) return aviso('Não há pedidos.');
  var status = aba.getRange(PRIMEIRA_LINHA, COL.status, n, 1).getValues();
  var feitos = 0;
  for (var i = 0; i < n; i++)
    if (String(status[i][0]) === 'Confirmado' && lancar(PRIMEIRA_LINHA + i)) feitos++;
  aviso(feitos ? feitos + ' linha(s) lançada(s) em Vendas.' : 'Nada marcado como Confirmado.');
}

function lancar(linha) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
    var aba = garantirPedidos();
    var v = aba.getRange(linha, 1, 1, 10).getValues()[0];
    if (String(v[COL.status - 1]) !== 'Confirmado') return false;
    if (!v[COL.item - 1]) return false;

    var vendas = SpreadsheetApp.getActive().getSheetByName(ABA_VENDAS);
    var destino = primeiraLivre(vendas);

    var quando = v[COL.quando - 1] instanceof Date ? v[COL.quando - 1] : new Date();
    var cliente = String(v[COL.cliente - 1] || '').trim() || 'Cliente do site';
    var obs = 'Pedido ' + v[COL.codigo - 1];

    /* só as colunas digitáveis: F, G, I, J, K, L e M são fórmulas que já estão
       na linha em branco e sabem se virar sozinhas */
    vendas.getRange(destino, 1, 1, 5).setValues([[
      new Date(quando.getFullYear(), quando.getMonth(), quando.getDate()),
      cliente, v[COL.item - 1], 'Venda', v[COL.gramas - 1],
    ]]);
    vendas.getRange(destino, 8).setValue(v[COL.desconto - 1] || 0);
    vendas.getRange(destino, 14).setValue('Não');
    vendas.getRange(destino, 15).setValue(obs);

    aba.getRange(linha, COL.status).setValue('Lançado');
    aba.getRange(linha, COL.obs).setValue('Vendas linha ' + destino);
    return true;
  } finally {
    lock.releaseLock();
  }
}

/**
 * A primeira linha de Vendas sem item.
 *
 * Não dá para usar getLastRow: as linhas em branco já vêm com fórmulas e com
 * validação, então a planilha as considera usadas. Quem manda é a coluna do
 * item, que é digitada.
 */
function primeiraLivre(aba) {
  var n = aba.getMaxRows() - PRIMEIRA_LINHA + 1;
  var itens = aba.getRange(PRIMEIRA_LINHA, 3, n, 1).getValues();
  for (var i = 0; i < n; i++) if (!String(itens[i][0]).trim()) return PRIMEIRA_LINHA + i;
  /* acabaram as linhas preparadas: copia a última, com fórmulas e tudo */
  var fim = aba.getMaxRows();
  aba.insertRowsAfter(fim, 50);
  aba.getRange(fim, 1, 1, aba.getMaxColumns()).copyTo(aba.getRange(fim + 1, 1, 50, aba.getMaxColumns()));
  aba.getRange(fim + 1, 1, 50, 5).clearContent();
  return fim + 1;
}


/* ──────────────────  lançamento rápido pelo celular  ─────────────────────── */

function doGet() {
  return HtmlService.createTemplateFromFile('Lancar').evaluate()
    .setTitle('Vô Juca — lançar venda')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

/** o formulário pergunta o que existe hoje, em vez de trazer a lista congelada */
function catalogo() {
  return itensDoCatalogo();
}

function clientes() {
  var aba = SpreadsheetApp.getActive().getSheetByName(ABA_VENDAS);
  var n = aba.getLastRow() - PRIMEIRA_LINHA + 1;
  if (n < 1) return [];
  var vistos = {};
  aba.getRange(PRIMEIRA_LINHA, 2, n, 1).getValues().forEach(function (r) {
    var v = String(r[0]).trim();
    if (v) vistos[v] = true;
  });
  return Object.keys(vistos).sort();
}

function lancarVenda(d) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
    var vendas = SpreadsheetApp.getActive().getSheetByName(ABA_VENDAS);
    var linha = primeiraLivre(vendas);
    var data = d.data ? new Date(d.data + 'T12:00:00') : new Date();
    vendas.getRange(linha, 1, 1, 5).setValues([[
      new Date(data.getFullYear(), data.getMonth(), data.getDate()),
      String(d.cliente || '').trim(), d.item, d.tipo || 'Venda', Number(d.gramas) || 0,
    ]]);
    vendas.getRange(linha, 8).setValue((Number(d.desconto) || 0) / 100);
    vendas.getRange(linha, 14).setValue(d.pago ? 'Sim' : 'Não');
    vendas.getRange(linha, 15).setValue(String(d.obs || ''));
    return 'Lançado na linha ' + linha + '.';
  } finally {
    lock.releaseLock();
  }
}


/* ────────────────────────────────  menu  ─────────────────────────────────── */

function onOpen() {
  SpreadsheetApp.getUi().createMenu('Vô Juca')
    .addItem('Lançar pedidos confirmados', 'lancarConfirmados')
    .addItem('Criar a aba Pedidos', 'garantirPedidos')
    .addToUi();
}

function aviso(texto) {
  try { SpreadsheetApp.getUi().alert(texto); }
  catch (e) { SpreadsheetApp.getActive().toast(texto); }
}
