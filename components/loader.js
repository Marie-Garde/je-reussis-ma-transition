async function loadComponent(name, targetId) {
  try {
    const res = await fetch(`components/${name}.html`);
    if (!res.ok) throw new Error(`Failed to load ${name}`);
    const target = document.getElementById(targetId);
    if (target) target.innerHTML = await res.text();
  } catch (err) {
    console.error(err);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const components = [
    { name: "header", target: "header-placeholder" },
    { name: "hero", target: "hero-placeholder" },
    { name: "intro", target: "intro-placeholder" },
    { name: "observation", target: "observation-placeholder" },
    { name: "about", target: "about-placeholder" },
    { name: "solution", target: "solution-placeholder" },
    { name: "services", target: "services-placeholder" },
    { name: "testimonials", target: "testimonials-placeholder" },
    { name: "faq", target: "faq-placeholder" },
    { name: "newsletter", target: "newsletter-placeholder" },
    { name: "footer", target: "footer-placeholder" },
  ];

  for (const c of components) {
    await loadComponent(c.name, c.target);
  }

  if (typeof initializeApp === "function") initializeApp();
});
