function initializeApp() {
  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector(".nav-menu");

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active");
      navMenu.classList.toggle("active");

      const bars = document.querySelectorAll(".bar");
      bars.forEach((bar, index) => {
        if (hamburger.classList.contains("active")) {
          if (index === 0) bar.style.transform = "rotate(45deg) translate(5px, 5px)";
          if (index === 1) bar.style.opacity = "0";
          if (index === 2) bar.style.transform = "rotate(-45deg) translate(7px, -6px)";
        } else {
          bar.style.transform = "none";
          bar.style.opacity = "1";
        }
      });
    });

    document.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
        document.querySelectorAll(".bar").forEach((bar) => {
          bar.style.transform = "none";
          bar.style.opacity = "1";
        });
      });
    });
  }

  const header = document.querySelector(".header");
  if (header) {
    window.addEventListener("scroll", () => {
      header.style.boxShadow =
        window.pageYOffset > 50
          ? "0 4px 20px rgba(212, 148, 156, 0.15)"
          : "0 2px 8px rgba(212, 148, 156, 0.08)";
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        const offset = target.getBoundingClientRect().top + window.pageYOffset - 80;
        window.scrollTo({ top: offset, behavior: "smooth" });
      }
    });
  });

  if (window.location.hash) {
    const target = document.querySelector(window.location.hash);
    if (target) {
      setTimeout(() => {
        const offset = target.getBoundingClientRect().top + window.pageYOffset - 80;
        window.scrollTo({ top: offset, behavior: "smooth" });
      }, 150);
    }
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -100px 0px" }
  );

  document.querySelectorAll("section").forEach((section) => {
    section.style.opacity = "0";
    section.style.transform = "translateY(30px)";
    section.style.transition = "opacity 0.8s ease, transform 0.8s ease";
    observer.observe(section);
  });

  document.querySelectorAll(".service-card, .testimonial-card, .faq-item").forEach((card, index) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(30px)";
    card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    observer.observe(card);
  });

  const newsletterForm = document.querySelector(".newsletter-form");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = newsletterForm.querySelector('input[type="email"]').value;

      if (email && email.includes("@")) {
        const button = newsletterForm.querySelector(".cta-button");
        const originalText = button.textContent;
        button.textContent = "✓ Inscrit !";
        button.style.background = "linear-gradient(135deg, #4CAF50, #45a049)";
        setTimeout(() => {
          button.textContent = originalText;
          button.style.background = "";
          newsletterForm.reset();
        }, 3000);
      } else {
        const input = newsletterForm.querySelector('input[type="email"]');
        input.classList.add("shake");
        setTimeout(() => input.classList.remove("shake"), 500);
      }
    });
  }

  document.querySelectorAll(".faq-item details").forEach((detail) => {
    detail.addEventListener("toggle", () => {
      if (detail.open) {
        document.querySelectorAll(".faq-item details").forEach((other) => {
          if (other !== detail && other.open) other.open = false;
        });
      }
    });
  });

  window.addEventListener("scroll", () => {
    const heroImage = document.querySelector(".hero-image img");
    if (heroImage && window.pageYOffset < window.innerHeight) {
      heroImage.style.transform = `translateY(${window.pageYOffset * 0.3}px)`;
    }
  });
}
