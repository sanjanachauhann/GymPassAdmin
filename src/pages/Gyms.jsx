import { useEffect, useState } from "react";
import {
  Dumbbell,
  MapPin,
  Star,
  CalendarDays,
  RefreshCw,
} from "lucide-react";
import { getGyms } from "../api/admin";

export default function Gyms() {
  const [gyms, setGyms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadGyms = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getGyms();

      setGyms(data.gyms || []);
    } catch (error) {
      console.error("Failed to load gyms:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load gyms.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGyms();
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#050505",
        color: "white",
        padding: "32px",
        boxSizing: "border-box",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: "32px",
              fontWeight: 700,
            }}
          >
            Gyms
          </h1>

          <p
            style={{
              color: "#777",
              marginTop: "8px",
              marginBottom: 0,
            }}
          >
            Manage all gyms registered on GymPass
          </p>
        </div>

        <button
          onClick={loadGyms}
          disabled={loading}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "11px 16px",
            borderRadius: "10px",
            border: "1px solid #292929",
            background: "#111",
            color: "#ccc",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          <RefreshCw size={17} />
          Refresh
        </button>
      </div>

      {/* Summary */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "10px",
          background: "#111",
          border: "1px solid #202020",
          borderRadius: "12px",
          padding: "13px 18px",
          marginBottom: "24px",
        }}
      >
        <Dumbbell size={19} color="#23ee09" />

        <span style={{ color: "#888" }}>
          Total Gyms
        </span>

        <strong style={{ fontSize: "18px" }}>
          {gyms.length}
        </strong>
      </div>

      {/* Error */}
      {error && (
        <div
          style={{
            background: "#2a1111",
            border: "1px solid #4a2020",
            color: "#ff6b6b",
            padding: "15px",
            borderRadius: "10px",
            marginBottom: "20px",
          }}
        >
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div
          style={{
            background: "#111",
            border: "1px solid #202020",
            borderRadius: "16px",
            padding: "50px",
            textAlign: "center",
            color: "#777",
          }}
        >
          Loading gyms...
        </div>
      )}

      {/* Empty */}
      {!loading && !error && gyms.length === 0 && (
        <div
          style={{
            background: "#111",
            border: "1px solid #202020",
            borderRadius: "16px",
            padding: "60px",
            textAlign: "center",
          }}
        >
          <Dumbbell
            size={40}
            color="#333"
            style={{ marginBottom: "15px" }}
          />

          <h3 style={{ margin: 0 }}>
            No gyms found
          </h3>

          <p style={{ color: "#666" }}>
            There are currently no gyms in the database.
          </p>
        </div>
      )}

      {/* Gyms */}
      {!loading && gyms.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "20px",
          }}
        >
          {gyms.map((gym) => (
            <div
              key={gym._id}
              style={{
                background: "#111",
                border: "1px solid #202020",
                borderRadius: "16px",
                padding: "22px",
              }}
            >
              {/* Gym header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "14px",
                  marginBottom: "18px",
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    minWidth: "48px",
                    borderRadius: "12px",
                    background:
                      "rgba(35,238,9,0.10)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Dumbbell
                    size={23}
                    color="#23ee09"
                  />
                </div>

                <div style={{ minWidth: 0 }}>
                  <h2
                    style={{
                      margin: 0,
                      fontSize: "19px",
                      fontWeight: 600,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {gym.gymName || "Unnamed Gym"}
                  </h2>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      marginTop: "7px",
                    }}
                  >
                    <Star
                      size={15}
                      fill="#23ee09"
                      color="#23ee09"
                    />

                    <span
                      style={{
                        color: "#aaa",
                        fontSize: "13px",
                      }}
                    >
                      {gym.rating ?? "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "9px",
                  color: "#888",
                  fontSize: "13px",
                  lineHeight: 1.5,
                  marginBottom: "18px",
                }}
              >
                <MapPin
                  size={16}
                  style={{
                    minWidth: "16px",
                    marginTop: "2px",
                  }}
                />

                <span>
                  {gym.address || "Address unavailable"}
                </span>
              </div>

              {/* Passes */}
              <div
                style={{
                  borderTop: "1px solid #202020",
                  paddingTop: "18px",
                }}
              >
                <p
                  style={{
                    margin: "0 0 12px",
                    color: "#666",
                    fontSize: "12px",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Pass Prices
                </p>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(2, 1fr)",
                    gap: "8px",
                  }}
                >
                  <PassPrice
                    label="Daily"
                    value={gym.passes?.daily}
                  />

                  <PassPrice
                    label="Weekly"
                    value={gym.passes?.weekly}
                  />

                  <PassPrice
                    label="Monthly"
                    value={gym.passes?.monthly}
                  />

                  <PassPrice
                    label="Yearly"
                    value={gym.passes?.yearly}
                  />
                </div>
              </div>

              {/* Footer */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "7px",
                  marginTop: "18px",
                  paddingTop: "15px",
                  borderTop: "1px solid #202020",
                  color: "#555",
                  fontSize: "11px",
                }}
              >
                <CalendarDays size={13} />

                {gym.createdAt
                  ? new Date(
                      gym.createdAt,
                    ).toLocaleDateString("en-IN")
                  : "Date unavailable"}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PassPrice({ label, value }) {
  return (
    <div
      style={{
        background: "#090909",
        borderRadius: "8px",
        padding: "10px",
      }}
    >
      <div
        style={{
          color: "#666",
          fontSize: "11px",
          marginBottom: "4px",
        }}
      >
        {label}
      </div>

      <div
        style={{
          fontWeight: 600,
          fontSize: "14px",
        }}
      >
        {value !== undefined && value !== null
          ? `₹${value}`
          : "—"}
      </div>
    </div>
  );
}