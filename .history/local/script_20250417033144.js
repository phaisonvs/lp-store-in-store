/**
 * @description Script principal otimizado para performance da página "Seja um Franqueado"
 * @author Dev ABC da Construção
 */
document.addEventListener("DOMContentLoaded", () => {
  // Mostrar todos os elementos que tinham animação
  document.querySelectorAll(".animate-on-scroll").forEach((element) => {
    element.style.opacity = "1";
    element.style.transform = "none";
    element.classList.add("is-visible");
  });

  // Restaurar visibilidade dos elementos
  document
    .querySelectorAll(
      ".container-prova-social-1, .section-the-news, .nossas-guides-container, .carousel"
    )
    .forEach((element) => {
      element.style.opacity = "1";
      element.style.visibility = "visible";
      element.style.transform = "none";
    });
});
