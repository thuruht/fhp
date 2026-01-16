import { setState } from '../state';

export function renderMedia(type: 'video' | 'still') {
    const container = document.createElement('div');
    container.className = 'site-root'; // Root container style

    const page = document.createElement('div');
    page.className = 'page';

    const logo = document.createElement('img');
    logo.src = '/logo.png';
    logo.alt = 'Flaming Heart Productions';
    logo.className = 'page-logo';
    page.appendChild(logo);

    const title = document.createElement('h1');
    title.textContent = type === 'video' ? 'VIDEOS' : 'STILLS';
    page.appendChild(title);

    const content = document.createElement('div');
    content.className = 'content';
    content.textContent = 'Loading...';
    page.appendChild(content);

    // Fetch Content
    const endpoint = type === 'video' ? '/api/videos' : '/api/stills';
    fetch(endpoint)
        .then(res => res.json())
        .then(data => {
            content.innerHTML = ''; // Clear loading text

            if (data.length === 0) {
                content.textContent = `no ${type}s yet`;
                return;
            }

            const grid = document.createElement('div');
            grid.className = 'media-grid';

            data.forEach((item: any) => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'media-item';

                if (type === 'video') {
                    const video = document.createElement('video');
                    video.src = item.mediaUrl;
                    video.controls = true;
                    if (item.thumbnailUrl) {
                        video.poster = item.thumbnailUrl;
                    }
                    itemDiv.appendChild(video);
                } else {
                    const img = document.createElement('img');
                    img.src = item.mediaUrl;
                    img.alt = item.title;
                    itemDiv.appendChild(img);
                }

                const itemTitle = document.createElement('h3');
                itemTitle.textContent = item.title;
                itemDiv.appendChild(itemTitle);

                const itemDesc = document.createElement('p');
                itemDesc.textContent = item.description;
                itemDiv.appendChild(itemDesc);

                grid.appendChild(itemDiv);
            });

            content.appendChild(grid);
        })
        .catch(() => {
            content.textContent = 'Error loading content';
        });

    const backBtn = document.createElement('button');
    backBtn.textContent = 'BACK';
    backBtn.onclick = () => setState({ page: 'home' });
    page.appendChild(backBtn);

    container.appendChild(page);
    return container;
}
