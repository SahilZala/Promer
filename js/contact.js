// ---------- Contact form ----------
const form = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !message) {
      formStatus.textContent = 'Please fill in your name, email, and message.';
      formStatus.className = 'form-status error';
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      formStatus.textContent = 'That email address doesn\u2019t look right — please check it.';
      formStatus.className = 'form-status error';
      return;
    }

    // No backend is wired up yet — this simulates a successful send.
    formStatus.textContent = `Thanks, ${name.split(' ')[0]} — we\u2019ll get back to you at ${email} within one business day.`;
    formStatus.className = 'form-status success';
    form.reset();
  });
}
