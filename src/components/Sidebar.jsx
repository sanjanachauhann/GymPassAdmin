import {
  LayoutDashboard,
  ClipboardList,
  Dumbbell,
  Users,
  User,
  Ticket,
  CreditCard,
  BarChart3,
  Settings,
} from "lucide-react";

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Applications",
    icon: ClipboardList,
  },
  {
    title: "Gyms",
    icon: Dumbbell,
  },
  {
    title: "Partners",
    icon: Users,
  },
  {
    title: "Members",
    icon: User,
  },
  {
    title: "Passes",
    icon: Ticket,
  },
  {
    title: "Payments",
    icon: CreditCard,
  },
  {
    title: "Analytics",
    icon: BarChart3,
  },
  {
    title: "Settings",
    icon: Settings,
  },
];

export default function Sidebar() {
  return (
    <aside
      style={{
        width: 260,
        background: "#0D0D0D",
        borderRight: "1px solid #1E1E1E",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        padding: 24,
      }}
    >
      <h1
        style={{
          color: "#00F5D4",
          fontSize: 28,
          fontWeight: 700,
          marginBottom: 50,
        }}
      >
        GymPass
      </h1>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {menuItems.map((item, index) => {
          const Icon = item.icon;

          return (
            <button
              key={item.title}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                border: "none",
                background:
                  index === 0 ? "rgba(0,245,212,.15)" : "transparent",
                color: index === 0 ? "#00F5D4" : "#AAA",
                padding: "14px 16px",
                borderRadius: 14,
                fontSize: 16,
                cursor: "pointer",
                transition: ".2s",
              }}
            >
              <Icon size={20} />

              {item.title}
            </button>
          );
        })}
      </div>
    </aside>
  );
} 