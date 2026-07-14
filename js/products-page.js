// ---------- All Products page ----------
const grid = document.getElementById('products-grid');
const typeTabs = document.querySelectorAll('.filter-tab');
const searchInput = document.getElementById('product-search');
const sortSelect = document.getElementById('product-sort');
const resultCount = document.getElementById('result-count');

let allProducts = [];
let state = {
  type: 'all',
  query: '',
  sort: 'featured',
  trendingOnly: false
};

function readInitialStateFromURL() {
  const params = new URLSearchParams(window.location.search);
  if (params.get('type')) state.type = params.get('type');
  if (params.get('trending') === 'true') state.trendingOnly = true;
}

function applyFilters() {
  let result = [...allProducts];

  if (state.type !== 'all') {
    result = result.filter(p => p.type === state.type);
  }

  if (state.trendingOnly) {
    result = result.filter(p => p.isTrending);
  }

  if (state.query.trim()) {
    const q = state.query.trim().toLowerCase();
    result = result.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.shortDescription.toLowerCase().includes(q) ||
      p.categories.some(c => c.toLowerCase().includes(q)) ||
      p.tags.some(t => t.toLowerCase().includes(q))
    );
  }

  switch (state.sort) {
    case 'price-asc':
      result.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      result.sort((a, b) => b.price - a.price);
      break;
    case 'rating':
      result.sort((a, b) => b.rating - a.rating);
      break;
    default:
      result.sort((a, b) => (b.isFeatured === a.isFeatured ? 0 : b.isFeatured ? 1 : -1));
  }

  PromerCatalog.renderGrid(grid, result, 'No products match your search or filters. Try clearing them.');
  if (resultCount) {
    resultCount.textContent = `${result.length} product${result.length === 1 ? '' : 's'}`;
  }
}

function setActiveTab() {
  typeTabs.forEach(tab => {
    tab.classList.toggle('active', tab.dataset.type === state.type);
  });
}

typeTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    state.type = tab.dataset.type;
    state.trendingOnly = false;
    setActiveTab();
    applyFilters();
  });
});

if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    state.query = e.target.value;
    applyFilters();
  });
}

if (sortSelect) {
  sortSelect.addEventListener('change', (e) => {
    state.sort = e.target.value;
    applyFilters();
  });
}

readInitialStateFromURL();
setActiveTab();

PromerCatalog.getAll()
  .then(products => {
    allProducts = products;
    applyFilters();
  })
  .catch(err => {
    grid.innerHTML = `<p class="empty-state">Couldn't load products right now. Please refresh.</p>`;
    console.error(err);
  });
