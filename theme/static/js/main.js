// Mobile nav toggle
const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.site-nav');

if (toggle && nav) {
    toggle.addEventListener('click', () => {
        nav.classList.toggle('open');
    });
}

// Highlight active sidebar link based on current path
const currentPath = window.location.pathname.replace(/\/$/, '');
document.querySelectorAll('.sidebar-nav a').forEach(link => {
    const linkPath = link.getAttribute('href').replace(/\/$/, '');
    if (linkPath === currentPath) {
        link.classList.add('active');
    }
});
