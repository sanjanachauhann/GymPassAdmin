import { useState } from "react";
import { loginAdmin } from "../api/admin";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const data = await loginAdmin(email, password);

      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("adminUser", JSON.stringify(data.admin));

      onLogin(data.admin);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to login. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#050505",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: "380px",
          padding: "40px",
          background: "#111",
          borderRadius: "16px",
          border: "1px solid #222",
        }}
      >
        <h1 style={{ marginBottom: "8px" }}>GymPass Admin</h1>

        <p style={{ color: "#888", marginBottom: "30px" }}>
          Sign in to continue
        </p>

        {error && (
          <div
            style={{
              background: "#2a1111",
              color: "#ff6b6b",
              padding: "12px",
              borderRadius: "8px",
              marginBottom: "20px",
            }}
          >
            {error}
          </div>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "13px",
            marginBottom: "15px",
            borderRadius: "8px",
            border: "1px solid #333",
            background: "#080808",
            color: "white",
            boxSizing: "border-box",
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "13px",
            marginBottom: "20px",
            borderRadius: "8px",
            border: "1px solid #333",
            background: "#080808",
            color: "white",
            boxSizing: "border-box",
          }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "14px",
            border: "none",
            borderRadius: "8px",
            background: "#23ee09",
            color: "#000",
            fontWeight: "700",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}