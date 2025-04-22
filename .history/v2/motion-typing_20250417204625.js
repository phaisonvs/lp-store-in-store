/**
 * @description Implementação avançada do efeito de digitação usando a biblioteca Motion
 * Este arquivo oferece uma alternativa mais avançada usando os recursos da API Motion
 */

// Configuração do efeito typing na inicialização
document.addEventListener("DOMContentLoaded", () => {
  initAdvancedTypingAnimation();
});

function initAdvancedTypingAnimation() {
  const typingContainer = document.querySelector(".typing-container");
  if (!typingContainer || typeof motion === "undefined") {
    console.warn(
      "Biblioteca motion não encontrada ou elemento não disponível."
    );
    return;
  }

  const text =
    "O modelo de negócio que está transformando o mercado da construção no Brasil: inovação e rentabilidade em um setor que não para de evoluir.";

  // Dividir o texto em partes para animação
  const words = text.split(" ");

  // Limpar o container antes de iniciar
  typingContainer.innerHTML = "";

  // Criando spans para cada palavra para animação individualizada
  words.forEach((word, index) => {
    const wordSpan = document.createElement("span");
    wordSpan.className = "word";
    wordSpan.style.opacity = "0";
    wordSpan.style.display = "inline-block";
    wordSpan.textContent = word + " ";
    typingContainer.appendChild(wordSpan);
  });

  // Aplicando a animação sequencial usando a API motion.timeline
  const wordElements = typingContainer.querySelectorAll(".word");

  // Cria uma timeline para sequenciar as animações
  const timeline = motion.timeline([
    [
      wordElements,
      {
        opacity: [0, 1],
        y: [20, 0],
        filter: ["blur(3px)", "blur(0px)"],
      },
      {
        duration: 0.2,
        delay: motion.stagger(0.08),
        easing: "ease-out",
        at: "+0.2", // Inicia 200ms após a animação anterior
      },
    ],
  ]);

  // Adiciona um evento para disparar a animação após o delay
  setTimeout(() => {
    timeline.play();

    // Adiciona a animação do cursor após a digitação completa
    setTimeout(() => {
      // Adiciona um elemento para o cursor piscante
      const cursor = document.createElement("span");
      cursor.className = "typing-cursor";
      cursor.textContent = "|";
      cursor.style.color = "var(--caret-color)";
      typingContainer.appendChild(cursor);

      // Anima o cursor
      motion.animate(
        cursor,
        { opacity: [1, 0] },
        { duration: 0.8, repeat: Infinity, easing: "ease-in-out" }
      );
    }, words.length * 80 + 500);
  }, parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--delay-typing")) * 1000 || 1800);
}

// Funções utilitárias para manipulação de texto
function createTypewriterEffect(element, text, options = {}) {
  const defaults = {
    speed: 40,
    delay: 0,
    onComplete: () => {},
  };

  const settings = { ...defaults, ...options };
  let index = 0;

  // Limpa o conteúdo do elemento
  element.textContent = "";

  // Inicia a animação após o delay especificado
  setTimeout(() => {
    const interval = setInterval(() => {
      if (index < text.length) {
        element.textContent += text.charAt(index);
        index++;
      } else {
        clearInterval(interval);
        settings.onComplete();
      }
    }, settings.speed);
  }, settings.delay);
}
