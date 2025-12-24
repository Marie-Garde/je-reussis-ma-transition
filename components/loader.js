// Fonction pour charger un composant HTML
async function loadComponent(componentName, targetId) {
  try {
    const response = await fetch(`components/${componentName}.html`);
    if (!response.ok) {
      throw new Error(`Erreur lors du chargement de ${componentName}`);
    }
    const html = await response.text();
    const target = document.getElementById(targetId);
    if (target) {
      target.innerHTML = html;
    } else {
      console.error(`Element avec l'id "${targetId}" non trouvé`);
    }
  } catch (error) {
    console.error(`Erreur de chargement du composant ${componentName}:`, error);
  }
}

// Charger tous les composants au chargement de la page
document.addEventListener("DOMContentLoaded", async function () {
  // Liste des composants à charger dans l'ordre
  const components = [
    { name: "header", target: "header-placeholder" },
    { name: "hero", target: "hero-placeholder" },
    { name: "intro", target: "intro-placeholder" },
    { name: "about", target: "about-placeholder" },
    { name: "services", target: "services-placeholder" },
    { name: "testimonials", target: "testimonials-placeholder" },
    { name: "faq", target: "faq-placeholder" },
    { name: "newsletter", target: "newsletter-placeholder" },
    { name: "footer", target: "footer-placeholder" },
  ];

  // Charger tous les composants
  for (const component of components) {
    await loadComponent(component.name, component.target);
  }

  // Une fois tous les composants chargés, initialiser le script principal
  if (typeof initializeApp === "function") {
    initializeApp();
  }
});
