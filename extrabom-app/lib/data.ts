// EXTRABOM SORVETES — Camada de dados
// FASE ATUAL: banco funcional local (localStorage) para validação do sistema.
// PRODUÇÃO: trocar esta camada por Supabase/PostgreSQL usando supabase/schema.sql
// (mesmas entidades, RLS por revendedor, Auth, Realtime e Storage).
// Todos os preços/estoques abaixo são DEMONSTRAÇÃO — devem ser substituídos
// pelos valores reais cadastrados pela administração no Painel.

export type StatusPedido = 'aguardando_aprovacao'|'aprovado'|'separacao_producao'|'aguardando_conferencia'|'pronto'|'saiu_entrega'|'entregue'|'retirado'|'recusado'|'cancelado'
export type PagSituacao = 'pendente'|'aguardando_confirmacao'|'pago'|'parcialmente_pago'|'estornado'
export type Produto = { id:string; nome:string; descricao:string; categoria:string; embalagem:string; emoji:string; cor:string; precoPadrao:number; ativo:boolean; disponibilidade:'disponivel'|'em_producao'|'indisponivel'; estoqueFisico:number; estoqueReservado:number }
export type Revendedor = { id:string; nome:string; negocio:string; telefone:string; doc:string; endereco:string; login:string; ativo:boolean; pedidoMinimo:number; pagamento:string[]; precos:Record<string,number> }
export type ItemPedido = { produtoId:string; nome:string; embalagem:string; precoUnitario:number; quantidade:number }
export type Pedido = { id:string; numero:string; revendedorId:string; itens:ItemPedido[]; total:number; recebimento:'entrega'|'retirada'; endereco:string; pagamento:'pix'|'na_entrega'|'na_retirada'; pagSituacao:PagSituacao; status:StatusPedido; motivo?:string; obs?:string; criadoEm:string; historico:{status:string;em:string;por:string}[] }
export type Notificacao = { id:string; revendedorId:string; texto:string; em:string; lida:boolean }
export type DB = { versao?:number; produtos:Produto[]; revendedores:Revendedor[]; pedidos:Pedido[]; notificacoes:Notificacao[]; promocoes:{id:string;titulo:string;texto:string}[]; movimentos:{id:string;produto:string;tipo:string;qtd:number;em:string;motivo:string}[] }

export const STATUS_LABEL:Record<StatusPedido,string>={aguardando_aprovacao:'Aguardando aprovação',aprovado:'Aprovado',separacao_producao:'Em separação / produção',aguardando_conferencia:'Aguardando conferência',pronto:'Pronto',saiu_entrega:'Saiu para entrega',entregue:'Entregue',retirado:'Retirado',recusado:'Recusado',cancelado:'Cancelado'}
export const TIMELINE:StatusPedido[]=['aguardando_aprovacao','aprovado','separacao_producao','aguardando_conferencia','pronto','saiu_entrega','entregue']

const sabores:[string,string,string,string][]=[
['Flocos','Sorvete cremoso com pedaços de chocolate','🍪','#FFF3D6'],['Frutas','Mix refrescante de frutas selecionadas','🍓','#FFE3EC'],['Lacta','Chocolate ao leite cremoso estilo Lacta','🍫','#EAD9C2'],['Nega Maluca','Chocolate intenso com toque caseiro','🍫','#DCC7B8'],['Morango','Morango cremoso e aromático','🍓','#FFD6E0'],['Chocolate','Chocolate clássico e encorpado','🍫','#CFAF8E'],['Sensação','Morango com pedaços de chocolate','🍓','#FFC9D6'],['Brigadeiro','Brigadeiro cremoso brasileiro','🍮','#E8C9A0'],['Coco','Coco natural e refrescante','🥥','#F1F5E9'],['Prestígio','Coco com chocolate Prestígio','🥥','#D7CCC8'],['Milho Verde','Milho-verde cremoso tradicional','🌽','#FFF9C4'],['Napolitano','Chocolate, morango e creme em camadas','🍦','#FFE0E6']]

export function seedDB():DB{
  const umL = sabores.filter(s=>s[0]!=='Milho Verde'&&s[0]!=='Napolitano')
  const umM = sabores.filter(s=>s[0]!=='Milho Verde')
  const produtos:Produto[]=umL.map((s,i)=>({id:'p'+(i+1),nome:'Sorvete '+s[0]+' 1L',descricao:s[1],categoria:'Sorvetes 1 Litro',embalagem:'Pote 1 Litro',emoji:s[2],cor:s[3],precoPadrao:8,ativo:true,disponibilidade:'disponivel',estoqueFisico:40-(i%5)*4,estoqueReservado:0}))
  umM.forEach((s,i)=>{ produtos.push({id:'p'+(16+i),nome:'Sorvete '+s[0]+' 1,5L',descricao:s[1],categoria:'Sorvetes 1,5 Litro',embalagem:'Pote 1,5 Litro',emoji:s[2],cor:s[3],precoPadrao:12,ativo:true,disponibilidade:'disponivel',estoqueFisico:24-(i%4)*3,estoqueReservado:0}) })
  produtos.push(
    {id:'p28',nome:'Skimo',descricao:'Linha de produtos EXTRABOM',categoria:'Produtos',embalagem:'Unidade',emoji:'🍦',cor:'#EAF2FF',precoPadrao:2.25,ativo:true,disponibilidade:'disponivel',estoqueFisico:200,estoqueReservado:0},
    {id:'p29',nome:'Moreninha',descricao:'Linha de produtos EXTRABOM',categoria:'Produtos',embalagem:'Unidade',emoji:'🍫',cor:'#EAD9C2',precoPadrao:2.75,ativo:true,disponibilidade:'disponivel',estoqueFisico:200,estoqueReservado:0},
    {id:'p30',nome:'Massinha',descricao:'Linha de produtos EXTRABOM',categoria:'Produtos',embalagem:'Unidade',emoji:'🍨',cor:'#FFE3EC',precoPadrao:2.25,ativo:true,disponibilidade:'disponivel',estoqueFisico:200,estoqueReservado:0},
  )
  const leite=['Abacate','Abacaxi ao Leite','Açaí','Ameixa','Amendoim','Banana','Baunilha','Blue Ice','Coco','Coco Queimado','Chiclete','Chocolate','Chocolate Branco','Creme','Cupuaçu','Doce de Leite','Leite Condensado','Leitinho','Limão ao Leite','Milho Verde','Morango','Nata','Uva ao Leite']
  const agua=['Abacaxi','Acerola','Cajá','Energético','Graviola','Groselha','Guaraná','Kiwi','Laranja','Limão','Maracujá','Melancia','Menta','Minissaia','Morango','Pinta Língua','Tangerina','Tutti Frutti','Uva']
  const coresP=['#FFF3D6','#FFE3EC','#E8F5E9','#FFF9C4','#F3E5F5','#E3F2FD','#FCE4EC','#E0F2F1']
  leite.forEach((n,i)=>produtos.push({id:'p'+(40+i),nome:'Picolé de '+n,descricao:'Picolé de leite — preço por faixa de quantidade do pedido',categoria:'Picolés de Leite',embalagem:'Unidade (atacado)',emoji:'🍭',cor:coresP[i%coresP.length],precoPadrao:0.70,ativo:true,disponibilidade:'disponivel',estoqueFisico:1000,estoqueReservado:0}))
  agua.forEach((n,i)=>produtos.push({id:'p'+(70+i),nome:'Picolé de '+n,descricao:'Picolé de água — preço por faixa de quantidade do pedido',categoria:'Picolés de Água',embalagem:'Unidade (atacado)',emoji:'🧊',cor:coresP[(i+3)%coresP.length],precoPadrao:0.70,ativo:true,disponibilidade:'disponivel',estoqueFisico:1000,estoqueReservado:0}))
  const revendedores:Revendedor[]=[
    {id:'r1',nome:'Carlos Silva',negocio:'Mini Mercado do Carlos Silva (DEMO)',telefone:'(00) 90000-0001',doc:'CNPJ ••• (demo)',endereco:'Endereço demonstrativo — cadastrar o real no Admin',login:'carlos',ativo:true,pedidoMinimo:150,pagamento:['pix','na_entrega','na_retirada'],precos:{}},
    {id:'r2',nome:'Maria Santos',negocio:'Lanchonete da Maria Santos (DEMO)',telefone:'(00) 90000-0002',doc:'CNPJ ••• (demo)',endereco:'Endereço demonstrativo — cadastrar o real no Admin',login:'maria',ativo:true,pedidoMinimo:200,pagamento:['pix','na_retirada'],precos:{}},
    {id:'r3',nome:'João Pedro',negocio:'Distribuidora do João Pedro (DEMO)',telefone:'(00) 90000-0003',doc:'CNPJ ••• (demo)',endereco:'Endereço demonstrativo — cadastrar o real no Admin',login:'joao',ativo:true,pedidoMinimo:300,pagamento:['pix','na_entrega'],precos:{}},
  ]
  return {versao:3,produtos,revendedores,pedidos:[],notificacoes:[{id:'n1',revendedorId:'r1',texto:'Bem-vindo à Área do Revendedor EXTRABOM! Confira o catálogo e faça seu pedido.',em:new Date().toISOString(),lida:false}],promocoes:[{id:'pr1',titulo:'Tabela de preços atualizada',texto:'Confira os valores vigentes no catálogo. Picolé no atacado tem preço especial por quantidade!'}],movimentos:[]}
}
export function precoPicole(totalPicoles:number){ if(totalPicoles>2000) return 0.60; if(totalPicoles>=600) return 0.65; return 0.70 }
export const precoPara=(p:Produto,r:Revendedor)=> r.precos[p.id] ?? p.precoPadrao
export const money=(v:number)=> v.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})
export const disponivel=(p:Produto)=> Math.max(0,p.estoqueFisico-p.estoqueReservado)
