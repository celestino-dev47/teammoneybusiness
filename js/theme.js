(() => {
  const documentoRaiz = document.documentElement;
  const botaoTema = document.querySelector("#alternarTema");
  const temaGuardado = (() => {
    try {
      return localStorage.getItem("tmb-tema") || localStorage.getItem("tmb-theme");
    } catch {
      return null;
    }
  })();

  const temaInicial =
    temaGuardado === "dark"
      ? "escuro"
      : temaGuardado === "light"
        ? "claro"
        : temaGuardado ||
          (matchMedia("(prefers-color-scheme: dark)").matches ? "escuro" : "claro");

  function definirTema(tema) {
    const modoEscuro = tema === "escuro";
    documentoRaiz.dataset.tema = modoEscuro ? "escuro" : "claro";
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", modoEscuro ? "#17181b" : "#f5f3ee");

    if (botaoTema) {
      botaoTema.setAttribute("aria-pressed", String(modoEscuro));
      botaoTema.setAttribute(
        "aria-label",
        modoEscuro ? "Ativar modo claro" : "Ativar modo escuro",
      );

      const icone = botaoTema.querySelector(".icone-tema");
      icone.classList.toggle("fa-sun", modoEscuro);
      icone.classList.toggle("fa-moon", !modoEscuro);

      const rotulo = botaoTema.querySelector(".legenda-tema");
      if (rotulo) rotulo.textContent = modoEscuro ? "Modo claro" : "Modo escuro";
    }

    try {
      localStorage.setItem("tmb-tema", modoEscuro ? "escuro" : "claro");
    } catch {
      // A preferência continua ativa nesta página.
    }
  }

  definirTema(temaInicial);
  botaoTema?.addEventListener("click", () => {
    definirTema(documentoRaiz.dataset.tema === "escuro" ? "claro" : "escuro");
  });

  document.querySelectorAll("[data-ano-atual]").forEach((elemento) => {
    elemento.textContent = new Date().getFullYear();
  });
})();
