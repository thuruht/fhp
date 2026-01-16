import { createRichTextEditor } from '../components/editor';

// This function updates the inner content of the admin panel based on the selected section
export function renderAdminContent(container: HTMLElement, section: string) {
    container.innerHTML = '';
    const title = container.parentElement?.querySelector('.section-title');
    if (title) title.textContent = `EDITING: ${section}`;

    if (section === 'videos' || section === 'stills') {
        renderMediaSection(container, section);
    } else if (section === 'announcements') {
        renderAnnouncementsSection(container);
    } else if (section === 'about') {
        renderAboutSection(container);
    } else if (section === 'bgvideo') {
        renderBgVideoSection(container);
    }
}

async function renderMediaSection(container: HTMLElement, type: 'videos' | 'stills') {
    const form = document.createElement('form');
    form.className = 'admin-form';

    const inputTitle = document.createElement('input');
    inputTitle.name = 'title';
    inputTitle.placeholder = 'title';
    inputTitle.required = true;
    form.appendChild(inputTitle);

    const inputDesc = document.createElement('textarea');
    inputDesc.name = 'description';
    inputDesc.placeholder = 'description';
    form.appendChild(inputDesc);

    const inputFile = document.createElement('input');
    inputFile.name = 'file';
    inputFile.type = 'file';
    inputFile.accept = type === 'videos' ? 'video/*' : 'image/*';
    inputFile.required = true;
    form.appendChild(inputFile);

    if (type === 'videos') {
        const inputThumb = document.createElement('input');
        inputThumb.name = 'thumbnail';
        inputThumb.type = 'file';
        inputThumb.accept = 'image/*';
        form.appendChild(inputThumb);
    }

    const submitBtn = document.createElement('button');
    submitBtn.type = 'submit';
    submitBtn.textContent = 'CREATE';
    form.appendChild(submitBtn);

    form.onsubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const res = await fetch(`/api/${type}`, {
            method: 'POST',
            body: formData,
        });
        if (res.ok) {
            form.reset();
            loadItems();
        }
    };

    container.appendChild(form);

    const listContainer = document.createElement('div');
    listContainer.className = 'items-list';
    container.appendChild(listContainer);

    const loadItems = async () => {
        listContainer.innerHTML = 'Loading...';
        const res = await fetch(`/api/${type}`);
        const data = await res.json();
        listContainer.innerHTML = '';
        data.forEach((item: any) => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'item';

            const titleSpan = document.createElement('span');
            titleSpan.textContent = item.title;
            itemDiv.appendChild(titleSpan);

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'DELETE';
            deleteBtn.onclick = async () => {
                if (confirm('delete this item?')) {
                    await fetch(`/api/${type}/${item.id}`, { method: 'DELETE' });
                    loadItems();
                }
            };
            itemDiv.appendChild(deleteBtn);

            listContainer.appendChild(itemDiv);
        });
    };

    loadItems();
}

async function renderAnnouncementsSection(container: HTMLElement) {
    const formDiv = document.createElement('div');
    formDiv.className = 'admin-form';

    const inputTitle = document.createElement('input');
    inputTitle.placeholder = 'title';
    formDiv.appendChild(inputTitle);

    let content = '';
    const editor = createRichTextEditor('', (c) => content = c);
    formDiv.appendChild(editor.element);

    const createBtn = document.createElement('button');
    createBtn.textContent = 'CREATE';
    createBtn.style.marginTop = '1rem';
    createBtn.onclick = async () => {
        const res = await fetch('/api/announcements', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: inputTitle.value, content })
        });
        if (res.ok) {
            inputTitle.value = '';
            content = '';
            editor.setHTML('');
            loadItems();
        }
    };
    formDiv.appendChild(createBtn);

    container.appendChild(formDiv);

    const listContainer = document.createElement('div');
    listContainer.className = 'items-list';
    container.appendChild(listContainer);

    const loadItems = async () => {
        listContainer.innerHTML = 'Loading...';
        const res = await fetch('/api/announcements');
        const data = await res.json();
        listContainer.innerHTML = '';
        data.forEach((item: any) => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'item';

            const titleSpan = document.createElement('span');
            titleSpan.textContent = item.title;
            itemDiv.appendChild(titleSpan);

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'DELETE';
            deleteBtn.onclick = async () => {
                if (confirm('delete this item?')) {
                    await fetch(`/api/announcements/${item.id}`, { method: 'DELETE' });
                    loadItems();
                }
            };
            itemDiv.appendChild(deleteBtn);

            listContainer.appendChild(itemDiv);
        });
    };

    loadItems();
}

async function renderAboutSection(container: HTMLElement) {
    const formDiv = document.createElement('div');
    formDiv.className = 'admin-form';

    let content = '';

    // Fetch existing content
    const res = await fetch('/api/about');
    const data = await res.json();
    const initialContent = data?.content || '';
    content = initialContent;

    const editor = createRichTextEditor(initialContent, (c) => content = c);
    formDiv.appendChild(editor.element);

    const updateBtn = document.createElement('button');
    updateBtn.textContent = 'UPDATE';
    updateBtn.style.marginTop = '1rem';
    updateBtn.onclick = async () => {
        const res = await fetch('/api/about', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content })
        });
        if (res.ok) alert('about updated');
    };
    formDiv.appendChild(updateBtn);

    container.appendChild(formDiv);
}

function renderBgVideoSection(container: HTMLElement) {
    const form = document.createElement('form');
    form.className = 'admin-form';

    const inputFile = document.createElement('input');
    inputFile.name = 'file';
    inputFile.type = 'file';
    inputFile.accept = 'video/*';
    inputFile.required = true;
    form.appendChild(inputFile);

    const submitBtn = document.createElement('button');
    submitBtn.type = 'submit';
    submitBtn.textContent = 'UPLOAD BG VIDEO';
    form.appendChild(submitBtn);

    form.onsubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const res = await fetch('/api/bgvideo', { method: 'POST', body: formData });
        if (res.ok) alert('background video updated');
    };

    container.appendChild(form);
}
