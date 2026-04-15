// Client Sanity minimaliste (pas de dépendance, utilisable sur GitHub Pages)
(function (global) {
  const PROJECT_ID = 'dkyyi6l8';
  const DATASET = 'production';
  const API_VERSION = '2024-01-01';

  const API_URL = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/query/${DATASET}`;
  const CDN_URL = `https://cdn.sanity.io/images/${PROJECT_ID}/${DATASET}`;

  async function fetchQuery(query, params = {}) {
    const url = new URL(API_URL);
    url.searchParams.set('query', query);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(`$${key}`, JSON.stringify(value));
    });
    const res = await fetch(url.toString());
    if (!res.ok) throw new Error(`Sanity fetch failed: ${res.status}`);
    const data = await res.json();
    return data.result;
  }

  // Transforme une référence d'asset Sanity en URL CDN
  // ex: "image-abc123-1920x1080-jpg" -> ".../abc123-1920x1080.jpg"
  function imageUrl(source, options = {}) {
    if (!source || !source.asset || !source.asset._ref) return '';
    const ref = source.asset._ref;
    const parts = ref.split('-');
    // parts = ["image", "<id>", "<dims>", "<ext>"]
    const [, id, dims, ext] = parts;
    let url = `${CDN_URL}/${id}-${dims}.${ext}`;
    const query = [];
    if (options.width) query.push(`w=${options.width}`);
    if (options.height) query.push(`h=${options.height}`);
    if (options.fit) query.push(`fit=${options.fit}`);
    query.push('auto=format');
    url += `?${query.join('&')}`;
    return url;
  }

  // Rendu basique de Portable Text en HTML
  function renderPortableText(blocks) {
    if (!Array.isArray(blocks)) return '';
    let html = '';
    let listOpen = null; // 'ul' | 'ol' | null

    const closeList = () => {
      if (listOpen) {
        html += `</${listOpen}>`;
        listOpen = null;
      }
    };

    blocks.forEach((block) => {
      // Image inline
      if (block._type === 'image') {
        closeList();
        const src = imageUrl(block, {width: 1200});
        const alt = escapeHtml(block.alt || '');
        const caption = block.caption ? `<figcaption>${escapeHtml(block.caption)}</figcaption>` : '';
        html += `<figure class="post-image"><img src="${src}" alt="${alt}" loading="lazy">${caption}</figure>`;
        return;
      }

      if (block._type !== 'block') return;

      const children = (block.children || [])
        .map((child) => renderSpan(child, block.markDefs || []))
        .join('');

      // Listes
      if (block.listItem) {
        const listTag = block.listItem === 'number' ? 'ol' : 'ul';
        if (listOpen !== listTag) {
          closeList();
          html += `<${listTag}>`;
          listOpen = listTag;
        }
        html += `<li>${children}</li>`;
        return;
      }
      closeList();

      const style = block.style || 'normal';
      if (style === 'h2') html += `<h2>${children}</h2>`;
      else if (style === 'h3') html += `<h3>${children}</h3>`;
      else if (style === 'h4') html += `<h4>${children}</h4>`;
      else if (style === 'blockquote') html += `<blockquote>${children}</blockquote>`;
      else html += `<p>${children}</p>`;
    });

    closeList();
    return html;
  }

  function renderSpan(child, markDefs) {
    let text = escapeHtml(child.text || '');
    const marks = child.marks || [];
    marks.forEach((mark) => {
      if (mark === 'strong') text = `<strong>${text}</strong>`;
      else if (mark === 'em') text = `<em>${text}</em>`;
      else if (mark === 'underline') text = `<u>${text}</u>`;
      else if (mark === 'code') text = `<code>${text}</code>`;
      else {
        const def = markDefs.find((d) => d._key === mark);
        if (def && def._type === 'link') {
          const href = escapeHtml(def.href || '#');
          const target = def.blank ? ' target="_blank" rel="noopener noreferrer"' : '';
          text = `<a href="${href}"${target}>${text}</a>`;
        }
      }
    });
    return text;
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function formatDate(iso) {
    if (!iso) return '';
    try {
      return new Date(iso).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return '';
    }
  }

  global.Sanity = {fetchQuery, imageUrl, renderPortableText, escapeHtml, formatDate};
})(window);
