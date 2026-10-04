import { Bell, Search } from "lucide-react";

export default function Header() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 40,
      }}
    >
      <div>
        <h1
          style={{
            color: "white",
            fontSize: 40,
            fontWeight: 700,
          }}
        >
          Dashboard
        </h1>

        <p
          style={{
            color: "#777",
            marginTop: 8,
            fontSize: 15,
          }}
        >
          Welcome back, Rajdeep 👋
        </p>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 20,
        }}
      >
        <div
          style={{
            width: 320,
            height: 48,
            background: "#111",
            borderRadius: 14,
            display: "flex",
            alignItems: "center",
            padding: "0 18px",
            border: "1px solid #222",
          }}
        >
          <Search color="#666" size={18} />

          <input
            placeholder="Search..."
            style={{
              marginLeft: 12,
              background: "transparent",
              border: "none",
              outline: "none",
              color: "white",
              width: "100%",
              fontSize: 15,
            }}
          />
        </div>

        <div
          style={{
            width: 46,
            height: 46,
            borderRadius: 14,
            background: "#111",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            border: "1px solid #222",
          }}
        >
          <Bell color="white" size={20} />
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            background: "#111",
            padding: "8px 14px",
            borderRadius: 14,
            border: "1px solid #222",
          }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: "50%",
              background: "#00F5D4",
              color: "#050505",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
            }}
          >
            R
          </div>

          <div>
            <div
              style={{
                color: "white",
                fontWeight: 600,
              }}
            >
              Rajdeep
            </div>

            <div
              style={{
                color: "#777",
                fontSize: 13,
              }}
            >
              Administrator
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}