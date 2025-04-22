/**
 * @description Implementação profissional de efeito de digitação usando a biblioteca Framer Motion
 * Baseado nas melhores práticas de animação de texto
 */

// Configuração da animação ao carregar a página
document.addEventListener("DOMContentLoaded", () => {
  // Pequeno delay para garantir que o DOM esteja completamente carregado
  setTimeout(() => {
    initFramerTypingAnimation();
  }, 500);
});

/**
 * Inicializa a animação de digitação usando Framer Motion
 */
function initFramerTypingAnimation() {
  // Seleciona o container de texto
  const typingContainer = document.querySelector(".typing-container");
  if (!typingContainer) {
    console.warn("Elemento .typing-container não encontrado");
    return;
  }

  // Texto a ser animado
  const text =
    "O modelo de negócio que está transformando o mercado da construção no Brasil: inovação e rentabilidade em um setor que não para de evoluir.";

  // Limpa o container antes de iniciar
  typingContainer.textContent = "";

  // Configura a animação
  const framer = window.Motion || window.motion || window.framerMotion;

  if (!framer) {
    console.warn("Biblioteca Framer Motion não encontrada");
    typingContainer.textContent = text; // Fallback
    return;
  }

  // Cria um elemento wrapper para a animação
  const wrapper = document.createElement("div");
  wrapper.className = "typing-wrapper";
  typingContainer.appendChild(wrapper);

  // Cria o cursor
  const cursor = document.createElement("span");
  cursor.className = "typing-cursor";
  cursor.textContent = "|";

  // Configurações de velocidade e timing
  const charsPerSecond = 15; // Caracteres por segundo (não tão rápido, mas fluido)
  const baseDuration = 60 / charsPerSecond; // Duração base para cada caractere em ms
  const initialDelay =
    parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue(
        "--delay-typing"
      )
    ) * 1000 || 1500;

  // Função de animação do cursor
  function animateCursor() {
    framer.animate(
      cursor,
      { opacity: [1, 0] },
      {
        duration: 0.8,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
      }
    );
  }

  // Função para adicionar caracteres gradualmente
  function typeCharacters() {
    let charIndex = 0;
    let currentText = "";

    const typeInterval = setInterval(() => {
      if (charIndex < text.length) {
        // Adiciona o próximo caractere
        currentText += text[charIndex];
        wrapper.textContent = currentText;

        // Variação natural de velocidade
        const randomFactor = Math.random() * 0.3 + 0.85; // Fator aleatório entre 0.85 e 1.15
        const pauseFactor =
          text[charIndex] === "." ||
          text[charIndex] === "," ||
          text[charIndex] === ":"
            ? 3
            : 1;

        // Anima o último caractere adicionado
        if (wrapper.lastChild) {
          framer.animate(
            wrapper,
            {
              opacity: [0.95, 1],
              scale: [0.998, 1],
            },
            {
              duration: 0.08,
              ease: "easeOut",
            }
          );
        }

        charIndex++;

        // Ajusta a velocidade de digitação para caracteres específicos
        let adjustedDuration = baseDuration * randomFactor * pauseFactor;
        clearInterval(typeInterval);
        typeInterval = setTimeout(typeCharacters, adjustedDuration);
      } else {
        // Animação concluída
        clearInterval(typeInterval);

        // Adiciona o cursor ao final
        typingContainer.appendChild(cursor);
        animateCursor();

        // Anima o texto completo com um leve movimento
        framer.animate(
          wrapper,
          {
            y: [0, -2, 0],
            color: ["#e5e5e5", "#ffffff", "#e5e5e5"],
          },
          {
            duration: 2,
            ease: "easeInOut",
            delay: 0.8,
          }
        );
      }
    }, baseDuration);
  }

  // Inicia a animação após o delay inicial
  setTimeout(() => {
    typeCharacters();
  }, initialDelay);
}

/**
 * Melhorias em relação às versões anteriores:
 * 1. Velocidade mais natural (não tão rápida)
 * 2. Pausas em pontuações para ritmo mais humano
 * 3. Variação aleatória sutil na velocidade
 * 4. Micro-animações de escala e opacidade durante a digitação
 * 5. Animação final suave do texto completo
 */
