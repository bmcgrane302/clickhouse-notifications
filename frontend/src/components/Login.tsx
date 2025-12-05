import { useState } from 'react';
import type { LoginResponse } from '../types/domain';

// type LoginResponse = {
//   user: {
//     id: string;
//     name: string;
//     email: string;
//     orgId: string;
//   };
//   organization: {
//     id: string;
//     name: string;
//   };
// };

type Props = {
  onLoginSuccess: (data: LoginResponse) => void;
};

export function Login({ onLoginSuccess }: Props) {
  const [email, setEmail] = useState('user1@example.com');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('http://localhost:5000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'Login failed');
      }

      const data: LoginResponse = await res.json();
      onLoginSuccess(data);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 320 }}>
      <h2>Login</h2>
      <p>Use: user1@example.com or user2@example.com</p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
}
