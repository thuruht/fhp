import { setState } from '../state';

// Placeholder for full admin logic, we will expand this in Step 8
export function renderAdmin() {
    const container = document.createElement('div');
    container.className = 'admin-container';

    const logo = document.createElement('img');
    logo.src = '/logo.png';
    logo.alt = 'Flaming Heart Productions';
    logo.className = 'page-logo';
    container.appendChild(logo);

    const title = document.createElement('h1');
    title.textContent = 'ADMIN';
    container.appendChild(title);

    const nav = document.createElement('nav');
    nav.className = 'admin-nav';

    // We will track the local "section" state within this closure or global state?
    // Since we re-render the whole page on global state change, let's keep local state management simple
    // by re-rendering the admin content. But for now, let's just make the buttons.

    // For simplicity in this vanilla implementation, we might want to store 'adminSection' in the global state
    // OR we can just handle it locally by clearing/updating a content div.

    const sections = ['videos', 'stills', 'announcements', 'about', 'bgvideo'];
    let currentSection = 'videos';

    const contentDiv = document.createElement('div');
    contentDiv.id = 'admin-content-area';

    const updateSection = (section: string) => {
        currentSection = section;
        renderAdminContent(contentDiv, section);

        // Update active class on buttons
        Array.from(nav.children).forEach((btn: any) => {
             if (btn.textContent === section.toUpperCase() || (section === 'bgvideo' && btn.textContent === 'BG VIDEO')) {
                 btn.classList.add('active');
             } else {
                 btn.classList.remove('active');
             }
        });
    };

    sections.forEach(section => {
        const btn = document.createElement('button');
        btn.textContent = section === 'bgvideo' ? 'BG VIDEO' : section.toUpperCase();
        btn.onclick = () => updateSection(section);
        if (section === currentSection) btn.classList.add('active');
        nav.appendChild(btn);
    });

    container.appendChild(nav);

    const sectionTitle = document.createElement('h2');
    sectionTitle.className = 'section-title';
    // This title needs to update. Let's handle it inside renderAdminContent or separate?
    // Easier to let renderAdminContent handle the title or clear the area.
    container.appendChild(sectionTitle);

    container.appendChild(contentDiv);

    const backBtn = document.createElement('button');
    backBtn.className = 'back-btn';
    backBtn.textContent = 'LOGOUT & BACK';
    backBtn.onclick = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        setState({ page: 'home', isAuthenticated: false });
    };
    container.appendChild(backBtn);

    // Initial render of content
    renderAdminContent(contentDiv, currentSection);

    return container;
}

import { renderAdminContent } from './admin-content';
