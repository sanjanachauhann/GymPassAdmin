import { useEffect, useMemo, useState } from "react";
import { CreditCard, RefreshCw, Search } from "lucide-react";
import { getPayments } from "../api/admin";

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const loadPayments = async () => {
    try {
      setError("");

      const data = await getPayments();

      if (data.success) {
        setPayments(data.payments || []);
      } else {
        setError(data.message || "Failed to load payments");
      }
    } catch (error) {
      console.error("Payments error:", error);

      setError(
        error?.response?.data?.message ||
          "Unable to load payments. Please try again.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadPayments();
  };

  const filteredPayments = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return payments;
    }

    return payments.filter((payment) => {
      return (
        payment.orderId?.toLowerCase().includes(query) ||
        payment.status?.toLowerCase().includes(query) ||
        payment.purpose?.toLowerCase().includes(query) ||
        payment._id?.toLowerCase().includes(query)
      );
    });
  }, [payments, search]);

  const totalAmount = payments.reduce(
    (sum, payment) => sum + Number(payment.amount || 0),
    0,
  );

  const successfulPayments = payments.filter(
    (payment) => payment.status === "SUCCESS",
  ).length;

  const pendingPayments = payments.filter(
    (payment) => payment.status === "PENDING",
  ).length;

  const failedPayments = payments.filter(
    (payment) => payment.status === "FAILED",
  ).length;

  const formatAmount = (amount) => {
    return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
  };

  const formatDate = (date) => {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "—";
    }

    return parsedDate.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "SUCCESS":
        return {
          background: "rgba(35, 238, 9, 0.12)",
          color: "#23ee09",
        };

      case "PENDING":
        return {
          background: "rgba(255, 170, 0, 0.12)",
          color: "#ffaa00",
        };

      case "FAILED":
        return {
          background: "rgba(255, 68, 68, 0.12)",
          color: "#ff4444",
        };

      default:
        return {
          background: "rgba(255,255,255,0.08)",
          color: "#aaa",
        };
    }
  };

  return (
    <div
      style={{
        minHeight: "100%",
        background: "#050505",
        color: "white",
        padding: "32px",
      }}
    >
      {/* HEADER */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "20px",
          flexWrap: "wrap",
          marginBottom: "30px",
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: "32px",
              fontWeight: "700",
            }}
          >
            Payments
          </h1>

          <p
            style={{
              marginTop: "8px",
              color: "#777",
              fontSize: "15px",
            }}
          >
            View and monitor all payments in GymPass.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={refreshing}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "11px 16px",
            borderRadius: "10px",
            border: "1px solid #222",
            background: "#111",
            color: "white",
            cursor: refreshing ? "not-allowed" : "pointer",
          }}
        >
          <RefreshCw
            size={17}
            style={{
              animation: refreshing ? "spin 1s linear infinite" : "none",
            }}
          />

          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* SUMMARY CARDS */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
          gap: "16px",
          marginBottom: "28px",
        }}
      >
        <SummaryCard
          title="Total Payments"
          value={payments.length}
          icon={<CreditCard size={20} />}
        />

        <SummaryCard
          title="Total Amount"
          value={formatAmount(totalAmount)}
          icon={<span style={{ fontSize: "20px" }}>₹</span>}
        />

        <SummaryCard
          title="Successful"
          value={successfulPayments}
          icon={<span style={{ color: "#23ee09" }}>●</span>}
        />

        <SummaryCard
          title="Pending"
          value={pendingPayments}
          icon={<span style={{ color: "#ffaa00" }}>●</span>}
        />

        <SummaryCard
          title="Failed"
          value={failedPayments}
          icon={<span style={{ color: "#ff4444" }}>●</span>}
        />
      </div>

      {/* SEARCH */}

      <div
        style={{
          background: "#0d0d0d",
          border: "1px solid #1b1b1b",
          borderRadius: "14px",
          padding: "14px 16px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "18px",
        }}
      >
        <Search size={18} color="#666" />

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by order ID, status, purpose or payment ID..."
          style={{
            flex: 1,
            border: "none",
            outline: "none",
            background: "transparent",
            color: "white",
            fontSize: "14px",
          }}
        />
      </div>

      {/* ERROR */}

      {error && (
        <div
          style={{
            background: "rgba(255,68,68,0.08)",
            border: "1px solid rgba(255,68,68,0.2)",
            color: "#ff6666",
            borderRadius: "12px",
            padding: "14px 16px",
            marginBottom: "18px",
          }}
        >
          {error}
        </div>
      )}

      {/* LOADING */}

      {loading ? (
        <div
          style={{
            background: "#0d0d0d",
            border: "1px solid #1b1b1b",
            borderRadius: "16px",
            padding: "50px",
            textAlign: "center",
            color: "#777",
          }}
        >
          Loading payments...
        </div>
      ) : filteredPayments.length === 0 ? (
        <div
          style={{
            background: "#0d0d0d",
            border: "1px solid #1b1b1b",
            borderRadius: "16px",
            padding: "60px 20px",
            textAlign: "center",
          }}
        >
          <CreditCard
            size={40}
            color="#444"
            style={{ marginBottom: "12px" }}
          />

          <div
            style={{
              fontSize: "17px",
              fontWeight: "600",
            }}
          >
            No payments found
          </div>

          <div
            style={{
              color: "#666",
              marginTop: "6px",
            }}
          >
            {search
              ? "Try a different search."
              : "There are no payment records in the database."}
          </div>
        </div>
      ) : (
        /* PAYMENT TABLE */

        <div
          style={{
            background: "#0d0d0d",
            border: "1px solid #1b1b1b",
            borderRadius: "16px",
            overflow: "auto",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              minWidth: "900px",
            }}
          >
            <thead>
              <tr
                style={{
                  borderBottom: "1px solid #222",
                }}
              >
                <th style={thStyle}>Payment ID</th>
                <th style={thStyle}>Order ID</th>
                <th style={thStyle}>Amount</th>
                <th style={thStyle}>Purpose</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Created</th>
                <th style={thStyle}>Updated</th>
              </tr>
            </thead>

            <tbody>
              {filteredPayments.map((payment) => {
                const statusStyle = getStatusStyle(payment.status);

                return (
                  <tr
                    key={payment._id}
                    style={{
                      borderBottom: "1px solid #181818",
                    }}
                  >
                    <td style={tdStyle}>
                      <span
                        style={{
                          fontFamily: "monospace",
                          color: "#aaa",
                          fontSize: "12px",
                        }}
                      >
                        {payment._id}
                      </span>
                    </td>

                    <td style={tdStyle}>
                      <span
                        style={{
                          fontFamily: "monospace",
                          color: "#ddd",
                          fontSize: "13px",
                        }}
                      >
                        {payment.orderId || "—"}
                      </span>
                    </td>

                    <td
                      style={{
                        ...tdStyle,
                        fontWeight: "700",
                        color: "#23ee09",
                      }}
                    >
                      {formatAmount(payment.amount)}
                    </td>

                    <td style={tdStyle}>
                      <span
                        style={{
                          background: "#151515",
                          padding: "6px 9px",
                          borderRadius: "7px",
                          color: "#bbb",
                          fontSize: "12px",
                        }}
                      >
                        {payment.purpose || "—"}
                      </span>
                    </td>

                    <td style={tdStyle}>
                      <span
                        style={{
                          ...statusStyle,
                          padding: "6px 10px",
                          borderRadius: "20px",
                          fontSize: "12px",
                          fontWeight: "600",
                        }}
                      >
                        {payment.status || "UNKNOWN"}
                      </span>
                    </td>

                    <td
                      style={{
                        ...tdStyle,
                        color: "#aaa",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {formatDate(payment.createdAt)}
                    </td>

                    <td
                      style={{
                        ...tdStyle,
                        color: "#777",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {formatDate(payment.updatedAt)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <style>
        {`
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }

          @media (max-width: 700px) {
            .payments-page {
              padding: 20px !important;
            }
          }
        `}
      </style>
    </div>
  );
}

function SummaryCard({ title, value, icon }) {
  return (
    <div
      style={{
        background: "#0d0d0d",
        border: "1px solid #1b1b1b",
        borderRadius: "16px",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "10px",
          background: "#151515",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#23ee09",
          marginBottom: "16px",
        }}
      >
        {icon}
      </div>

      <div
        style={{
          color: "#666",
          fontSize: "13px",
          marginBottom: "6px",
        }}
      >
        {title}
      </div>

      <div
        style={{
          fontSize: "24px",
          fontWeight: "700",
        }}
      >
        {value}
      </div>
    </div>
  );
}

const thStyle = {
  textAlign: "left",
  padding: "15px 18px",
  color: "#666",
  fontSize: "12px",
  fontWeight: "600",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
  whiteSpace: "nowrap",
};

const tdStyle = {
  padding: "17px 18px",
  fontSize: "13px",
  color: "#ddd",
  verticalAlign: "middle",
};