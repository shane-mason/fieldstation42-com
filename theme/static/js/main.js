// Mobile nav toggle
const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.site-nav');

if (toggle && nav) {
    toggle.addEventListener('click', () => {
        nav.classList.toggle('open');
    });
}

// TV screen channel cycling
const tvChannels = [
    { channel: 'CH 07 — RETRO TV',     show: 'The Twilight Zone',            time: '10:30 PM — Now Playing' },
    { channel: 'CH 13 — ADULT SWIM',   show: 'Aqua Teen Hunger Force',        time: '1:00 AM — Now Playing' },
    { channel: 'CH 22 — NIGHT OWL',    show: 'Mystery Science Theater 3000',  time: '11:00 PM — Now Playing' },
    { channel: 'CH 13 — ADULT SWIM',   show: 'Space Ghost Coast to Coast',    time: '12:30 AM — Now Playing' },
    { channel: 'CH 04 — CLASSICS',     show: 'Perry Mason',                   time: '9:00 PM — Now Playing' },
    { channel: 'CH 13 — ADULT SWIM',   show: 'Robot Chicken',                 time: '11:30 PM — Now Playing' },
    { channel: 'CH 31 — INDIE 42',     show: 'Night Flight',                  time: '2:00 AM — Now Playing' },
    { channel: 'CH 13 — ADULT SWIM',   show: 'Tim & Eric Awesome Show',       time: '12:00 AM — Now Playing' },
    { channel: 'CH 07 — RETRO TV',     show: 'The Outer Limits',              time: '11:00 PM — Now Playing' },
    { channel: 'CH 19 — MOVIE CHANNEL', show: 'Blade Runner',                 time: '8:00 PM — Now Playing' },
];

const tvContent = document.getElementById('tv-screen-content');
if (tvContent) {
    const tvChannel = document.getElementById('tv-channel');
    const tvShow    = document.getElementById('tv-now-playing');
    const tvTime    = document.getElementById('tv-show-time');
    let current = 0;

    setInterval(() => {
        current = (current + 1) % tvChannels.length;
        const next = tvChannels[current];

        tvContent.classList.add('switching');
        setTimeout(() => {
            tvChannel.textContent = next.channel;
            tvShow.textContent    = next.show;
            tvTime.textContent    = next.time;
            tvContent.classList.remove('switching');
        }, 200);
    }, 5000);
}

// Heading anchor links
document.querySelectorAll('.docs-content h1, .docs-content h2, .docs-content h3').forEach(heading => {
    if (!heading.id) return;
    const anchor = document.createElement('a');
    anchor.className = 'heading-anchor';
    anchor.href = '#' + heading.id;
    anchor.setAttribute('aria-label', 'Link to this section');
    anchor.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>';
    anchor.addEventListener('click', e => {
        e.preventDefault();
        const url = location.origin + location.pathname + '#' + heading.id;
        navigator.clipboard.writeText(url).then(() => {
            anchor.classList.add('copied');
            setTimeout(() => anchor.classList.remove('copied'), 2000);
        });
        history.pushState(null, '', '#' + heading.id);
    });
    heading.appendChild(anchor);
});

// Highlight active sidebar link based on current path
const currentPath = window.location.pathname.replace(/\/$/, '');
document.querySelectorAll('.sidebar-nav a').forEach(link => {
    const linkPath = link.getAttribute('href').replace(/\/$/, '');
    if (linkPath === currentPath) {
        link.classList.add('active');
    }
});
