import {
  TrendingUp,
  Users,
  Dumbbell,
  CreditCard,
  Ticket,
  Activity,
} from "lucide-react";

const stats = [
  {
    title: "Total Revenue",
    value: "₹2,48,500",
    change: "+12.5%",
    icon: CreditCard,
  },
  {
    title: "Active Members",
    value: "1,284",
    change: "+8.2%",
    icon: Users,
  },
  {
    title: "Active Gyms",
    value: "42",
    change: "+4.8%",
    icon: Dumbbell,
  },
  {
    title: "Passes Sold",
    value: "1,936",
    change: "+15.3%",
    icon: Ticket,
  },
];

const monthlyData = [
  { month: "May", value: 42 },
  { month: "Jun", value: 58 },
  { month: "Jul", value: 51 },
  { month: "Aug", value: 73 },
  { month: "Sep", value: 67 },
  { month: "Oct", value: 86 },
];

export default function Analytics() {
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
      <div style={{ marginBottom: "32px" }}>
        <h1
          style={{
            fontSize: "32px",
            margin: 0,
            fontWeight: 700,
          }}
        >
          Analytics
        </h1>

        <p
          style={{
            color: "#777",
            marginTop: "8px",
            fontSize: "15px",
          }}
        >
          Overview of your GymPass platform performance
        </p>
      </div>

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gap: "18px",
          marginBottom: "28px",
        }}
      >
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              style={{
                background: "#111",
                border: "1px solid #202020",
                borderRadius: "16px",
                padding: "22px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "20px",
                }}
              >
                <div
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "12px",
                    background: "rgba(35,238,9,0.10)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon size={20} color="#23ee09" />
                </div>

                <span
                  style={{
                    color: "#23ee09",
                    fontSize: "13px",
                    fontWeight: 600,
                  }}
                >
                  {stat.change}
                </span>
              </div>

              <p
                style={{
                  color: "#777",
                  margin: 0,
                  fontSize: "14px",
                }}
              >
                {stat.title}
              </p>

              <h2
                style={{
                  fontSize: "27px",
                  margin: "7px 0 0",
                }}
              >
                {stat.value}
              </h2>
            </div>
          );
        })}
      </div>

      {/* Main grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "20px",
        }}
      >
        {/* Revenue chart */}
        <div
          style={{
            background: "#111",
            border: "1px solid #202020",
            borderRadius: "16px",
            padding: "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "28px",
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: "19px",
                }}
              >
                Revenue Overview
              </h2>

              <p
                style={{
                  color: "#777",
                  fontSize: "13px",
                  marginTop: "6px",
                }}
              >
                Monthly platform revenue
              </p>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "7px",
                color: "#23ee09",
                fontSize: "13px",
              }}
            >
              <TrendingUp size={16} />
              Growing
            </div>
          </div>

          <div
            style={{
              height: "280px",
              display: "flex",
              alignItems: "flex-end",
              gap: "20px",
              padding: "10px 10px 0",
            }}
          >
            {monthlyData.map((item) => (
              <div
                key={item.month}
                style={{
                  flex: 1,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    maxWidth: "55px",
                    height: `${item.value * 2.5}px`,
                    background:
                      "linear-gradient(to top, #23ee09, #8cff80)",
                    borderRadius: "8px 8px 3px 3px",
                    opacity: 0.85,
                  }}
                />

                <span
                  style={{
                    color: "#666",
                    fontSize: "12px",
                  }}
                >
                  {item.month}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Platform activity */}
        <div
          style={{
            background: "#111",
            border: "1px solid #202020",
            borderRadius: "16px",
            padding: "24px",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: "19px",
            }}
          >
            Platform Activity
          </h2>

          <p
            style={{
              color: "#777",
              fontSize: "13px",
              marginTop: "6px",
              marginBottom: "25px",
            }}
          >
            Current platform status
          </p>

          {[
            ["Gym registrations", "18", "This month"],
            ["New members", "326", "This month"],
            ["Pass activations", "487", "This month"],
            ["Successful payments", "96.8%", "Success rate"],
          ].map(([title, value, subtitle]) => (
            <div
              key={title}
              style={{
                padding: "15px 0",
                borderBottom: "1px solid #202020",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    color: "#aaa",
                    fontSize: "14px",
                  }}
                >
                  {title}
                </span>

                <strong
                  style={{
                    fontSize: "18px",
                  }}
                >
                  {value}
                </strong>
              </div>

              <span
                style={{
                  display: "block",
                  color: "#555",
                  fontSize: "11px",
                  marginTop: "4px",
                }}
              >
                {subtitle}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        <div
          style={{
            background: "#111",
            border: "1px solid #202020",
            borderRadius: "16px",
            padding: "22px",
          }}
        >
          <Activity size={21} color="#23ee09" />

          <h3 style={{ marginTop: "18px", marginBottom: "5px" }}>
            Member Growth
          </h3>

          <p style={{ color: "#777", fontSize: "13px" }}>
            Member registrations are trending upward.
          </p>
        </div>

        <div
          style={{
            background: "#111",
            border: "1px solid #202020",
            borderRadius: "16px",
            padding: "22px",
          }}
        >
          <Dumbbell size={21} color="#23ee09" />

          <h3 style={{ marginTop: "18px", marginBottom: "5px" }}>
            Gym Network
          </h3>

          <p style={{ color: "#777", fontSize: "13px" }}>
            Your partner gym network is expanding.
          </p>
        </div>

        <div
          style={{
            background: "#111",
            border: "1px solid #202020",
            borderRadius: "16px",
            padding: "22px",
          }}
        >
          <CreditCard size={21} color="#23ee09" />

          <h3 style={{ marginTop: "18px", marginBottom: "5px" }}>
            Payments
          </h3>

          <p style={{ color: "#777", fontSize: "13px" }}>
            Payment activity is currently healthy.
          </p>
        </div>
      </div>
    </div>
  );
}