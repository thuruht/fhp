import { setState } from '../state';

export function renderHome() {
    const container = document.createElement('div');
    container.className = 'site-root'; // Keeping consistent with App.css

    // Background Video
    const video = document.createElement('video');
    video.className = 'bg-video';
    video.autoplay = true;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    const source = document.createElement('source');
    source.src = '/media/bg.mp4';
    source.type = 'video/mp4';
    video.appendChild(source);
    
    video.addEventListener('loadeddata', () => {
        video.play().catch(() => {});
    });
    
    container.appendChild(video);

    // Video Controls
    const controls = document.createElement('div');
    controls.className = 'video-controls';

    const playBtn = document.createElement('button');
    playBtn.className = 'control-btn';
    playBtn.textContent = '❚❚';
    playBtn.title = 'Pause';
    let isPlaying = true;
    playBtn.onclick = () => {
        if (isPlaying) {
            video.pause();
            playBtn.textContent = '▶';
            playBtn.title = 'Play';
        } else {
            video.play();
            playBtn.textContent = '❚❚';
            playBtn.title = 'Pause';
        }
        isPlaying = !isPlaying;
    };
    controls.appendChild(playBtn);

    const infoBtn = document.createElement('a');
    infoBtn.href = '#reel-info';
    infoBtn.className = 'control-btn';
    infoBtn.textContent = 'ⓘ';
    infoBtn.title = 'About this reel';
    controls.appendChild(infoBtn);

    container.appendChild(controls);

    // Overlay
    const overlay = document.createElement('div');
    overlay.className = 'overlay';

    const logo = document.createElement('img');
    logo.src = '/horizontal_logo.png';
    logo.alt = 'Flaming Heart Productions';
    logo.className = 'logo';
    overlay.appendChild(logo);

    const body = document.createElement('p');
    body.className = 'body';
    body.innerHTML = `single-origin cold brew meets hand-crafted 16mm film grain. we curate immersive visual experiences for brands who bicycle commute to farmer's markets. <a href="#portfolio">peep the aesthetic</a> before it was cool.`;
    overlay.appendChild(body);

    const nav = document.createElement('nav');
    const createNavBtn = (text: string, page: any) => {
        const btn = document.createElement('button');
        btn.textContent = text;
        btn.onclick = () => setState({ page });
        return btn;
    };
    nav.appendChild(createNavBtn('VIDEOS', 'videos'));
    nav.appendChild(createNavBtn('STILLS', 'stills'));
    nav.appendChild(createNavBtn('CONTACT', 'contact'));
    overlay.appendChild(nav);

    // Announcements Ticker
    const ticker = document.createElement('div');
    ticker.className = 'announcements-ticker';
    ticker.style.display = 'none'; // Hide initially

    const tickerHeader = document.createElement('h3');
    tickerHeader.className = 'ticker-header';
    tickerHeader.textContent = 'LATEST';
    ticker.appendChild(tickerHeader);

    // Fetch Announcements
    fetch('/api/announcements')
        .then(res => res.json())
        .then(data => {
            const announcements = data.slice(0, 3);
            if (announcements.length > 0) {
                ticker.style.display = 'block';
                announcements.forEach((a: any) => {
                    const item = document.createElement('div');
                    item.className = 'announcement-item';

                    const title = document.createElement('span');
                    title.className = 'announcement-title';
                    title.textContent = a.title;
                    item.appendChild(title);

                    const content = document.createElement('div');
                    content.className = 'announcement-content';
                    content.innerHTML = a.content;
                    item.appendChild(content);

                    ticker.appendChild(item);
                });
            }
        })
        .catch(() => {});

    overlay.appendChild(ticker);
    container.appendChild(overlay);

    // Admin Link
    const adminBtn = document.createElement('button');
    adminBtn.className = 'admin-link';
    adminBtn.title = 'Admin';
    adminBtn.textContent = '⚙';
    adminBtn.onclick = () => setState({ page: 'admin' });
    container.appendChild(adminBtn);

    return container;
}
