<div align="center">
  <img src="assets/logo.svg" alt="Logotipo Team Money Business" width="88">
  <h1>Team Money Business</h1>
  <p><strong>Descobre produtos. Compara detalhes. Fala diretamente com quem vende.</strong></p>
  <p>
    <img src="https://img.shields.io/badge/HTML5-estrutura-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5">
    <img src="https://img.shields.io/badge/CSS3-estilo-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3">
    <img src="https://img.shields.io/badge/JavaScript-intera%C3%A7%C3%A3o-F7DF1E?style=for-the-badge&logo=javascript&logoColor=222" alt="JavaScript">
    <img src="https://img.shields.io/badge/Estado-prot%C3%B3tipo-78915A?style=for-the-badge" alt="Estado: prot&#243;tipo">
  </p>
</div>

## Sobre o projeto

A Team Money Business &#233; uma montra digital responsiva para apresentar produtos e encaminhar clientes para uma conversa direta com um respons&#225;vel pelo WhatsApp. O cat&#225;logo vem de ficheiros JSON, sem necessitar de uma base de dados nesta vers&#227;o.

## Funcionalidades

- Pesquisa de produtos e navega&#231;&#227;o por categorias.
- P&#225;gina individual de cada produto, com fotografia, descri&#231;&#227;o, pre&#231;o e disponibilidade.
- Indica&#231;&#227;o de pre&#231;os negoci&#225;veis.
- Contacto direto com os respons&#225;veis pelo WhatsApp.
- Alternancia entre tema claro e escuro.
- Layout adaptado a computador e telem&#243;vel.

## Tecnologias

HTML sem&#226;ntico · CSS responsivo · JavaScript · JSON · Font Awesome

## Estrutura do projeto

~~~text
Vitrine-Digital/
|-- index.html
|-- pages/                 # Sobre, contacto e pol&#237;tica de privacidade
|-- css/styles.css         # Estilos responsivos
|-- js/
|   |-- app.js             # Cat&#225;logo, pesquisa e navega&#231;&#227;o
|   `-- theme.js           # Tema claro/escuro
|-- data/
|   |-- produtos.json      # Dados dos produtos
|   `-- responsaveis.json  # Contactos de atendimento
|-- Images/
|   `-- iphone_12_pro/     # Fotografias deste produto
`-- assets/
    |-- logo.svg
    `-- images/
        |-- produtos/     # Imagens preparadas para o catalogo
        `-- originais/    # Fotografias originais
~~~

## Executar localmente

1. Clona ou descarrega este reposit&#243;rio.
2. Abre a pasta do projeto no Visual Studio Code.
3. Inicia o **Live Server** e abre a p&#225;gina servida.

> O Live Server permite ao navegador carregar os ficheiros JSON. Abrir o HTML diretamente com **file://** pode impedir o cat&#225;logo de carregar.

## Atualizar os produtos

Edita **data/produtos.json** e mant&#233;m os campos **id**, **nome**, **categoria**, **pre&#231;o**, **negociavel**, **disponivel**, **descri&#231;&#227;o** e **imagens**. Cada produto precisa de um **id** &#250;nico. O pre&#231;o &#233; num&#233;rico (ou **null** enquanto estiver por definir); **negociavel** e **disponivel** recebem **true** ou **false** sem aspas. A galeria apresenta no m&#225;ximo quatro imagens e adapta a grelha &#224; quantidade dispon&#237;vel.

~~~json
{
  "id": "produto-exemplo",
  "nome": "Nome do produto",
  "categoria": "Casa",
  "preco": null,
  "negociavel": false,
  "disponivel": true,
  "descricao": "Uma descricao curta e clara.",
  "imagens": [
    "Images/iphone_12_pro/foto-1.jpeg",
    "Images/iphone_12_pro/foto-2.jpeg"
  ]
}
~~~

Guarda as fotografias na pasta do produto dentro de **Images/** e confirma que cada caminho em **imagens** corresponde ao nome do ficheiro. Os respons&#225;veis e os n&#250;meros de WhatsApp est&#227;o em **data/responsaveis.json**.

## Estado do projeto

Este projeto &#233; um prot&#243;tipo de cat&#225;logo. A disponibilidade, a negocia&#231;&#227;o, o pagamento e a entrega s&#227;o confirmados diretamente com o respons&#225;vel.

---

<div align="center"><strong>Planear. Investir. Crescer. Realizar.</strong></div>
