// ---------- Product detail page ----------
const detailRoot = document.getElementById('product-detail');
const relatedGrid = document.getElementById('related-grid');
const toast = document.getElementById('toast');

function getIdFromURL() {
  return new URLSearchParams(window.location.search).get('id');
}

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2200);
}

function renderNotFound() {
  detailRoot.innerHTML = `
    <div class="not-found">
      <h2>We couldn't find that product</h2>
      <p>It may have sold out permanently or the link is out of date.</p>
      <a class="btn btn-primary" href="products.html">Back to all products</a>
    </div>`;
}

function renderProduct(product) {
  document.title = `${product.name} | Promer`;

  const price = PromerCatalog.formatPrice(product.price, product.currency);
  const compareAt = product.compareAtPrice
    ? `<span class="compare-price large">${PromerCatalog.formatPrice(product.compareAtPrice, product.currency)}</span>`
    : '';

  const thumbs = product.images.map((src, i) => `
    <button class="thumb ${i === 0 ? 'active' : ''}" data-src="${src}" aria-label="View image ${i + 1}">
      <img src="${src}" alt="${product.name} thumbnail ${i + 1}">
    </button>`).join('');

  const colorSwatches = product.colors.map((c, i) => `
    <button class="swatch ${i === 0 ? 'active' : ''}" style="background:${c.hex}" data-color="${c.name}" title="${c.name}"></button>
  `).join('');

  const sizePills = product.sizes.map((s, i) => `
    <button class="size-pill ${i === 0 ? 'active' : ''}" data-size="${s}">${s}</button>
  `).join('');

  const careList = product.care.map(item => `<li>${item}</li>`).join('');

  detailRoot.innerHTML = `
    <nav class="breadcrumb">
      <a href="index.html">Home</a> / <a href="products.html">Shop</a> /
      <a href="products.html?type=${product.type}">${product.type === 'tshirt' ? 'T-Shirts' : 'Socks'}</a> /
      <span>${product.name}</span>
    </nav>

    <div class="product-layout">
      <div class="gallery">
        <div class="gallery-main">
          <img id="gallery-main-img" src="${product.images[0]}" alt="${product.name}">
        </div>
        <div class="gallery-thumbs">${thumbs}</div>
      </div>

      <div class="product-info">
        <p class="eyebrow">${product.sku} · ${product.categories.join(' · ')}</p>
        <h1>${product.name}</h1>
        <div class="rating-row">
          <span class="stars">${PromerCatalog.starRating(product.rating)}</span>
          <span class="rating-value">${product.rating.toFixed(1)}</span>
          <span class="review-count">(${product.reviewCount} reviews)</span>
        </div>

        <div class="price-row">
          <span class="price large">${price}</span>
          ${compareAt}
        </div>

        <p class="product-desc">${product.description}</p>

        <div class="option-group">
          <p class="option-label">Color</p>
          <div class="swatch-row">${colorSwatches}</div>
        </div>

        <div class="option-group">
          <p class="option-label">Size</p>
          <div class="size-row">${sizePills}</div>
        </div>

        <div class="qty-cart-row">
          <div class="qty-stepper">
            <button id="qty-minus" aria-label="Decrease quantity">&minus;</button>
            <span id="qty-value">1</span>
            <button id="qty-plus" aria-label="Increase quantity">&plus;</button>
          </div>
          <button id="add-to-cart" class="btn btn-primary" ${product.inStock ? '' : 'disabled'}>
            ${product.inStock ? 'Add to Cart' : 'Sold Out'}
          </button>
        </div>

        <p class="stock-note">${product.inStock ? `${product.stock} in stock` : 'Currently unavailable'}</p>

        <details class="accordion" open>
          <summary>Material &amp; Care</summary>
          <p>${product.material}</p>
          <ul>${careList}</ul>
        </details>
        <details class="accordion">
          <summary>Shipping &amp; Returns</summary>
          <p>Free shipping on orders over ₹999. Dispatched within 24 hours from our Mumbai warehouse. 7-day easy returns, no forms.</p>
        </details>
      </div>
    </div>`;

  // Gallery thumbnail swap
  detailRoot.querySelectorAll('.thumb').forEach(btn => {
    btn.addEventListener('click', () => {
      document.getElementById('gallery-main-img').src = btn.dataset.src;
      detailRoot.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // Swatch / size selection
  detailRoot.querySelectorAll('.swatch').forEach(btn => {
    btn.addEventListener('click', () => {
      detailRoot.querySelectorAll('.swatch').forEach(s => s.classList.remove('active'));
      btn.classList.add('active');
    });
  });
  detailRoot.querySelectorAll('.size-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      detailRoot.querySelectorAll('.size-pill').forEach(s => s.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // Quantity stepper
  let qty = 1;
  const qtyValue = document.getElementById('qty-value');
  document.getElementById('qty-minus').addEventListener('click', () => {
    qty = Math.max(1, qty - 1);
    qtyValue.textContent = qty;
  });
  document.getElementById('qty-plus').addEventListener('click', () => {
    qty = Math.min(product.stock, qty + 1);
    qtyValue.textContent = qty;
  });

  // Add to cart (simulated — no backend/cart storage wired up yet)
  const addBtn = document.getElementById('add-to-cart');
  if (addBtn && product.inStock) {
    addBtn.addEventListener('click', () => {
      showToast(`Added ${qty} × ${product.name} to cart`);
    });
  }

  renderRelated(product);
}

async function renderRelated(product) {
  if (!relatedGrid) return;
  const all = await PromerCatalog.getAll();
  const related = all
    .filter(p => p.id !== product.id && p.type === product.type)
    .slice(0, 4);
  PromerCatalog.renderGrid(relatedGrid, related, '');
}

const id = getIdFromURL();
if (!id) {
  renderNotFound();
} else {
  PromerCatalog.getById(id)
    .then(product => (product ? renderProduct(product) : renderNotFound()))
    .catch(err => {
      renderNotFound();
      console.error(err);
    });
}
