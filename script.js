// ============================================
// FONCTION D'INITIALISATION PRINCIPALE
// ============================================
function initializeApp() {
  // ============================================
  // MENU HAMBURGER
  // ============================================
  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector(".nav-menu");
  const navLinks = document.querySelectorAll(".nav-link");

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active");
      navMenu.classList.toggle("active");

      // Animation des barres du hamburger
      const bars = document.querySelectorAll(".bar");
      bars.forEach((bar, index) => {
        if (hamburger.classList.contains("active")) {
          if (index === 0)
            bar.style.transform = "rotate(45deg) translate(5px, 5px)";
          if (index === 1) bar.style.opacity = "0";
          if (index === 2)
            bar.style.transform = "rotate(-45deg) translate(7px, -6px)";
        } else {
          bar.style.transform = "none";
          bar.style.opacity = "1";
        }
      });
    });

    // Fermer le menu mobile quand on clique sur un lien
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
        const bars = document.querySelectorAll(".bar");
        bars.forEach((bar) => {
          bar.style.transform = "none";
          bar.style.opacity = "1";
        });
      });
    });
  }

  // ============================================
  // HEADER SCROLL EFFECT
  // ============================================
  const header = document.querySelector(".header");
  let lastScroll = 0;

  if (header) {
    window.addEventListener("scroll", () => {
      const currentScroll = window.pageYOffset;

      // Ajouter ombre au scroll
      if (currentScroll > 50) {
        header.style.boxShadow = "0 4px 20px rgba(212, 148, 156, 0.15)";
      } else {
        header.style.boxShadow = "0 2px 8px rgba(212, 148, 156, 0.08)";
      }

      lastScroll = currentScroll;
    });
  }

  // ============================================
  // SMOOTH SCROLL
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  // ============================================
  // HANDLE ANCHOR FROM URL ON PAGE LOAD
  // ============================================
  // This handles scrolling to a section if its ID is in the URL hash
  if (window.location.hash) {
    const target = document.querySelector(window.location.hash);
    if (target) {
      // Use a timeout to ensure all dynamic content is loaded and rendered
      setTimeout(() => {
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }, 150);
    }
  }


  // ============================================
  // ANIMATION AU SCROLL (Intersection Observer)
  // ============================================
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -100px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  // Observer toutes les sections
  const sections = document.querySelectorAll("section");
  sections.forEach((section) => {
    section.style.opacity = "0";
    section.style.transform = "translateY(30px)";
    section.style.transition = "opacity 0.8s ease, transform 0.8s ease";
    observer.observe(section);
  });

  // Observer les cartes de service et témoignages
  const cards = document.querySelectorAll(
    ".service-card, .testimonial-card, .faq-item"
  );
  cards.forEach((card, index) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(30px)";
    card.style.transition = `opacity 0.6s ease ${
      index * 0.1
    }s, transform 0.6s ease ${index * 0.1}s`;
    observer.observe(card);
  });

  // ============================================
  // NEWSLETTER FORM
  // ============================================
  const newsletterForm = document.querySelector(".newsletter-form");

  if (newsletterForm) {
    newsletterForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = newsletterForm.querySelector('input[type="email"]').value;

      // Validation simple
      if (email && email.includes("@")) {
        // Animation de succès
        const button = newsletterForm.querySelector(".cta-button");
        const originalText = button.textContent;
        button.textContent = "✓ Inscrit !";
        button.style.background = "linear-gradient(135deg, #4CAF50, #45a049)";

        // Réinitialiser après 3 secondes
        setTimeout(() => {
          button.textContent = originalText;
          button.style.background = "";
          newsletterForm.reset();
        }, 3000);

        // Ici, vous pouvez ajouter l'intégration avec votre service d'emailing
        console.log("Email inscrit:", email);
      } else {
        // Animation d'erreur
        const input = newsletterForm.querySelector('input[type="email"]');
        input.style.borderColor = "#ff4444";
        input.style.animation = "shake 0.5s";

        setTimeout(() => {
          input.style.borderColor = "";
          input.style.animation = "";
        }, 500);
      }
    });
  }

  // ============================================
  // ANIMATION DE TYPING POUR LE HERO
  // ============================================
  const heroTitle = document.querySelector(".hero-title");
  if (heroTitle) {
    const text = heroTitle.textContent;
    heroTitle.textContent = "";
    let i = 0;

    const typeWriter = () => {
      if (i < text.length) {
        heroTitle.textContent += text.charAt(i);
        i++;
        setTimeout(typeWriter, 50);
      }
    };

    // Démarrer l'animation après un court délai
    setTimeout(typeWriter, 500);
  }

  // ============================================
  // FAQ ACCORDION ENHANCEMENT
  // ============================================
  const faqDetails = document.querySelectorAll(".faq-item details");

  faqDetails.forEach((detail) => {
    detail.addEventListener("toggle", () => {
      if (detail.open) {
        // Fermer les autres FAQ
        faqDetails.forEach((otherDetail) => {
          if (otherDetail !== detail && otherDetail.open) {
            otherDetail.open = false;
          }
        });
      }
    });
  });

  // ============================================
  // PARALLAX EFFECT (léger)
  // ============================================
  window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset;
    const heroImage = document.querySelector(".hero-image img");

    if (heroImage && scrolled < window.innerHeight) {
      heroImage.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
  });

  // ============================================
  // CONSOLE MESSAGE
  // ============================================
  console.log(
    "%c💫 Je réussis ma transition - Site créé avec amour",
    "color: #E8B4BC; font-size: 16px; font-weight: bold;"
  );
}

// ============================================
// ANIMATION SHAKE POUR LES ERREURS
// ============================================
const style = document.createElement("style");
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
    }
`;
document.head.appendChild(style);

// ============================================
// LOADING ANIMATION
// ============================================
window.addEventListener("load", () => {
  document.body.style.opacity = "0";
  setTimeout(() => {
    document.body.style.transition = "opacity 0.5s ease";
    document.body.style.opacity = "1";
  }, 100);
});
