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
