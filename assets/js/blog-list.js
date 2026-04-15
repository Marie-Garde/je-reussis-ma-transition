(async function () {
  const container = document.getElementById('blog-list');
  if (!container) return;

  const PAGE_SIZE = 6;

  const query = `*[_type == "post" && defined(slug.current)] | order(publishedAt desc){
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    excerpt,
    mainImage,
    body
  }`;

  function buildExcerpt(post) {
    if (post.excerpt && post.excerpt.trim()) return post.excerpt;
    if (!Array.isArray(post.body)) return '';
    const text = post.body
      .filter((b) => b._type === 'block' && Array.isArray(b.children))
      .map((b) => b.children.map((c) => c.text || '').join(''))
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();
    if (!text) return '';
    const words = text.split(' ');
    if (words.length <= 20) return text;
    return words.slice(0, 20).join(' ') + '...';
  }

  function renderCard(post) {
    const img = post.mainImage
      ? `<img src="${Sanity.imageUrl(post.mainImage, {width: 800})}" alt="${Sanity.escapeHtml(post.mainImage.alt || post.title)}" loading="lazy">`
      : '';
    const date = Sanity.formatDate(post.publishedAt);
    const excerptText = buildExcerpt(post);
    const excerpt = excerptText ? `<p class="blog-card-excerpt">${Sanity.escapeHtml(excerptText)}</p>` : '';
    return `
      <a class="blog-card" href="post.html?slug=${encodeURIComponent(post.slug)}">
        <div class="blog-card-image">${img}</div>
        <div class="blog-card-body">
          <time class="blog-card-date">${date}</time>
          <h2 class="blog-card-title">${Sanity.escapeHtml(post.title)}</h2>
          ${excerpt}
          <span class="blog-card-link">Lire l'article →</span>
        </div>
      </a>
    `;
  }

  function ensurePaginationHost() {
    let host = document.getElementById('blog-pagination');
    if (!host) {
      host = document.createElement('nav');
      host.id = 'blog-pagination';
      host.className = 'blog-pagination';
      host.setAttribute('aria-label', 'Pagination du blog');
      container.insertAdjacentElement('afterend', host);
    }
    return host;
  }

  function getCurrentPage(totalPages) {
    const p = parseInt(new URLSearchParams(window.location.search).get('page'), 10);
    if (isNaN(p) || p < 1) return 1;
    return Math.min(p, totalPages);
  }

  function renderPagination(host, current, total) {
    if (total <= 1) {
      host.innerHTML = '';
      return;
    }
    const link = (page, label, {disabled = false, active = false} = {}) => {
      const cls = ['blog-pagination-link'];
      if (active) cls.push('is-active');
      if (disabled) cls.push('is-disabled');
      if (disabled) return `<span class="${cls.join(' ')}">${label}</span>`;
      return `<a class="${cls.join(' ')}" href="?page=${page}">${label}</a>`;
    };
    const items = [];
    items.push(link(current - 1, '←', {disabled: current === 1}));
    for (let i = 1; i <= total; i++) {
      items.push(link(i, i, {active: i === current}));
    }
    items.push(link(current + 1, '→', {disabled: current === total}));
    host.innerHTML = items.join('');
  }

  try {
    const posts = await Sanity.fetchQuery(query);
    if (!posts || posts.length === 0) {
      container.innerHTML = '<p class="blog-empty-message">Aucun article pour l\'instant.</p>';
      return;
    }

    const totalPages = Math.ceil(posts.length / PAGE_SIZE);
    const current = getCurrentPage(totalPages);
    const start = (current - 1) * PAGE_SIZE;
    const pagePosts = posts.slice(start, start + PAGE_SIZE);

    container.innerHTML = pagePosts.map(renderCard).join('');
    renderPagination(ensurePaginationHost(), current, totalPages);
  } catch (err) {
    console.error(err);
    container.innerHTML = '<p class="blog-empty-message">Impossible de charger les articles pour le moment.</p>';
  }
})();
