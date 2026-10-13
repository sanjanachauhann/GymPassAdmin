import { useEffect, useState } from "react";
import { setupAdminPassword } from "../api/admin";

export default function AdminSetupPassword() {
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const invitationToken = params.get("token");

    if (!invitationToken) {
      setError("Invalid invitation link.");
      setLoading(false);
      return;
    }

    setToken(invitationToken);

    const loadInvitation = async () => {
      try {
        const response = await fetch(
          `http://localhost:5001/api/admin/admins/setup-password?token=${invitationToken}`,
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Invalid invitation");
        }

        setName(data.admin.name);
        setEmail(data.admin.email);
      } catch (error) {
        setError(error.message || "Unable to validate invitation.");
      } finally {
        setLoading(false);
      }
    };

    loadInvitation();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setSaving(true);

      await setupAdminPassword(token, password);

      setSuccess(
        "Password created successfully. You can now sign in.",
      );

      setPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to create password.",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#050505",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Validating invitation...
      </div>
    );
  }

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
        <h1 style={{ marginBottom: "8px" }}>
          Create Your Password
        </h1>

        <p
          style={{
            color: "#888",
            marginBottom: "25px",
          }}
        >
          Complete your GymPass Admin account.
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

        {success && (
          <div
            style={{
              background: "#102a0d",
              color: "#23ee09",
              padding: "12px",
              borderRadius: "8px",
              marginBottom: "20px",
            }}
          >
            {success}
          </div>
        )}

        <label
          style={{
            display: "block",
            color: "#888",
            fontSize: "13px",
            marginBottom: "6px",
          }}
        >
          Name
        </label>

        <input
          value={name}
          readOnly
          style={{
            width: "100%",
            padding: "13px",
            marginBottom: "15px",
            borderRadius: "8px",
            border: "1px solid #333",
            background: "#080808",
            color: "#aaa",
            boxSizing: "border-box",
          }}
        />

        <label
          style={{
            display: "block",
            color: "#888",
            fontSize: "13px",
            marginBottom: "6px",
          }}
        >
          Email
        </label>

        <input
          value={email}
          readOnly
          style={{
            width: "100%",
            padding: "13px",
            marginBottom: "20px",
            borderRadius: "8px",
            border: "1px solid #333",
            background: "#080808",
            color: "#aaa",
            boxSizing: "border-box",
          }}
        />

        <label
          style={{
            display: "block",
            color: "#888",
            fontSize: "13px",
            marginBottom: "6px",
          }}
        >
          New Password
        </label>

        <input
          type="password"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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

        <label
          style={{
            display: "block",
            color: "#888",
            fontSize: "13px",
            marginBottom: "6px",
          }}
        >
          Confirm Password
        </label>

        <input
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
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
          disabled={saving}
          style={{
            width: "100%",
            padding: "14px",
            border: "none",
            borderRadius: "8px",
            background: "#23ee09",
            color: "#000",
            fontWeight: "700",
            cursor: saving ? "not-allowed" : "pointer",
          }}
        >
          {saving ? "Creating Password..." : "Set Password"}
        </button>
      </form>
    </div>
  );
}