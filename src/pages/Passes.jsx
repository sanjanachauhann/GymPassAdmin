import { useEffect, useState } from "react";
import {
  RefreshCw,
  Ticket,
  CheckCircle,
  Clock,
  Search,
} from "lucide-react";
import { getPasses } from "../api/admin";

export default function Passes() {
  const [passes, setPasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const loadPasses = async (isRefresh = false) => {
    try {
      setError("");

      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const data = await getPasses();

      setPasses(Array.isArray(data.passes) ? data.passes : []);
    } catch (error) {
      console.error("Passes loading error:", error);

      setError(
        error?.response?.data?.message ||
          "Unable to load passes. Please try again.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadPasses();
  }, []);

  const getStatus = (pass) => {
    if (pass.status) {
      return pass.status.toUpperCase();
    }

    if (pass.endDate) {
      return new Date(pass.endDate) >= new Date()
        ? "ACTIVE"
        : "EXPIRED";
    }

    return "ACTIVE";
  };

  const activePasses = passes.filter(
    (pass) => getStatus(pass) === "ACTIVE",
  ).length;

  const expiredPasses = passes.filter(
    (pass) => getStatus(pass) === "EXPIRED",
  ).length;

  const filteredPasses = passes.filter((pass) => {
    const searchText = search.toLowerCase();

    return (
      pass.passType?.toLowerCase().includes(searchText) ||
      pass.planType?.toLowerCase().includes(searchText) ||
      pass.planName?.toLowerCase().includes(searchText) ||
      pass.gymName?.toLowerCase().includes(searchText) ||
      pass.status?.toLowerCase().includes(searchText) ||
      pass.userId?.toString().toLowerCase().includes(searchText) ||
      pass._id?.toString().toLowerCase().includes(searchText)
    );
  });

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatPrice = (price) => {
    if (price === undefined || price === null) {
      return "—";
    }

    return `₹${Number(price).toLocaleString("en-IN")}`;
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#050505",
        color: "white",
        padding: 32,
        boxSizing: "border-box",
      }}
    >
      {/* HEADER */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 20,
          marginBottom: 30,
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: 32,
              fontWeight: 700,
            }}
          >
            Passes
          </h1>

          <p
            style={{
              marginTop: 8,
              color: "#777",
              fontSize: 15,
            }}
          >
            View all passes created in GymPass.
          </p>
        </div>

        <button
          onClick={() => loadPasses(true)}
          disabled={refreshing}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "#111",
            border: "1px solid #222",
            color: "#ddd",
            padding: "11px 16px",
            borderRadius: 12,
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

      {/* STATS */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
          gap: 16,
          marginBottom: 28,
        }}
      >
        {/* TOTAL */}

        <div
          style={{
            background: "#0D0D0D",
            border: "1px solid #1E1E1E",
            borderRadius: 18,
            padding: 22,
          }}
        >
          <Ticket size={22} color="#23EE09" />

          <p
            style={{
              color: "#777",
              margin: "15px 0 6px",
              fontSize: 14,
            }}
          >
            Total Passes
          </p>

          <h2
            style={{
              margin: 0,
              fontSize: 30,
            }}
          >
            {passes.length}
          </h2>
        </div>

        {/* ACTIVE */}

        <div
          style={{
            background: "#0D0D0D",
            border: "1px solid #1E1E1E",
            borderRadius: 18,
            padding: 22,
          }}
        >
          <CheckCircle size={22} color="#23EE09" />

          <p
            style={{
              color: "#777",
              margin: "15px 0 6px",
              fontSize: 14,
            }}
          >
            Active Passes
          </p>

          <h2
            style={{
              margin: 0,
              fontSize: 30,
            }}
          >
            {activePasses}
          </h2>
        </div>

        {/* EXPIRED */}

        <div
          style={{
            background: "#0D0D0D",
            border: "1px solid #1E1E1E",
            borderRadius: 18,
            padding: 22,
          }}
        >
          <Clock size={22} color="#FFB84D" />

          <p
            style={{
              color: "#777",
              margin: "15px 0 6px",
              fontSize: 14,
            }}
          >
            Expired Passes
          </p>

          <h2
            style={{
              margin: 0,
              fontSize: 30,
            }}
          >
            {expiredPasses}
          </h2>
        </div>
      </div>

      {/* PASSES TABLE */}

      <div
        style={{
          background: "#0D0D0D",
          border: "1px solid #1E1E1E",
          borderRadius: 20,
          overflow: "hidden",
        }}
      >
        {/* TABLE HEADER */}

        <div
          style={{
            padding: 24,
            borderBottom: "1px solid #1E1E1E",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 20,
            flexWrap: "wrap",
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: 20,
              }}
            >
              All Passes
            </h2>

            <p
              style={{
                margin: "6px 0 0",
                color: "#666",
                fontSize: 13,
              }}
            >
              {filteredPasses.length} passes shown
            </p>
          </div>

          {/* SEARCH */}

          <div
            style={{
              position: "relative",
              minWidth: 280,
            }}
          >
            <Search
              size={18}
              color="#666"
              style={{
                position: "absolute",
                left: 13,
                top: 13,
              }}
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search passes..."
              style={{
                width: "100%",
                boxSizing: "border-box",
                background: "#111",
                border: "1px solid #252525",
                borderRadius: 12,
                padding: "11px 14px 11px 40px",
                color: "white",
                outline: "none",
              }}
            />
          </div>
        </div>

        {/* CONTENT */}

        {loading ? (
          <div
            style={{
              padding: 60,
              textAlign: "center",
              color: "#777",
            }}
          >
            Loading passes...
          </div>
        ) : error ? (
          <div
            style={{
              padding: 60,
              textAlign: "center",
              color: "#ff6b6b",
            }}
          >
            {error}
          </div>
        ) : filteredPasses.length === 0 ? (
          <div
            style={{
              padding: 60,
              textAlign: "center",
              color: "#666",
            }}
          >
            No passes found.
          </div>
        ) : (
          <div
            style={{
              overflowX: "auto",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: 1100,
              }}
            >
              <thead>
                <tr
                  style={{
                    borderBottom: "1px solid #1E1E1E",
                  }}
                >
                  <th style={headerStyle}>Pass</th>
                  <th style={headerStyle}>Gym</th>
                  <th style={headerStyle}>Plan</th>
                  <th style={headerStyle}>Price</th>
                  <th style={headerStyle}>Status</th>
                  <th style={headerStyle}>Start</th>
                  <th style={headerStyle}>End</th>
                  <th style={headerStyle}>Created</th>
                  <th style={headerStyle}>ID</th>
                </tr>
              </thead>

              <tbody>
                {filteredPasses.map((pass) => {
                  const status = getStatus(pass);

                  return (
                    <tr
                      key={pass._id}
                      style={{
                        borderBottom: "1px solid #151515",
                      }}
                    >
                      {/* PASS */}

                      <td style={cellStyle}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                          }}
                        >
                          <div
                            style={{
                              width: 40,
                              height: 40,
                              borderRadius: 12,
                              background:
                                "rgba(35,238,9,0.12)",
                              color: "#23EE09",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Ticket size={19} />
                          </div>

                          <div>
                            <div
                              style={{
                                color: "white",
                                fontWeight: 600,
                              }}
                            >
                              {pass.planName ||
                                pass.passType ||
                                "Gym Pass"}
                            </div>

                            <div
                              style={{
                                color: "#555",
                                fontSize: 11,
                                marginTop: 4,
                              }}
                            >
                              {pass.planType || "—"}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* GYM */}

                      <td style={cellStyle}>
                        {pass.gymName || "—"}
                      </td>

                      {/* PLAN */}

                      <td style={cellStyle}>
                        {pass.passType ||
                          pass.planName ||
                          pass.planType ||
                          "—"}
                      </td>

                      {/* PRICE */}

                      <td
                        style={{
                          ...cellStyle,
                          color: "#23EE09",
                          fontWeight: 600,
                        }}
                      >
                        {formatPrice(pass.price)}
                      </td>

                      {/* STATUS */}

                      <td style={cellStyle}>
                        <span
                          style={{
                            display: "inline-block",
                            padding: "6px 10px",
                            borderRadius: 20,
                            background:
                              status === "ACTIVE"
                                ? "rgba(35,238,9,0.1)"
                                : "rgba(255,184,77,0.1)",
                            color:
                              status === "ACTIVE"
                                ? "#23EE09"
                                : "#FFB84D",
                            fontSize: 12,
                            fontWeight: 600,
                          }}
                        >
                          {status}
                        </span>
                      </td>

                      {/* START */}

                      <td style={cellStyle}>
                        {formatDate(
                          pass.startDate ||
                            pass.startedAt ||
                            pass.validFrom,
                        )}
                      </td>

                      {/* END */}

                      <td style={cellStyle}>
                        {formatDate(
                          pass.endDate ||
                            pass.expiresAt ||
                            pass.validUntil,
                        )}
                      </td>

                      {/* CREATED */}

                      <td style={cellStyle}>
                        {formatDate(pass.createdAt)}
                      </td>

                      {/* ID */}

                      <td
                        style={{
                          ...cellStyle,
                          color: "#555",
                          fontSize: 11,
                        }}
                      >
                        {pass._id}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

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
        `}
      </style>
    </div>
  );
}

const headerStyle = {
  textAlign: "left",
  padding: "16px 20px",
  color: "#666",
  fontSize: 12,
  fontWeight: 600,
  textTransform: "uppercase",
};

const cellStyle = {
  padding: "16px 20px",
  color: "#aaa",
  fontSize: 14,
};