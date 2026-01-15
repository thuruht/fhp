import "./App.css";
import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import Admin from "./Admin";
import Login from "./Login";

function App() {
  const [page, setPage] = useState("home");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [stills, setStills] = useState<any[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    fetch('/api/announcements')
      .then(res => res.json())
      .then(data => setAnnouncements(data.slice(0, 3)))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (page === 'videos') {
      fetch('/api/videos').then(res => res.json()).then(setVideos).catch(() => {});
    } else if (page === 'stills') {
      fetch('/api/stills').then(res => res.json()).then(setStills).catch(() => {});
    }
  }, [page]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const iconRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (iconRef.current) {
      gsap.to(iconRef.current, {
        rotation: 360,
        duration: 20,
        repeat: -1,
        ease: "none"
      });
      gsap.to(iconRef.current, {
        scale: 1.1,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
      });
      gsap.to(iconRef.current, {
        x: -20,
        y: -20,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }
  }, []);

  const handleIconHover = () => {
    if (iconRef.current) {
      gsap.to(iconRef.current, {
        rotation: "+=720",
        scale: 1.3,
        duration: 0.6,
        ease: "elastic.out(1, 0.3)"
      });
    }
  };

  const handleIconLeave = () => {
    if (iconRef.current) {
      gsap.to(iconRef.current, {
        scale: 1,
        duration: 0.4,
        ease: "power2.out"
      });
    }
  };

  if (page === "admin" && !isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} onCancel={() => setPage("home")} />;
  }

  if (page === "admin") {
    return <Admin onBack={() => { setPage("home"); setIsAuthenticated(false); }} />;
  }

  return (
    <div className="site-root">
      {page === "home" && (
        <>
          <video ref={videoRef} className="bg-video" autoPlay muted loop playsInline>
            <source src="/media/bg.mp4" type="video/mp4" />
          </video>
          <div className="video-controls">
            <button onClick={togglePlay} className="control-btn" title={isPlaying ? "Pause" : "Play"}>
              {isPlaying ? "❚❚" : "▶"}
            </button>
            <a href="#reel-info" className="control-btn" title="About this reel">
              ⓘ
            </a>
          </div>
          <div className="overlay">
            <img src="/horizontal_logo.png" alt="Flaming Heart Productions" className="logo" />
            <p className="body">single-origin cold brew meets hand-crafted 16mm film grain. we curate immersive visual experiences for brands who bicycle commute to farmer's markets. <a href="#portfolio">peep the aesthetic</a> before it was cool.</p>
            <nav>
              <button onClick={() => setPage("videos")}>VIDEOS</button>
              <button onClick={() => setPage("stills")}>STILLS</button>
              <button onClick={() => setPage("contact")}>CONTACT</button>
            </nav>
            {announcements.length > 0 && (
              <div className="announcements-ticker">
                <h3 className="ticker-header">LATEST</h3>
                {announcements.map((a: any) => (
                  <div key={a.id} className="announcement-item">
                    <span className="announcement-title">{a.title}</span>
                    <div className="announcement-content" dangerouslySetInnerHTML={{ __html: a.content }} />
                  </div>
                ))}
              </div>
            )}
          </div>
          <button onClick={() => setPage("admin")} className="admin-link" title="Admin">⚙</button>
        </>
      )}

      {page === "videos" && (
        <div className="page">
          <img src="/logo.png" alt="Flaming Heart Productions" className="page-logo" />
          <h1>VIDEOS</h1>
          <div className="content">
            {videos.length === 0 ? 'no videos yet' : (
              <div className="media-grid">
                {videos.map((v: any) => (
                  <div key={v.id} className="media-item">
                    <video src={v.mediaUrl} controls poster={v.thumbnailUrl} />
                    <h3>{v.title}</h3>
                    <p>{v.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
          <button onClick={() => setPage("home")}>BACK</button>
        </div>
      )}

      {page === "stills" && (
        <div className="page">
          <img src="/logo.png" alt="Flaming Heart Productions" className="page-logo" />
          <h1>STILLS</h1>
          <div className="content">
            {stills.length === 0 ? 'no stills yet' : (
              <div className="media-grid">
                {stills.map((s: any) => (
                  <div key={s.id} className="media-item">
                    <img src={s.mediaUrl} alt={s.title} />
                    <h3>{s.title}</h3>
                    <p>{s.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
          <button onClick={() => setPage("home")}>BACK</button>
        </div>
      )}

      {page === "contact" && (
        <div className="page">
          <img src="/logo.png" alt="Flaming Heart Productions" className="page-logo" />
          <h1>CONTACT</h1>
          <div className="content">contact information will go here</div>
          <button onClick={() => setPage("home")}>BACK</button>
        </div>
      )}

      <img 
        ref={iconRef}
        src="/icon.png" 
        alt="" 
        className="footer-icon"
        onMouseEnter={handleIconHover}
        onMouseLeave={handleIconLeave}
      />
    </div>
  );
}

export default App;
