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
export type DB = { produtos:Produto[]; revendedores:Revendedor[]; pedidos:Pedido[]; notificacoes:Notificacao[]; promocoes:{id:string;titulo:string;texto:string}[]; movimentos:{id:string;produto:string;tipo:string;qtd:number;em:string;motivo:string}[] }

export const STATUS_LABEL:Record<StatusPedido,string>={aguardando_aprovacao:'Aguardando aprovação',aprovado:'Aprovado',separacao_producao:'Em separação / produção',aguardando_conferencia:'Aguardando conferência',pronto:'Pronto',saiu_entrega:'Saiu para entrega',entregue:'Entregue',retirado:'Retirado',recusado:'Recusado',cancelado:'Cancelado'}
export const TIMELINE:StatusPedido[]=['aguardando_aprovacao','aprovado','separacao_producao','aguardando_conferencia','pronto','saiu_entrega','entregue']

const sabores:[string,string,string,string][]=[
['Flocos','Sorvete cremoso com pedaços de chocolate','🍪','#FFF3D6'],['Frutas','Mix refrescante de frutas selecionadas','🍓','#FFE3EC'],['Lacta','Chocolate ao leite cremoso estilo Lacta','🍫','#EAD9C2'],['Nega Maluca','Chocolate intenso com toque caseiro','🍫','#DCC7B8'],['Morango','Morango cremoso e aromático','🍓','#FFD6E0'],['Chocolate','Chocolate clássico e encorpado','🍫','#CFAF8E'],['Sensação','Morango com pedaços de chocolate','🍓','#FFC9D6'],['Brigadeiro','Brigadeiro cremoso brasileiro','🍮','#E8C9A0'],['Coco','Coco natural e refrescante','🥥','#F1F5E9'],['Prestígio','Coco com chocolate Prestígio','🥥','#D7CCC8'],['Milho Verde','Milho-verde cremoso tradicional','🌽','#FFF9C4'],['Napolitano','Chocolate, morango e creme em camadas','🍦','#FFE0E6']]

export function seedDB():DB{
  const produtos:Produto[]=sabores.map((s,i)=>({id:'p'+(i+1),nome:'Sorvete '+s[0]+' 1L',descricao:s[1],categoria:'Sorvetes 1 Litro',embalagem:'Pote 1 Litro',emoji:s[2],cor:s[3],precoPadrao:19.9,ativo:true,disponibilidade:i===10?'em_producao':'disponivel',estoqueFisico:40-(i%5)*4,estoqueReservado:0}))
  produtos.push(
    {id:'p13',nome:'Picolé de Chocolate',descricao:'Picolé cremoso de chocolate (cadastro demonstrativo)',categoria:'Picolés',embalagem:'Unidade',emoji:'🍫',cor:'#D7CCC8',precoPadrao:3.5,ativo:true,disponibilidade:'disponivel',estoqueFisico:220,estoqueReservado:0},
    {id:'p14',nome:'Picolé de Morango',descricao:'Picolé refrescante de morango (cadastro demonstrativo)',categoria:'Picolés',embalagem:'Unidade',emoji:'🍓',cor:'#FFCDD2',precoPadrao:3.5,ativo:true,disponibilidade:'disponivel',estoqueFisico:180,estoqueReservado:0},
    {id:'p15',nome:'Picolé de Coco',descricao:'Picolé cremoso de coco (cadastro demonstrativo)',categoria:'Picolés',embalagem:'Unidade',emoji:'🥥',cor:'#F1F8E9',precoPadrao:3.5,ativo:true,disponibilidade:'indisponivel',estoqueFisico:0,estoqueReservado:0},
  )
  const revendedores:Revendedor[]=[
    {id:'r1',nome:'Carlos Silva',negocio:'Mini Mercado do Carlos Silva (DEMO)',telefone:'(00) 90000-0001',doc:'CNPJ ••• (demo)',endereco:'Endereço demonstrativo — cadastrar o real no Admin',login:'carlos',ativo:true,pedidoMinimo:150,pagamento:['pix','na_entrega','na_retirada'],precos:{p1:18.9,p2:18.9,p6:17.9}},
    {id:'r2',nome:'Maria Santos',negocio:'Lanchonete da Maria Santos (DEMO)',telefone:'(00) 90000-0002',doc:'CNPJ ••• (demo)',endereco:'Endereço demonstrativo — cadastrar o real no Admin',login:'maria',ativo:true,pedidoMinimo:200,pagamento:['pix','na_retirada'],precos:{p1:19.9}},
    {id:'r3',nome:'João Pedro',negocio:'Distribuidora do João Pedro (DEMO)',telefone:'(00) 90000-0003',doc:'CNPJ ••• (demo)',endereco:'Endereço demonstrativo — cadastrar o real no Admin',login:'joao',ativo:true,pedidoMinimo:300,pagamento:['pix','na_entrega'],precos:{}},
  ]
  return {produtos,revendedores,pedidos:[],notificacoes:[{id:'n1',revendedorId:'r1',texto:'Bem-vindo à Área do Revendedor EXTRABOM! Confira o catálogo e faça seu pedido.',em:new Date().toISOString(),lida:false}],promocoes:[{id:'pr1',titulo:'Semana do Revendedor (DEMO)',texto:'Promoção demonstrativa — a empresa publica as ofertas reais no Painel Administrativo.'}],movimentos:[]}
}
export const precoPara=(p:Produto,r:Revendedor)=> r.precos[p.id] ?? p.precoPadrao
export const money=(v:number)=> v.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})
export const disponivel=(p:Produto)=> Math.max(0,p.estoqueFisico-p.estoqueReservado)
