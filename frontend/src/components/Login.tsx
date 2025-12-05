import { useState } from 'react';
import type { LoginResponse } from '../types/domain';


type Props = {
  onLoginSuccess: (data: LoginResponse) => void;
};

export function Login({ onLoginSuccess }: Props) {
  const [email, setEmail] = useState('');
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
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f7f7f7",
      }}
    >
      <div
        style={{
          width: 320,
          padding: "2rem",
          background: "#fff",
          borderRadius: 8,
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>Login</h2>
        <p style={{ textAlign: "center", marginBottom: "1rem" }}>
          Use: <strong>user1@example.com</strong> or <strong>user2@example.com</strong>
        </p>

        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
          }}
        >
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              padding: "8px 10px",
              borderRadius: 4,
              border: "1px solid #ccc",
              fontSize: 14,
            }}
          />
          <button
            disabled={loading}
            style={{
              padding: "10px",
              background: "#000",
              color: "#fff",
              borderRadius: 4,
              cursor: "pointer",
              fontWeight: 600,
              border: "none",
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {error && (
            <p style={{ color: "red", textAlign: "center" }}>{error}</p>
          )}
        </form>
      </div>
    </div>
  );
}
