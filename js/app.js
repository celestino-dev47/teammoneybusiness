const estado = {
  produtos: [],
  responsaveis: [],
  categoria: "Todas",
  pesquisa: "",
  produtoSelecionado: null,
};

const iconesCategoria = {
  Eletrónica: "fa-plug",
  Casa: "fa-house",
  Moda: "fa-shirt",
  Acessórios: "fa-bag-shopping",
  Desporto: "fa-futbol",
  Carros: "fa-car",
  Outros: "fa-box",
};

const formatarPreco = (valor) =>
  new Intl.NumberFormat("pt-PT").format(valor) + " Kz";

const obterIniciais = (nome) =>
  nome
    .split(/\s+/)
    .slice(0, 2)
    .map((parte) => parte[0])
    .join("")
    .toUpperCase();

const observadorEntrada = "IntersectionObserver" in window
  ? new IntersectionObserver((elementos, observador) => {
      elementos.forEach((elemento) => {
        if (elemento.isIntersecting) {
          elemento.target.classList.add("visivel");
          observador.unobserve(elemento.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" })
  : null;

function observarElementos() {
  const elementos = document.querySelectorAll(
    ".secao-pagina.ativa .destaque-principal, .secao-pagina.ativa .cabecalho-secao, .secao-pagina.ativa .cartao-categoria, .secao-pagina.ativa .cartao-produto, .secao-pagina.ativa .titulo-pagina, .secao-pagina.ativa .cartao-responsavel, .secao-pagina.ativa .nota-informativa, .secao-pagina.ativa .pagina-produto-detalhe",
  );
  elementos.forEach((elemento, indice) => {
    if (elemento.dataset.animacaoPreparada) return;
    elemento.dataset.animacaoPreparada = "sim";
    elemento.classList.add("animacao-entrada");
    elemento.style.setProperty("--atraso-entrada", `${Math.min(indice % 4, 3) * 70}ms`);
    if (observadorEntrada) observadorEntrada.observe(elemento);
    else elemento.classList.add("visivel");
  });
}

async function carregarDados() {
  try {
    const [produtos, responsaveis] = await Promise.all([
      fetch("data/produtos.json"),
      fetch("data/responsaveis.json"),
    ]);

    if (!produtos.ok || !responsaveis.ok) {
      throw new Error("Não foi possível carregar os dados");
    }

    estado.produtos = await produtos.json();
    estado.responsaveis = await responsaveis.json();
    renderizarPagina();
    navegarPagina();
  } catch (erro) {
    document.querySelector("#produtosDestaque").innerHTML =
      '<p class="erro-carregamento">Não foi possível carregar os produtos. Abre o site através de um servidor local (por exemplo, Live Server) para carregar os ficheiros JSON.</p>';
    document.querySelector("#produtosCatalogo").innerHTML = "";
  }
}

function obterCategorias() {
  return [
    "Todas",
    ...new Set(["Carros", ...estado.produtos.map((produto) => produto.categoria)]),
  ];
}

function criarCartaoCategoria(categoria) {
  const quantidade = estado.produtos.filter(
    (produto) => produto.categoria === categoria,
  ).length;
  const icone = iconesCategoria[categoria] || "fa-box";

  return `<button class="cartao-categoria" data-categoria="${categoria}"><span class="icone-categoria"><i class="fa-solid ${icone}" aria-hidden="true"></i></span><span><strong>${categoria}</strong><small>${quantidade} ${quantidade === 1 ? "produto" : "produtos"}</small></span></button>`;
}

function criarCartaoProduto(produto) {
  const disponibilidade = produto.disponivel ? "Disponível" : "Indisponível";

  return `<article class="cartao-produto" data-produto="${produto.id}" tabindex="0" role="button" aria-label="Ver ${produto.nome}"><div class="area-imagem-produto"><img class="imagem-produto" src="${produto.imagem}" alt="Foto ilustrativa de ${produto.nome}" loading="lazy"><span class="etiqueta-disponibilidade">${disponibilidade}</span><span class="nota-foto-produto">Foto ilustrativa</span></div><div class="informacao-produto"><span class="categoria-produto">${produto.categoria}</span><h3>${produto.nome}</h3><div class="rodape-cartao-produto"><span class="preco-produto">${formatarPreco(produto.preco)}</span>${produto.negociavel ? '<span class="negociavel">Negociável</span>' : ""}</div></div></article>`;
}

function renderizarPagina() {
  const categoriasDisponiveis = obterCategorias().filter(
    (categoriaAtual) => categoriaAtual !== "Todas",
  );

  document.querySelector("#categoriasInicio").innerHTML = categoriasDisponiveis
    .slice(0, 4)
    .map(criarCartaoCategoria)
    .join("");

  document.querySelector("#filtrosCategoria").innerHTML = obterCategorias()
    .map((categoriaAtual) => {
      const selecionada = estado.categoria === categoriaAtual ? "ativa" : "";
      return `<button class="opcao-filtro ${selecionada}" data-filtro="${categoriaAtual}">${categoriaAtual}</button>`;
    })
    .join("");

  const produtosFiltrados = estado.produtos.filter((produto) => {
    const categoriaCorresponde =
      estado.categoria === "Todas" || produto.categoria === estado.categoria;
    const textoProduto = `${produto.nome} ${produto.categoria} ${produto.descricao}`;
    return (
      categoriaCorresponde &&
      textoProduto.toLowerCase().includes(estado.pesquisa.toLowerCase())
    );
  });

  document.querySelector("#produtosDestaque").innerHTML = estado.produtos
    .slice(0, 4)
    .map(criarCartaoProduto)
    .join("");

  document.querySelector("#produtosCatalogo").innerHTML = produtosFiltrados
    .map(criarCartaoProduto)
    .join("");

  document.querySelector("#semProdutos").hidden = produtosFiltrados.length > 0;

  document.querySelector("#listaResponsaveis").innerHTML = estado.responsaveis
    .map((responsavel) => {
      const iniciais = obterIniciais(responsavel.nome);
      return `<button type="button" class="cartao-responsavel cartao-responsavel-direto" data-responsavel="${responsavel.id}" aria-label="Falar com ${responsavel.nome} pelo WhatsApp"><span class="iniciais-responsavel">${iniciais}</span><span class="texto-responsavel"><strong>${responsavel.nome}</strong><small>${responsavel.funcao}</small><span class="atendimento-disponivel">Disponível · falar pelo WhatsApp</span></span><i class="seta-escolha fa-brands fa-whatsapp" aria-hidden="true"></i></button>`;
    })
    .join("");
  observarElementos();
}

function navegarPagina() {
  const fragmento = decodeURIComponent(location.hash.slice(1) || "inicio");
  const [rota, identificadorProduto] = fragmento.split("/");
  const rotaPagina = rota === "produto" ? "produto" : rota;
  document.querySelectorAll(".secao-pagina").forEach((secao) => {
    secao.classList.toggle("ativa", secao.id === rotaPagina);
  });
  document.querySelectorAll(".item-navegacao").forEach((item) => {
    const rotaAtiva = rota === "produto" ? "categorias" : rota;
    item.classList.toggle("ativa", item.dataset.rota === rotaAtiva);
  });
  if (rota === "produto" && identificadorProduto) renderizarProduto(identificadorProduto);
  else document.title = "Team Money Business";
  window.scrollTo({ top: 0, behavior: "smooth" });
  observarElementos();
}

function abrirProduto(identificadorProduto) {
  const produto = estado.produtos.find((item) => item.id === identificadorProduto);
  if (!produto) return;
  estado.produtoSelecionado = produto;
  location.hash = "produto/" + encodeURIComponent(produto.id);
}

function renderizarProduto(identificadorProduto) {
  const produto = estado.produtos.find((item) => item.id === identificadorProduto);
  const pagina = document.querySelector("#paginaProduto");
  if (!produto) {
    pagina.innerHTML = '<div class="estado-vazio"><h1>Produto n&#227;o encontrado</h1><p>Este produto pode ter sido removido do cat&#225;logo.</p><a class="botao-destaque" href="#categorias">Voltar aos produtos</a></div>';
    return;
  }
  estado.produtoSelecionado = produto;
  const disponibilidade = produto.disponivel ? "" : " indisponivel";
  const textoDisponibilidade = produto.disponivel ? "Em stock" : "De momento indispon&#237;vel";
  const textoBotao = produto.disponivel ? "Comprar pelo WhatsApp" : "Indispon&#237;vel";
  const estadoBotao = produto.disponivel ? "" : "disabled";
  const seloNegociacao = produto.negociavel ? '<span class="negociavel">Pre&#231;o negoci&#225;vel</span>' : "";
  document.title = produto.nome + " | Team Money Business";
  pagina.innerHTML = '<div class="cabecalho-pagina-produto"><a class="voltar-produtos" href="#categorias"><i class="fa-solid fa-arrow-left" aria-hidden="true"></i> Voltar aos produtos</a></div>' +
    '<article class="pagina-produto-detalhe animacao-entrada visivel"><div class="imagem-pagina-produto"><img src="' + produto.imagem + '" alt="Foto ilustrativa de ' + produto.nome + '"><span class="nota-foto-produto">Foto ilustrativa</span></div>' +
    '<div class="informacao-pagina-produto"><span class="categoria-produto">' + produto.categoria + '</span><h1>' + produto.nome + '</h1><p>' + produto.descricao + '</p>' +
    '<div class="linha-preco-pagina"><strong class="preco-pagina-produto">' + formatarPreco(produto.preco) + '</strong>' + seloNegociacao + '</div>' +
    '<div class="disponibilidade' + disponibilidade + '"><i class="fa-solid fa-circle" aria-hidden="true"></i> ' + textoDisponibilidade + '</div>' +
    '<button class="botao-principal" id="botaoComprar" ' + estadoBotao + '>' + textoBotao + '</button></div></article>';
  document.querySelector("#botaoComprar").addEventListener("click", () => abrirResponsaveis(produto));
}
function abrirResponsaveis(produto) {
  const detalheProduto = `${produto.nome} · ${formatarPreco(produto.preco)}${produto.negociavel ? " · preço negociável" : ""}`;
  document.querySelector("#produtoContacto").textContent = detalheProduto;

  document.querySelector("#listaResponsaveisContacto").innerHTML =
    estado.responsaveis
      .map((responsavel) => {
        const iniciais = obterIniciais(responsavel.nome);
        return `<button class="cartao-responsavel-contacto" data-responsavel="${responsavel.id}"><span class="iniciais-responsavel">${iniciais}</span><span><strong>${responsavel.nome}</strong><small>${responsavel.funcao}</small></span><i class="seta-escolha fa-solid fa-arrow-right" aria-hidden="true"></i></button>`;
      })
      .join("");

  document.querySelector("#janelaContacto").showModal();

  document.querySelectorAll(".cartao-responsavel-contacto").forEach((botao) => {
    botao.addEventListener("click", () => {
      const responsavel = estado.responsaveis.find(
        (item) => item.id === botao.dataset.responsavel,
      );
      const negociacao = produto.negociavel ? " (preço negociável)" : "";
      const mensagem = `Olá, ${responsavel.nome}! Tenho interesse no produto ${produto.nome}, anunciado por ${formatarPreco(produto.preco)}${negociacao}. Ainda está disponível?`;
      const enderecoWhatsApp = `https://wa.me/${responsavel.telefone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(mensagem)}`;

      window.open(enderecoWhatsApp, "_blank", "noopener");
      document.querySelector("#janelaContacto").close();
    });
  });
}

document.querySelector("#campoPesquisa").addEventListener("input", (evento) => {
  estado.pesquisa = evento.target.value;
  renderizarPagina();

  if (estado.pesquisa && location.hash !== "#categorias") {
    location.hash = "categorias";
  }
});

document.addEventListener("click", (evento) => {
  const cartaoResponsavel = evento.target.closest(".cartao-responsavel-direto");
  if (cartaoResponsavel) {
    const responsavel = estado.responsaveis.find((item) => item.id === cartaoResponsavel.dataset.responsavel);
    if (responsavel) {
      const mensagem = `Olá, quero falar com o senhor ${responsavel.nome}.`;
      const enderecoWhatsApp = `https://wa.me/${responsavel.telefone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(mensagem)}`;
      window.open(enderecoWhatsApp, "_blank", "noopener");
    }
  }
  const botaoCategoria = evento.target.closest("[data-categoria]");
  if (botaoCategoria) {
    estado.categoria = botaoCategoria.dataset.categoria;
    location.hash = "categorias";
    renderizarPagina();
  }

  const botaoFiltro = evento.target.closest("[data-filtro]");
  if (botaoFiltro) {
    estado.categoria = botaoFiltro.dataset.filtro;
    renderizarPagina();
  }

  const cartaoProduto = evento.target.closest("[data-produto]");
  if (cartaoProduto) abrirProduto(cartaoProduto.dataset.produto);
});

document.addEventListener("keydown", (evento) => {
  const campoAtivo = document.activeElement.tagName;

  if (evento.key === "/" && !/INPUT|TEXTAREA/.test(campoAtivo)) {
    evento.preventDefault();
    document.querySelector("#campoPesquisa").focus();
  }

  if (
    (evento.key === "Enter" || evento.key === " ") &&
    evento.target.matches("[data-produto]")
  ) {
    evento.preventDefault();
    abrirProduto(evento.target.dataset.produto);
  }
});

document.querySelectorAll("dialog .botao-fechar-janela").forEach((botao) => {
  botao.addEventListener("click", () => botao.closest("dialog").close());
});

function iniciarDigitacaoHero() {
  if (
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    (location.hash && location.hash !== "#inicio")
  ) return;
  const partes = [
    document.querySelector("#rotuloDigitado"),
    document.querySelector("#tituloDigitado"),
    document.querySelector("#fraseDigitada"),
  ].filter(Boolean).map((elemento) => ({ elemento, texto: elemento.textContent }));
  partes.forEach((parte) => { parte.elemento.textContent = ""; });
  function digitarParte(indice, posicao) {
    if (indice >= partes.length) return;
    const parte = partes[indice];
    parte.elemento.classList.add("digitacao-ativa");
    parte.elemento.textContent = parte.texto.slice(0, posicao + 1);
    if (posicao + 1 < parte.texto.length) {
      window.setTimeout(() => digitarParte(indice, posicao + 1), 48);
    } else {
      parte.elemento.classList.remove("digitacao-ativa");
      window.setTimeout(() => digitarParte(indice + 1, 0), 180);
    }
  }
  window.setTimeout(() => digitarParte(0, 0), 220);
}
window.addEventListener("hashchange", navegarPagina);
navegarPagina();
iniciarDigitacaoHero();
carregarDados();
