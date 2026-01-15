import { useState } from 'react';
import './Login.css';

interface LoginProps {
  onLogin: () => void;
  onCancel: () => void;
}

export default function Login({ onLogin, onCancel }: LoginProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      onLogin();
    } else {
      setError('invalid credentials');
    }
  };

  return (
    <div className="login-container">
      <img src="/logo.png" alt="Flaming Heart Productions" className="login-logo" />
      <h1>ADMIN ACCESS</h1>
      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="password"
          required
        />
        {error && <p className="error">{error}</p>}
        <div className="login-actions">
          <button type="submit">LOGIN</button>
          <button type="button" onClick={onCancel}>CANCEL</button>
        </div>
      </form>
    </div>
  );
}
