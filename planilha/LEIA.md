# A ponte entre o site e a planilha

O pedido nasce no site, a conversa acontece no WhatsApp e o controle vive na
planilha. Estes dois arquivos ligam as três pontas, para que nada precise ser
digitado duas vezes.

- `Codigo.gs` — o script que recebe o pedido, lança a venda e serve o formulário
- `Lancar.html` — o formulário de lançamento rápido pelo celular

## Montagem, uma vez só

1. **Subir a planilha.** No Google Drive, arraste `Vo Juca - controle-3.xlsx`.
   Abra e use **Arquivo › Salvar como Planilhas Google**: enquanto ele for um
   `.xlsx` dentro do Drive, nenhum script roda nele.
2. **Abrir o editor.** Na planilha convertida, **Extensões › Apps Script**.
3. **Colar o código.** Apague o conteúdo de `Código.gs` e cole o `Codigo.gs`
   daqui. Depois **+ › HTML**, com o nome exato `Lancar`, e cole o `Lancar.html`.
4. **Trocar a senha.** Na linha `const SENHA`, troque `TROQUE-ESTA-SENHA` por
   uma palavra sua. Salve.
5. **Testar a metade da planilha.** Escolha `testarPedido` na barra de cima e
   clique em **Executar**. Autorize. Uma linha `VJ-TESTE` deve aparecer na aba
   Pedidos. Apague-a.
6. **Publicar.** **Implantar › Nova implantação › Aplicativo da Web**, com
   *Executar como* **eu** e *Quem pode acessar* **qualquer pessoa**.
7. **Ligar o site.** Na Vercel, em *Settings › Environment Variables*, crie
   `VITE_PEDIDOS_URL` com o link `/exec` e `VITE_PEDIDOS_TOKEN` com a senha.
   Depois **Redeploy**: variável só entra no site num deploy novo.
8. **Teste de ponta a ponta.** No site, monte um pedido e clique em Fechar
   pedido. A linha deve aparecer na aba Pedidos com o mesmo código da mensagem.

Mudou o código depois? **Implantar › Gerenciar implantações › lápis › Versão:
Nova versão.** Assim o endereço continua o mesmo; uma implantação nova criaria
outro endereço e o site deixaria de gravar.

## O dia a dia

**Pedido que veio do site.** Cai sozinho na aba **Pedidos**, em amarelo, como
`Aguardando`. A mensagem que chega no seu WhatsApp termina com o mesmo código,
`VJ-XXXX`. Fechou? Escreva o nome do cliente e mude o Status para
`Confirmado`: as linhas vão para **Vendas** e o Status vira `Lançado`. Não
fechou? Deixe `Perdido` — é assim que você passa a saber quantos pedidos sua
página perde, número que hoje não existe em lugar nenhum.

**Pedido que veio direto no WhatsApp.** Abra o link `/exec` no celular, logado
na sua conta Google, e guarde na tela de início. É o formulário: café, gramas,
cliente, pronto. Para qualquer outra pessoa o mesmo link mostra só um aviso,
porque o endereço está no código do site e o formulário grava direto em Vendas.

## O que este script não faz

Ele **nunca apaga nem altera** o que já está na planilha: só acrescenta linha.
Não mexe em preço, não recalcula histórico e não toca nas suas fórmulas.

A senha viaja dentro do JavaScript da página, então quem abrir o código-fonte do
site a encontra. Isso é esperado, e é o motivo de o script ser limitado desse
jeito: o pior que alguém mal-intencionado consegue é sujar a aba de espera com
pedidos falsos, que você reconhece de imediato porque estão sem cliente e você
não recebeu conversa nenhuma. É só apagar a linha.

Se o site não conseguir falar com a planilha — internet ruim, script fora do ar,
variável não configurada — **o pedido não se perde**: ele continua escrito na
mensagem do WhatsApp, que é o que de fato chega até você. O pior caso é digitar
à mão, que é exatamente como funciona hoje.
