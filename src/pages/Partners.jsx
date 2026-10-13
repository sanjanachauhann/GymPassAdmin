import { useEffect, useState } from "react";
import {
  Users,
  RefreshCw,
  Mail,
  Phone,
  CalendarDays,
  ShieldCheck,
} from "lucide-react";
import { getPartners } from "../api/admin";

export default function Partners() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadPartners = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getPartners();

      setPartners(data.partners || []);
    } catch (error) {
      console.error("Failed to load partners:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load partners.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPartners();
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
            Partners
          </h1>

          <p
            style={{
              color: "#777",
              marginTop: "8px",
              marginBottom: 0,
            }}
          >
            Manage all GymPass partners
          </p>
        </div>

        <button
          onClick={loadPartners}
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

      {/* Total partners */}
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
        <Users
          size={19}
          color="#23ee09"
        />

        <span style={{ color: "#888" }}>
          Total Partners
        </span>

        <strong style={{ fontSize: "18px" }}>
          {partners.length}
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
          Loading partners...
        </div>
      )}

      {/* Empty */}
      {!loading &&
        !error &&
        partners.length === 0 && (
          <div
            style={{
              background: "#111",
              border: "1px solid #202020",
              borderRadius: "16px",
              padding: "60px",
              textAlign: "center",
            }}
          >
            <Users
              size={40}
              color="#333"
              style={{ marginBottom: "15px" }}
            />

            <h3 style={{ margin: 0 }}>
              No partners found
            </h3>

            <p style={{ color: "#666" }}>
              There are currently no partners in the database.
            </p>
          </div>
        )}

      {/* Partners */}
      {!loading && partners.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fill, minmax(340px, 1fr))",
            gap: "20px",
          }}
        >
          {partners.map((partner) => (
            <div
              key={partner._id}
              style={{
                background: "#111",
                border: "1px solid #202020",
                borderRadius: "16px",
                padding: "22px",
              }}
            >
              {/* Partner header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "14px",
                  marginBottom: "20px",
                }}
              >
                <div
                  style={{
                    width: "50px",
                    height: "50px",
                    minWidth: "50px",
                    borderRadius: "50%",
                    background:
                      "rgba(35,238,9,0.10)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Users
                    size={23}
                    color="#23ee09"
                  />
                </div>

                <div
                  style={{
                    minWidth: 0,
                    flex: 1,
                  }}
                >
                  <h2
                    style={{
                      margin: 0,
                      fontSize: "19px",
                      fontWeight: 600,
                    }}
                  >
                    {partner.ownerName ||
                      partner.name ||
                      "Unnamed Partner"}
                  </h2>

                  <div
                    style={{
                      marginTop: "7px",
                      color: "#555",
                      fontSize: "11px",
                    }}
                  >
                    ID: {String(partner._id).slice(-8)}
                  </div>
                </div>

                {/* Status */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    padding: "6px 9px",
                    borderRadius: "8px",
                    background:
                      partner.status === "active"
                        ? "rgba(35,238,9,0.10)"
                        : "rgba(255,180,0,0.10)",
                    color:
                      partner.status === "active"
                        ? "#23ee09"
                        : "#ffb000",
                    fontSize: "11px",
                    fontWeight: 600,
                    textTransform: "uppercase",
                  }}
                >
                  <ShieldCheck size={13} />

                  {partner.status ||
                    "active"}
                </div>
              </div>

              {/* Contact */}
              <div
                style={{
                  borderTop: "1px solid #202020",
                  paddingTop: "17px",
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
                  Contact Details
                </p>

                <InfoRow
                  icon={<Mail size={15} />}
                  label="Email"
                  value={
                    partner.email ||
                    "Not available"
                  }
                />

                <InfoRow
                  icon={<Phone size={15} />}
                  label="Phone"
                  value={
                    partner.phone ||
                    "Not available"
                  }
                />
              </div>

              {/* Partner details */}
              <div
                style={{
                  borderTop: "1px solid #202020",
                  marginTop: "18px",
                  paddingTop: "17px",
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
                  Partner Details
                </p>

                {partner.gymId && (
                  <InfoRow
                    label="Gym ID"
                    value={String(
                      partner.gymId,
                    )}
                  />
                )}

                {partner.role && (
                  <InfoRow
                    label="Role"
                    value={partner.role}
                  />
                )}

                {partner.createdAt && (
                  <InfoRow
                    icon={
                      <CalendarDays size={15} />
                    }
                    label="Joined"
                    value={new Date(
                      partner.createdAt,
                    ).toLocaleDateString(
                      "en-IN",
                    )}
                  />
                )}
              </div>

              {/* Created date */}
              <div
                style={{
                  marginTop: "18px",
                  paddingTop: "15px",
                  borderTop: "1px solid #202020",
                  color: "#555",
                  fontSize: "11px",
                }}
              >
                Partner ID: {partner._id}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "9px",
        marginBottom: "10px",
        fontSize: "13px",
      }}
    >
      {icon && (
        <span
          style={{
            color: "#666",
            marginTop: "2px",
          }}
        >
          {icon}
        </span>
      )}

      <span
        style={{
          color: "#555",
          minWidth: "65px",
        }}
      >
        {label}
      </span>

      <span
        style={{
          color: "#bbb",
          wordBreak: "break-word",
        }}
      >
        {value}
      </span>
    </div>
  );
}