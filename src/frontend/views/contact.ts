import { setState } from '../state';

export function renderContact() {
    const container = document.createElement('div');
    container.className = 'site-root';

    const page = document.createElement('div');
    page.className = 'page';

    const logo = document.createElement('img');
    logo.src = '/logo.png';
    logo.alt = 'Flaming Heart Productions';
    logo.className = 'page-logo';
    page.appendChild(logo);

    const title = document.createElement('h1');
    title.textContent = 'CONTACT';
    page.appendChild(title);

    const content = document.createElement('div');
    content.className = 'content';
    content.textContent = 'contact information will go here';
    page.appendChild(content);

    const backBtn = document.createElement('button');
    backBtn.textContent = 'BACK';
    backBtn.onclick = () => setState({ page: 'home' });
    page.appendChild(backBtn);

    container.appendChild(page);
    return container;
}
