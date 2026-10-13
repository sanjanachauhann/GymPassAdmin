import { useEffect, useState } from "react";
import {
  ClipboardList,
  RefreshCw,
  CheckCircle,
  XCircle,
  MapPin,
  Mail,
  Phone,
  CalendarDays,
} from "lucide-react";
import {
  getApplications,
  approveApplication,
  rejectApplication,
} from "../api/admin";

export default function AllApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processingId, setProcessingId] = useState(null);

  const loadApplications = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getApplications();

      setApplications(data.applications || []);
    } catch (error) {
      console.error("Failed to load applications:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load applications.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const handleApprove = async (id) => {
    try {
      setProcessingId(id);

      await approveApplication(id);

      await loadApplications();
    } catch (error) {
      console.error("Approve application error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to approve application.",
      );
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id) => {
    try {
      setProcessingId(id);

      await rejectApplication(id);

      await loadApplications();
    } catch (error) {
      console.error("Reject application error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to reject application.",
      );
    } finally {
      setProcessingId(null);
    }
  };

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
            Applications
          </h1>

          <p
            style={{
              color: "#777",
              marginTop: "8px",
              marginBottom: 0,
            }}
          >
            Manage gym partner registration requests
          </p>
        </div>

        <button
          onClick={loadApplications}
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

      {/* Total */}
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
        <ClipboardList
          size={19}
          color="#23ee09"
        />

        <span style={{ color: "#888" }}>
          Total Applications
        </span>

        <strong style={{ fontSize: "18px" }}>
          {applications.length}
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
          Loading applications...
        </div>
      )}

      {/* Empty */}
      {!loading &&
        !error &&
        applications.length === 0 && (
          <div
            style={{
              background: "#111",
              border: "1px solid #202020",
              borderRadius: "16px",
              padding: "60px",
              textAlign: "center",
            }}
          >
            <ClipboardList
              size={40}
              color="#333"
              style={{ marginBottom: "15px" }}
            />

            <h3 style={{ margin: 0 }}>
              No applications found
            </h3>

            <p style={{ color: "#666" }}>
              There are currently no gym partner requests.
            </p>
          </div>
        )}

      {/* Applications */}
      {!loading && applications.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fill, minmax(360px, 1fr))",
            gap: "20px",
          }}
        >
          {applications.map((application) => {
            const id = application._id;

            return (
              <div
                key={id}
                style={{
                  background: "#111",
                  border: "1px solid #202020",
                  borderRadius: "16px",
                  padding: "22px",
                }}
              >
                {/* Gym name */}
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
                    <ClipboardList
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
                      }}
                    >
                      {application.gymName ||
                        "Unnamed Gym"}
                    </h2>

                    <div
                      style={{
                        marginTop: "7px",
                        color: "#666",
                        fontSize: "12px",
                      }}
                    >
                      Application ID:{" "}
                      {String(id).slice(-8)}
                    </div>
                  </div>
                </div>

                {/* Owner */}
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
                    Owner Details
                  </p>

                  <InfoRow
                    label="Name"
                    value={
                      application.ownerName ||
                      "Not available"
                    }
                  />

                  <InfoRow
                    icon={<Mail size={15} />}
                    label="Email"
                    value={
                      application.email ||
                      "Not available"
                    }
                  />

                  <InfoRow
                    icon={<Phone size={15} />}
                    label="Phone"
                    value={
                      application.phone ||
                      "Not available"
                    }
                  />
                </div>

                {/* Gym details */}
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
                    Gym Details
                  </p>

                  <InfoRow
                    icon={<MapPin size={15} />}
                    label="Address"
                    value={
                      application.address ||
                      "Not available"
                    }
                  />

                  {application.placeId && (
                    <InfoRow
                      label="Place ID"
                      value={application.placeId}
                    />
                  )}

                  {application.rating !==
                    undefined && (
                    <InfoRow
                      label="Rating"
                      value={application.rating}
                    />
                  )}
                </div>

                {/* Passes */}
                {application.passes && (
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
                        value={
                          application.passes.daily
                        }
                      />

                      <PassPrice
                        label="Weekly"
                        value={
                          application.passes.weekly
                        }
                      />

                      <PassPrice
                        label="Monthly"
                        value={
                          application.passes.monthly
                        }
                      />

                      <PassPrice
                        label="Yearly"
                        value={
                          application.passes.yearly
                        }
                      />
                    </div>
                  </div>
                )}

                {/* Date */}
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

                  {application.createdAt
                    ? new Date(
                        application.createdAt,
                      ).toLocaleString("en-IN")
                    : "Date unavailable"}
                </div>

                {/* Actions */}
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    marginTop: "20px",
                  }}
                >
                  <button
                    onClick={() =>
                      handleApprove(id)
                    }
                    disabled={processingId === id}
                    style={{
                      flex: 1,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "7px",
                      padding: "12px",
                      border: "none",
                      borderRadius: "10px",
                      background: "#23ee09",
                      color: "#000",
                      fontWeight: 700,
                      cursor:
                        processingId === id
                          ? "not-allowed"
                          : "pointer",
                      opacity:
                        processingId === id
                          ? 0.6
                          : 1,
                    }}
                  >
                    <CheckCircle size={17} />

                    {processingId === id
                      ? "Processing..."
                      : "Approve"}
                  </button>

                  <button
                    onClick={() =>
                      handleReject(id)
                    }
                    disabled={processingId === id}
                    style={{
                      flex: 1,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "7px",
                      padding: "12px",
                      border:
                        "1px solid #542222",
                      borderRadius: "10px",
                      background: "#1b0d0d",
                      color: "#ff6b6b",
                      fontWeight: 600,
                      cursor:
                        processingId === id
                          ? "not-allowed"
                          : "pointer",
                      opacity:
                        processingId === id
                          ? 0.6
                          : 1,
                    }}
                  >
                    <XCircle size={17} />
                    Reject
                  </button>
                </div>
              </div>
            );
          })}
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