import { useEffect, useState } from "react";
import { Search, RefreshCw, Users, UserCheck } from "lucide-react";
import { getMembers } from "../api/admin";

export default function Members() {
  const [members, setMembers] = useState([]);
  const [memberGrowth, setMemberGrowth] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const loadMembers = async (isRefresh = false) => {
    try {
      setError("");

      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const data = await getMembers();

      setMembers(Array.isArray(data.users) ? data.users : []);
      setMemberGrowth(
        Array.isArray(data.memberGrowth) ? data.memberGrowth : [],
      );
    } catch (error) {
      console.error("Members loading error:", error);

      setError(
        error?.response?.data?.message ||
          "Unable to load members. Please try again.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  const filteredMembers = members.filter((member) => {
    const searchText = search.toLowerCase();

    return (
      member.name?.toLowerCase().includes(searchText) ||
      member.email?.toLowerCase().includes(searchText) ||
      member.phone?.toLowerCase().includes(searchText)
    );
  });

  const getDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getInitials = (name) => {
    if (!name) return "U";

    return name
      .split(" ")
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const newThisMonth = members.filter((member) => {
    if (!member.createdAt) return false;

    const date = new Date(member.createdAt);

    return (
      date.getMonth() === currentMonth &&
      date.getFullYear() === currentYear
    );
  }).length;

  const activeMembers = members.filter(
    (member) =>
      member.status === "active" ||
      member.isActive === true ||
      !member.status,
  ).length;

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
            Members
          </h1>

          <p
            style={{
              marginTop: 8,
              color: "#777",
              fontSize: 15,
            }}
          >
            View and monitor all GymPass users.
          </p>
        </div>

        <button
          onClick={() => loadMembers(true)}
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
        <div
          style={{
            background: "#0D0D0D",
            border: "1px solid #1E1E1E",
            borderRadius: 18,
            padding: 22,
          }}
        >
          <Users size={22} color="#23EE09" />

          <p
            style={{
              color: "#777",
              margin: "15px 0 6px",
              fontSize: 14,
            }}
          >
            Total Members
          </p>

          <h2
            style={{
              margin: 0,
              fontSize: 30,
            }}
          >
            {members.length}
          </h2>
        </div>

        <div
          style={{
            background: "#0D0D0D",
            border: "1px solid #1E1E1E",
            borderRadius: 18,
            padding: 22,
          }}
        >
          <UserCheck size={22} color="#23EE09" />

          <p
            style={{
              color: "#777",
              margin: "15px 0 6px",
              fontSize: 14,
            }}
          >
            Active Members
          </p>

          <h2
            style={{
              margin: 0,
              fontSize: 30,
            }}
          >
            {activeMembers}
          </h2>
        </div>

        <div
          style={{
            background: "#0D0D0D",
            border: "1px solid #1E1E1E",
            borderRadius: 18,
            padding: 22,
          }}
        >
          <Users size={22} color="#23EE09" />

          <p
            style={{
              color: "#777",
              margin: "15px 0 6px",
              fontSize: 14,
            }}
          >
            New This Month
          </p>

          <h2
            style={{
              margin: 0,
              fontSize: 30,
            }}
          >
            {newThisMonth}
          </h2>
        </div>
      </div>

      {/* GRAPH */}
      <div
        style={{
          background: "#0D0D0D",
          border: "1px solid #1E1E1E",
          borderRadius: 20,
          padding: 24,
          marginBottom: 28,
        }}
      >
        <div style={{ marginBottom: 20 }}>
          <h2
            style={{
              margin: 0,
              fontSize: 20,
            }}
          >
            Member Growth
          </h2>

          <p
            style={{
              color: "#666",
              marginTop: 7,
              fontSize: 14,
            }}
          >
            Number of new members registered each month.
          </p>
        </div>

        {memberGrowth.length === 0 ? (
          <div
            style={{
              height: 250,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "#666",
            }}
          >
            No registration data available yet.
          </div>
        ) : (
          <div
            style={{
              height: 250,
              display: "flex",
              alignItems: "flex-end",
              gap: 18,
              overflowX: "auto",
              padding: "20px 10px 5px",
            }}
          >
            {memberGrowth.map((item) => {
              const maxCount = Math.max(
                ...memberGrowth.map((entry) => entry.count),
                1,
              );

              const height = Math.max(
                10,
                (item.count / maxCount) * 180,
              );

              return (
                <div
                  key={item.month}
                  style={{
                    minWidth: 55,
                    height: 210,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <span
                    style={{
                      color: "#aaa",
                      fontSize: 12,
                    }}
                  >
                    {item.count}
                  </span>

                  <div
                    style={{
                      width: 34,
                      height,
                      background: "#23EE09",
                      borderRadius: "8px 8px 3px 3px",
                      boxShadow: "0 0 15px rgba(35,238,9,0.18)",
                    }}
                  />

                  <span
                    style={{
                      color: "#666",
                      fontSize: 11,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {item.month}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* MEMBERS LIST */}
      <div
        style={{
          background: "#0D0D0D",
          border: "1px solid #1E1E1E",
          borderRadius: 20,
          overflow: "hidden",
        }}
      >
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
              All Members
            </h2>

            <p
              style={{
                margin: "6px 0 0",
                color: "#666",
                fontSize: 13,
              }}
            >
              {filteredMembers.length} members shown
            </p>
          </div>

          <div
            style={{
              position: "relative",
              minWidth: 260,
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
              placeholder="Search members..."
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

        {loading ? (
          <div
            style={{
              padding: 60,
              textAlign: "center",
              color: "#777",
            }}
          >
            Loading members...
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
        ) : filteredMembers.length === 0 ? (
          <div
            style={{
              padding: 60,
              textAlign: "center",
              color: "#666",
            }}
          >
            No members found.
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
                minWidth: 850,
              }}
            >
              <thead>
                <tr
                  style={{
                    borderBottom: "1px solid #1E1E1E",
                  }}
                >
                  <th style={headerStyle}>Member</th>
                  <th style={headerStyle}>Email</th>
                  <th style={headerStyle}>Phone</th>
                  <th style={headerStyle}>Status</th>
                  <th style={headerStyle}>Joined</th>
                  <th style={headerStyle}>ID</th>
                </tr>
              </thead>

              <tbody>
                {filteredMembers.map((member) => (
                  <tr
                    key={member._id}
                    style={{
                      borderBottom: "1px solid #151515",
                    }}
                  >
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
                            background: "rgba(35,238,9,0.12)",
                            color: "#23EE09",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            fontWeight: 700,
                          }}
                        >
                          {getInitials(member.name)}
                        </div>

                        <div>
                          <div
                            style={{
                              fontWeight: 600,
                              color: "white",
                            }}
                          >
                            {member.name || "Unknown"}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td style={cellStyle}>
                      {member.email || "—"}
                    </td>

                    <td style={cellStyle}>
                      {member.phone || "—"}
                    </td>

                    <td style={cellStyle}>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "6px 10px",
                          borderRadius: 20,
                          background:
                            member.status === "inactive"
                              ? "rgba(255,80,80,0.1)"
                              : "rgba(35,238,9,0.1)",
                          color:
                            member.status === "inactive"
                              ? "#ff6b6b"
                              : "#23EE09",
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                      >
                        {member.status || "active"}
                      </span>
                    </td>

                    <td style={cellStyle}>
                      {getDate(member.createdAt)}
                    </td>

                    <td
                      style={{
                        ...cellStyle,
                        color: "#555",
                        fontSize: 11,
                      }}
                    >
                      {member._id}
                    </td>
                  </tr>
                ))}
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