// // import { useState } from "react";
// // import Sidebar from "./components/Sidebar";
// // import Dashboard from "./pages/Dashboard";
// // import Login from "./pages/Login";

// // export default function App() {
// //   const [admin, setAdmin] = useState(() => {
// //     const savedAdmin = localStorage.getItem("adminUser");

// //     if (!savedAdmin) {
// //       return null;
// //     }

// //     try {
// //       return JSON.parse(savedAdmin);
// //     } catch {
// //       localStorage.removeItem("adminUser");
// //       localStorage.removeItem("adminToken");
// //       return null;
// //     }
// //   });

// //   const token = localStorage.getItem("adminToken");

// //   const handleLogin = (adminData) => {
// //     setAdmin(adminData);
// //   };

// //   const handleLogout = () => {
// //     localStorage.removeItem("adminToken");
// //     localStorage.removeItem("adminUser");
// //     setAdmin(null);
// //   };

// //   if (!admin || !token) {
// //     return <Login onLogin={handleLogin} />;
// //   }

// //   return (
// //     <div
// //       style={{
// //         display: "flex",
// //         height: "100vh",
// //         background: "#050505",
// //       }}
// //     >
// //       <Sidebar onLogout={handleLogout} />
// //       <Dashboard />
// //     </div>
// //   );
// // }


// // // import Sidebar from "./components/Sidebar";
// // // import Dashboard from "./pages/Dashboard";

// // // export default function App() {
// // //   return (
// // //     <div
// // //       style={{
// // //         display: "flex",
// // //         height: "100vh",
// // //         background: "#050505",
// // //       }}
// // //     >
// // //       <Sidebar />

// // //       <Dashboard />
// // //     </div>
// // //   );
// // // }

// import { useState } from "react";
// import AdminSetupPassword from "./pages/AdminSetupPassword";
// import Sidebar from "./components/Sidebar";
// import Dashboard from "./pages/Dashboard";
// import Login from "./pages/Login";
// import AdminManagement from "./pages/AdminManagement";

// export default function App() {
//   const [admin, setAdmin] = useState(() => {
//     const savedAdmin = localStorage.getItem("adminUser");



//   const isAdminSetupPassword =
//     window.location.pathname === "/admin/setup-password";

//   if (isAdminSetupPassword) {
//     return <AdminSetupPassword />;
//   }

//   if (!admin || !token) {
//     return <Login onLogin={handleLogin} />;
//   }

//     if (!savedAdmin) {
//       return null;

//     try {
//       return JSON.parse(savedAdmin);
//     } catch {
//       localStorage.removeItem("adminUser");
//       localStorage.removeItem("adminToken");

//       return null;
//     }
//   });

//   const [currentPage, setCurrentPage] = useState("Dashboard");

//   const token = localStorage.getItem("adminToken");

//   const handleLogin = (adminData) => {
//     setAdmin(adminData);
//     setCurrentPage("Dashboard");
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("adminToken");
//     localStorage.removeItem("adminUser");

//     setAdmin(null);
//   };

//   if (!admin || !token) {
//     return <Login onLogin={handleLogin} />;
//   }

//   const renderPage = () => {
//     switch (currentPage) {
//       case  "Settings":
//   if (admin.role !== "superadmin") {
//     return <Dashboard />;
//   }
//   return <AdminManagement />;
//       case "Dashboard":
//       default:
//         return <Dashboard />;
//     }
//   };

//   return (
//     <div
//       style={{
//         display: "flex",
//         height: "100vh",
//         background: "#050505",
//       }}
//     >
//       <Sidebar
//         onLogout={handleLogout}
//         currentPage={currentPage}
//         onNavigate={setCurrentPage}
//       />

//       <div
//         style={{
//           flex: 1,
//           overflowY: "auto",
//         }}
//       >
//         {renderPage()}
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import AdminSetupPassword from "./pages/AdminSetupPassword";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import AdminManagement from "./pages/AdminManagement";
import Gyms from "./pages/Gyms";
import Analytics from "./pages/Analytics";
import Applications from "./pages/Applications";
import AllApplications from "./pages/AllApplications";
import Partners from "./pages/Partners";
import Members from "./pages/Members";
import Passes from "./pages/Passes";
import Payments from "./pages/Payments";
import { getCurrentAdmin } from "./api/admin";

export default function App() {
  const savedToken = localStorage.getItem("adminToken");
  const [admin, setAdmin] = useState(() => {
    const savedAdmin = localStorage.getItem("adminUser");

    if (!savedAdmin) {
      return null;
    }

    try {
      return JSON.parse(savedAdmin);
    } catch {
      localStorage.removeItem("adminUser");
      localStorage.removeItem("adminToken");

      return null;
    }
  });

  const [currentPage, setCurrentPage] = useState("Dashboard");
  const [checkingSession, setCheckingSession] = useState(Boolean(savedToken));

  const token = savedToken;

  useEffect(() => {
    if (!token) {
      return;
    }

    let isMounted = true;

    const validateSession = async () => {
      try {
        const data = await getCurrentAdmin();

        if (!isMounted) {
          return;
        }

        localStorage.setItem("adminUser", JSON.stringify(data.admin));
        setAdmin(data.admin);
      } catch {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");

        if (isMounted) {
          setAdmin(null);
        }
      } finally {
        if (isMounted) {
          setCheckingSession(false);
        }
      }
    };

    validateSession();

    return () => {
      isMounted = false;
    };
  }, [token]);

  const handleLogin = (adminData) => {
    setAdmin(adminData);
    setCurrentPage("Dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");

    setAdmin(null);
  };

  // Admin invitation password setup page
  const isAdminSetupPassword =
    window.location.pathname === "/admin/setup-password";

  if (isAdminSetupPassword) {
    return <AdminSetupPassword />;
  }

  if (checkingSession) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#050505",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Checking session...
      </div>
    );
  }

  // Not logged in
  if (!admin || !token) {
    return <Login onLogin={handleLogin} />;
  }
const renderPage = () => {
  switch (currentPage) {
    case "Applications":
      return <AllApplications />;

    case "Gyms":
      return <Gyms />;

    case "Partners":
      return <Partners />;

    case "Members":
      return <Members />;

    case "Passes":
      return <Passes />;

    case "Analytics":
      return <Analytics />;
      case "Payments":
  return <Payments />;

    case "Settings":
      if (admin.role !== "superadmin") {
        return <Dashboard />;
      }

      return <AdminManagement />;

    case "Dashboard":
      return <Applications/>; 
      
    default:
      return <Dashboard />;
  }
};

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background: "#050505",
      }}
    >
      <Sidebar
        onLogout={handleLogout}
        currentPage={currentPage}
        onNavigate={setCurrentPage}
      />

      <div
        style={{
          flex: 1,
          overflowY: "auto",
        }}
      >
        {renderPage()}
      </div>
    </div>
  );
}
