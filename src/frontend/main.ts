import './index.css';
import './App.css';
import './Admin.css';
import './Login.css';
import gsap from 'gsap';

import { getState, subscribe, setState } from './state';
import { renderHome } from './views/home';
import { renderMedia } from './views/media';
import { renderContact } from './views/contact';
import { renderLogin } from './views/login';
import { renderAdmin } from './views/admin';

const app = document.getElementById('app')!;

const container = document.createElement('div');
container.className = 'site-root';
app.appendChild(container);

const contentArea = document.createElement('div');
contentArea.style.width = '100%';
container.appendChild(contentArea);

const icon = document.createElement('img');
icon.src = '/icon.png';
icon.className = 'footer-icon';
container.appendChild(icon);

gsap.to(icon, {
    rotation: 360,
    duration: 20,
    repeat: -1,
    ease: "none"
});
gsap.to(icon, {
    scale: 1.1,
    duration: 2,
    repeat: -1,
    yoyo: true,
    ease: "power1.inOut"
});
gsap.to(icon, {
    x: -20,
    y: -20,
    duration: 3,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut"
});

icon.addEventListener('mouseenter', () => {
        gsap.to(icon, {
        rotation: "+=720",
        scale: 1.3,
        duration: 0.6,
        ease: "elastic.out(1, 0.3)"
        });
});
icon.addEventListener('mouseleave', () => {
    gsap.to(icon, {
        scale: 1,
        duration: 0.4,
        ease: "power2.out"
        });
});

// Social Footer
const socialFooter = document.createElement('div');
socialFooter.className = 'social-footer';
container.appendChild(socialFooter);

const instagramLink = document.createElement('a');
instagramLink.href = 'https://www.instagram.com/flaming_heart_productions';
instagramLink.target = '_blank';
instagramLink.className = 'control-btn';
instagramLink.title = 'Instagram';

const instagramIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
instagramIcon.setAttribute('width', '20');
instagramIcon.setAttribute('height', '20');
instagramIcon.setAttribute('viewBox', '0 0 24 24');
instagramIcon.setAttribute('fill', 'none');
instagramIcon.setAttribute('stroke', 'currentColor');
instagramIcon.setAttribute('stroke-width', '2');
instagramIcon.setAttribute('stroke-linecap', 'round');
instagramIcon.setAttribute('stroke-linejoin', 'round');
instagramIcon.innerHTML = `<rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>`;

instagramLink.appendChild(instagramIcon);
socialFooter.appendChild(instagramLink);

function render() {
    const state = getState();
    contentArea.innerHTML = '';

    let pageContent: HTMLElement;

    switch (state.page) {
        case 'home':
            pageContent = renderHome();
            break;
        case 'videos':
            pageContent = renderMedia('video');
            break;
        case 'stills':
            pageContent = renderMedia('still');
            break;
        case 'contact':
            pageContent = renderContact();
            break;
        case 'admin':
            if (!state.isAuthenticated) {
                 pageContent = document.createElement('div');
                 pageContent.textContent = 'Redirecting to Login...';
                 setTimeout(() => setState({ page: 'login' }), 0);
            } else {
                 pageContent = renderAdmin();
            }
            break;
        case 'login':
            pageContent = renderLogin();
            break;
        default:
            pageContent = document.createElement('div');
            pageContent.textContent = '404 Not Found';
    }

    contentArea.appendChild(pageContent);
}

render();

subscribe(render);

(window as any).setState = setState;
