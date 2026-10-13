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
  LogOut,
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

export default function Sidebar({
  onLogout,
  currentPage,
  onNavigate,
}) {
  return (
    <aside
      style={{
        width: 260,
        minWidth: 260,
        background: "#0D0D0D",
        borderRight: "1px solid #1E1E1E",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        padding: 24,
        boxSizing: "border-box",
      }}
    >
      {/* Logo */}
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

      {/* Navigation */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          flex: 1,
        }}
      >
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.title}
              onClick={() => onNavigate(item.title)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                border: "none",
                background:
                  currentPage === item.title
                    ? "rgba(0,245,212,.15)"
                    : "transparent",
                color:
                  currentPage === item.title
                    ? "#00F5D4"
                    : "#AAA",
                padding: "14px 16px",
                borderRadius: 14,
                fontSize: 16,
                cursor: "pointer",
                transition: ".2s",
                textAlign: "left",
                width: "100%",
              }}
            >
              <Icon size={20} />

              {item.title}
            </button>
          );
        })}
      </div>

      {/* Logout */}
      <button
        onClick={onLogout}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          border: "1px solid #292929",
          background: "transparent",
          color: "#AAA",
          padding: "14px 16px",
          borderRadius: 14,
          fontSize: 16,
          cursor: "pointer",
          textAlign: "left",
          width: "100%",
        }}
      >
        <LogOut size={20} />
        Logout
      </button>
    </aside>
  );
}