(async function () {
  const container = document.getElementById('post-content');
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const slug = params.get('slug');
  if (!slug) {
    container.innerHTML = '<p class="post-error">Article introuvable.</p>';
    return;
  }

  const query = `*[_type == "post" && slug.current == $slug][0]{
    title,
    publishedAt,
    mainImage,
    excerpt,
    body,
    references
  }`;

  try {
    const post = await Sanity.fetchQuery(query, {slug});
    if (!post) {
      container.innerHTML = '<p class="post-error">Article introuvable.</p>';
      return;
    }

    document.title = `${post.title} - Rachida Blanchard`;

    const mainImg = post.mainImage
      ? `<figure class="post-hero-image"><img src="${Sanity.imageUrl(post.mainImage, {width: 2000})}" alt="${Sanity.escapeHtml(post.mainImage.alt || post.title)}"></figure>`
      : '';

    const date = Sanity.formatDate(post.publishedAt);
    const body = Sanity.renderPortableText(post.body);

    const refsHtml = (post.references && post.references.length)
      ? `
        <section class="post-references">
          <h2>Références</h2>
          <ul>
            ${post.references.map((r) => `
              <li>
                <p>${Sanity.escapeHtml(r.description || '')}</p>
                <a href="${Sanity.escapeHtml(r.linkUrl)}" target="_blank" rel="noopener noreferrer">${Sanity.escapeHtml(r.linkText)}</a>
              </li>
            `).join('')}
          </ul>
        </section>
      `
      : '';

    container.innerHTML = `
      ${mainImg}
      <article class="post">
        <header class="post-header">
          <a class="post-back" href="blog.html">← Retour au blog</a>
          <time class="post-date">${date}</time>
          <h1 class="post-title">${Sanity.escapeHtml(post.title)}</h1>
        </header>
        <div class="post-body">${body}</div>
        ${refsHtml}
      </article>
      <section id="post-related" class="post-related"></section>
    `;

    loadRelated(slug);
  } catch (err) {
    console.error(err);
    container.innerHTML = '<p class="post-error">Impossible de charger l\'article.</p>';
  }

  async function loadRelated(currentSlug) {
    const host = document.getElementById('post-related');
    if (!host) return;
    const q = `*[_type == "post" && defined(slug.current) && slug.current != $slug] | order(publishedAt desc)[0...3]{
      title,
      "slug": slug.current,
      publishedAt,
      excerpt,
      mainImage
    }`;
    try {
      const posts = await Sanity.fetchQuery(q, {slug: currentSlug});
      if (!posts || !posts.length) return;
      host.innerHTML = `
        <h2 class="post-related-title">À lire aussi</h2>
        <div class="post-related-grid">
          ${posts.map((p) => {
            const img = p.mainImage
              ? `<img src="${Sanity.imageUrl(p.mainImage, {width: 800})}" alt="${Sanity.escapeHtml(p.mainImage.alt || p.title)}" loading="lazy">`
              : '';
            return `
              <a class="blog-card" href="post.html?slug=${encodeURIComponent(p.slug)}">
                <div class="blog-card-image">${img}</div>
                <div class="blog-card-body">
                  <time class="blog-card-date">${Sanity.formatDate(p.publishedAt)}</time>
                  <h3 class="blog-card-title">${Sanity.escapeHtml(p.title)}</h3>
                </div>
              </a>
            `;
          }).join('')}
        </div>
      `;
    } catch (e) {
      console.error(e);
    }
  }
})();
