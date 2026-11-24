/**
 * Cadastro de um lote novo.
 *
 * Cada lote é um produto próprio na aba Produtos, com custo e preço fixos.
 * Assim as vendas antigas nunca mudam de valor quando chega café novo: elas
 * continuam apontando para o lote de onde saíram.
 *
 * Os números do lote 2 vêm da planilha de planejamento
 * (vojuca_margem_por_produto_2.xlsx): custo do café pelo método de escassez,
 * igual para grão e moído, sem embalagem (embalagem é lançada em Despesas);
 * preço cheio por kg = preço do pacote de 300 g ou 500 g dividido pelo peso.
 *
 * Rodar mais de uma vez não duplica nada: item que já existe é pulado.
 */
const LOTE_2 = [
  // [Item, Produto, Moagem, custo/kg, preço cheio/kg]
  ['Café Vô Juca lote 2 · Grão',  'Café Vô Juca lote 2', 'Grão',  53.17, 159.67],
  ['Café Vô Juca lote 2 · Moído', 'Café Vô Juca lote 2', 'Moído', 53.17, 163.00],
  ['Reserva 998 lote 2 · Grão',   'Reserva 998 lote 2',  'Grão',  81.21, 194.67],
  ['Reserva 998 lote 2 · Moído',  'Reserva 998 lote 2',  'Moído', 81.21, 198.00],
  ['Minas Santa lote 3 · Moído',  'Minas Santa lote 3',  'Moído', 44.48, 110.00],
];

const PRODUTOS_FIM = 34;   // última linha preparada da aba Produtos

function cadastrarLote2() {
  var ss = SpreadsheetApp.getActive();
  var pr = ss.getSheetByName('Produtos');
  var n = PRODUTOS_FIM - PRIMEIRA_LINHA + 1;
  var existentes = pr.getRange(PRIMEIRA_LINHA, 1, n, 1).getValues().map(function (r) { return String(r[0]).trim(); });

  var novos = 0;
  LOTE_2.forEach(function (p) {
    if (existentes.indexOf(p[0]) !== -1) return;
    var vaga = existentes.indexOf('');
    if (vaga === -1) throw new Error('A aba Produtos não tem mais linhas livres.');
    var linha = PRIMEIRA_LINHA + vaga;
    // estoque inicial 0: a entrada do café é lançada na aba Compras
    pr.getRange(linha, 1, 1, 7).setValues([[p[0], p[1], p[2], 'Sim', p[3], p[4], 0]]);
    existentes[vaga] = p[0];
    novos++;
  });

  ajustarPainel();
  listaNosPedidos();
  aviso(novos ? novos + ' produto(s) do lote novo cadastrados. O Painel já mostra todos.' :
                'O lote 2 já estava cadastrado. Painel e lista de Pedidos conferidos.');
}

/**
 * A tabela "Estoque hoje" do Painel nasceu com 10 linhas fixas; produto
 * cadastrado da linha 15 em diante não aparecia. Aqui ela passa a ter uma
 * linha para cada produto cadastrado.
 */
function ajustarPainel() {
  var ss = SpreadsheetApp.getActive();
  var pa = ss.getSheetByName('Painel');
  var pr = ss.getSheetByName('Produtos');
  var INICIO = 24;  // primeira linha de item no Painel

  var itens = pr.getRange(PRIMEIRA_LINHA, 1, PRODUTOS_FIM - PRIMEIRA_LINHA + 1, 1).getValues();
  var total = 0;
  for (var i = 0; i < itens.length; i++) if (String(itens[i][0]).trim()) total = i + 1;

  // acha a linha do "Estoque total a custo": a tabela acaba logo antes dela
  var colA = pa.getRange(INICIO, 1, 60, 1).getValues();
  var fimAtual = -1;
  for (var k = 0; k < colA.length; k++) {
    if (String(colA[k][0]).indexOf('Estoque total') === 0) { fimAtual = INICIO + k; break; }
  }
  if (fimAtual === -1) throw new Error('Não achei a linha "Estoque total a custo" no Painel.');
  var linhasHoje = fimAtual - INICIO;
  // insere dentro da tabela (antes da última linha) para as cores irem junto
  if (total > linhasHoje) pa.insertRowsBefore(fimAtual - 1, total - linhasHoje);

  var f = [];
  for (var j = 0; j < total; j++) {
    var r = INICIO + j, p = PRIMEIRA_LINHA + j;
    f.push(['=Produtos!$A$' + p, '=Produtos!$J$' + p,
      '=SUMIFS(Vendas!$F$5:$F$1004,Vendas!$C$5:$C$1004,$A' + r + ',Vendas!$N$5:$N$1004,"À embalar")']);
  }
  pa.getRange(INICIO, 1, total, 3).setFormulas(f);
  pa.getRange(INICIO + total - 1, 1, 1, 3).copyFormatToRange(pa, 1, 3, INICIO, INICIO + total - 1);
}

/** a coluna Item da aba Pedidos ganha a lista de produtos, para trocar o lote antes de confirmar */
function listaNosPedidos() {
  var ss = SpreadsheetApp.getActive();
  var pe = ss.getSheetByName(ABA_PEDIDOS);
  if (!pe) return;
  var regra = SpreadsheetApp.newDataValidation()
    .requireValueInRange(ss.getSheetByName('Produtos').getRange('A5:A' + PRODUTOS_FIM), true)
    .setAllowInvalid(true).build();
  pe.getRange(PRIMEIRA_LINHA, COL.item, 2000, 1).setDataValidation(regra);
}
