import { useState, useEffect } from 'react';
import RichTextEditor from './RichTextEditor';
import './Admin.css';

interface AdminProps {
  onBack: () => void;
}

export default function Admin({ onBack }: AdminProps) {
  const [section, setSection] = useState<'videos' | 'stills' | 'announcements' | 'about' | 'bgvideo'>('videos');
  const [editingItem, setEditingItem] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementContent, setAnnouncementContent] = useState('');
  const [aboutContent, setAboutContent] = useState('');

  useEffect(() => {
    loadItems();
  }, [section]);

  const loadItems = async () => {
    if (section === 'videos' || section === 'stills' || section === 'announcements') {
      const res = await fetch(`/api/${section}`);
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } else if (section === 'about') {
      const res = await fetch('/api/about');
      if (res.ok) {
        const data = await res.json();
        setAboutContent(data?.content || '');
      }
    }
  };

  const handleMediaSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const res = await fetch(`/api/${section}`, {
      method: editingItem ? 'PUT' : 'POST',
      body: formData,
    });

    if (res.ok) {
      setEditingItem(null);
      e.currentTarget.reset();
      loadItems();
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('delete this item?')) {
      await fetch(`/api/${section}/${id}`, { method: 'DELETE' });
      loadItems();
    }
  };

  return (
    <div className="admin-container">
      <img src="/logo.png" alt="Flaming Heart Productions" className="page-logo" />
      <h1>ADMIN</h1>
      
      <nav className="admin-nav">
        <button onClick={() => setSection('videos')} className={section === 'videos' ? 'active' : ''}>VIDEOS</button>
        <button onClick={() => setSection('stills')} className={section === 'stills' ? 'active' : ''}>STILLS</button>
        <button onClick={() => setSection('announcements')} className={section === 'announcements' ? 'active' : ''}>ANNOUNCEMENTS</button>
        <button onClick={() => setSection('about')} className={section === 'about' ? 'active' : ''}>ABOUT</button>
        <button onClick={() => setSection('bgvideo')} className={section === 'bgvideo' ? 'active' : ''}>BG VIDEO</button>
      </nav>

      <h2 className="section-title">EDITING: {section}</h2>

      {(section === 'videos' || section === 'stills') && (
        <>
          <form onSubmit={handleMediaSubmit} className="admin-form">
            <input name="title" placeholder="title" required />
            <textarea name="description" placeholder="description" />
            <input name="file" type="file" accept={section === 'videos' ? 'video/*' : 'image/*'} required={!editingItem} />
            <input name="thumbnail" type="file" accept="image/*" />
            <button type="submit">{editingItem ? 'UPDATE' : 'CREATE'}</button>
          </form>
          <div className="items-list">
            {items.map((item: any) => (
              <div key={item.id} className="item">
                <span>{item.title}</span>
                <button onClick={() => handleDelete(item.id)}>DELETE</button>
              </div>
            ))}
          </div>
        </>
      )}

      {section === 'announcements' && (
        <>
          <div className="admin-form">
            <input value={announcementTitle} onChange={(e) => setAnnouncementTitle(e.target.value)} placeholder="title" />
            <RichTextEditor content={announcementContent} onChange={setAnnouncementContent} />
            <button onClick={async () => {
              const res = await fetch('/api/announcements', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: announcementTitle, content: announcementContent })
              });
              if (res.ok) {
                setAnnouncementTitle('');
                setAnnouncementContent('');
                loadItems();
              }
            }}>CREATE</button>
          </div>
          <div className="items-list">
            {items.map((item: any) => (
              <div key={item.id} className="item">
                <span>{item.title}</span>
                <button onClick={() => handleDelete(item.id)}>DELETE</button>
              </div>
            ))}
          </div>
        </>
      )}

      {section === 'about' && (
        <div className="admin-form">
          <RichTextEditor content={aboutContent} onChange={setAboutContent} />
          <button onClick={async () => {
            const res = await fetch('/api/about', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ content: aboutContent })
            });
            if (res.ok) alert('about updated');
          }}>UPDATE</button>
        </div>
      )}

      {section === 'bgvideo' && (
        <form onSubmit={async (e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const res = await fetch('/api/bgvideo', { method: 'POST', body: formData });
          if (res.ok) alert('background video updated');
        }} className="admin-form">
          <input name="file" type="file" accept="video/*" required />
          <button type="submit">UPLOAD BG VIDEO</button>
        </form>
      )}

      <button onClick={onBack} className="back-btn">BACK TO SITE</button>
    </div>
  );
}
