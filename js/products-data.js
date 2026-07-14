// ---------- Shared product data layer ----------
// Exposes window.PromerCatalog for use on any page.
const PromerCatalog = (() => {
  const DATA_URL = 'data/products.json';
  let cache = null;

  async function getAll() {
    if (cache) return cache;
    const res = await fetch(DATA_URL+"https://cors-anywhere.herokuapp.com/");
    if (!res.ok) throw new Error(`Failed to load products.json (${res.status})`);
    cache = await res.json();
    return cache;
  }

  async function getById(id) {
    const products = await getAll();
    return products.find(p => p.id === id) || null;
  }

  function formatPrice(amount, currency = 'INR') {
    const symbol = currency === 'INR' ? '₹' : currency + ' ';
    return `${symbol}${amount.toLocaleString('en-IN')}`;
  }

  function starRating(rating) {
    const full = Math.round(rating);
    return '★'.repeat(full) + '☆'.repeat(5 - full);
  }

  function badgeFor(product) {
    if (!product.inStock) return { label: 'Sold Out', className: 'badge-sold-out' };
    if (product.isNew) return { label: 'New', className: 'badge-new' };
    if (product.compareAtPrice) return { label: 'Sale', className: 'badge-sale' };
    if (product.isTrending) return { label: 'Trending', className: 'badge-trending' };
    return null;
  }

  function cardHTML(product) {
    const badge = badgeFor(product);
    const price = formatPrice(product.price, product.currency);
    const compareAt = product.compareAtPrice
      ? `<span class="compare-price">${formatPrice(product.compareAtPrice, product.currency)}</span>`
      : '';
    return `
      <a class="product-card" href="product.html?id=${encodeURIComponent(product.id)}">
        ${badge ? `<span class="card-badge ${badge.className}">${badge.label}</span>` : ''}
        <span class="price-tag">${price} ${compareAt}</span>
        <img src="${product.images[0]}" alt="${product.name}" loading="lazy">
        <div class="overlay-content">
          <h3>${product.name}</h3>
          <p class="overlay-desc">${product.shortDescription}</p>
          <span class="detail-btn">View Details</span>
        </div>
      </a>`;
  }

  function renderGrid(container, products, emptyMessage = 'No products match those filters yet.') {
    if (!products.length) {
      container.innerHTML = `<p class="empty-state">${emptyMessage}</p>`;
      return;
    }
    container.innerHTML = products.map(cardHTML).join('');
  }

  return { getAll, getById, formatPrice, starRating, badgeFor, cardHTML, renderGrid };
})();
