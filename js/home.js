// ---------- Hero carousel ----------
const carousel = document.getElementById('carousel');
const dots = document.querySelectorAll('.dot');
let slideIndex = 0;
let autoplayId;

function goToSlide(i) {
  slideIndex = i;
  carousel.style.transform = `translateX(-${slideIndex * 100}%)`;
  dots.forEach(d => d.classList.remove('active'));
  dots[slideIndex].classList.add('active');
}

function autoSlide() {
  goToSlide((slideIndex + 1) % dots.length);
}

function startAutoplay() { autoplayId = setInterval(autoSlide, 3500); }
function stopAutoplay() { clearInterval(autoplayId); }

if (carousel && dots.length) {
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { goToSlide(i); stopAutoplay(); startAutoplay(); });
  });
  startAutoplay();
  const wrapper = carousel.closest('.carousel-wrapper');
  wrapper.addEventListener('mouseenter', stopAutoplay);
  wrapper.addEventListener('mouseleave', startAutoplay);
}

// ---------- Featured products ----------
const featuredGrid = document.getElementById('featured-grid');

if (featuredGrid) {
  PromerCatalog.getAll()
    .then(products => {
      const featured = products.filter(p => p.isFeatured).slice(0, 6);
      PromerCatalog.renderGrid(featuredGrid, featured);
    })
    .catch(err => {
      featuredGrid.innerHTML = `<p class="empty-state">Couldn't load products right now. Please refresh.</p>`;
      console.error(err);
    });
}
