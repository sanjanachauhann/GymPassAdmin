// // import ApplicationTable from "../components/ApplicationTable";
// // import Header from "../components/Header";
// // import StatCard from "../components/StatCard";

// // import {
// //   Building2,
// //   Users,
// //   Wallet,
// //   ClipboardList,
// // } from "lucide-react";
// // import Applications from "./Applications";

// // export default function Dashboard() {
// //   return (
// //     <div className="flex-1 bg-[#050505] p-10">
// //       <Header />

// //       <div className="mt-10 grid grid-cols-4 gap-6">

// //         <StatCard
// //           title="Pending Applications"
// //           value="24"
// //           subtitle="+8 this week"
// //           icon={ClipboardList}
// //         />

// //         <StatCard
// //           title="Approved Gyms"
// //           value="126"
// //           subtitle="+12 this month"
// //           icon={Building2}
// //         />

// //         <StatCard
// //           title="Members"
// //           value="12,487"
// //           subtitle="+421 this week"
// //           icon={Users}
// //         />

// //         <StatCard
// //           title="Revenue"
// //           value="₹18.2L"
// //           subtitle="+14%"
// //           icon={Wallet}
// //         />

// //       </div>
// //       {/* <ApplicationTable/> */}
// //       <Applications />
// //     </div>
// //   );
// // }


// import { useState } from "react";
// import {
//   Building2,
//   Users,
//   Wallet,
//   ClipboardList,
//   RefreshCw,
// } from "lucide-react";

// import Header from "../components/Header";
// import StatCard from "../components/StatCard";
// import Applications from "./Applications";

// export default function Dashboard() {
//   const [refreshKey, setRefreshKey] = useState(0);
//   const [refreshing, setRefreshing] = useState(false);

//   const refreshApplications = () => {
//     setRefreshing(true);
//     setRefreshKey((previous) => previous + 1);
//   };

//   return (
//     <div className="flex-1 bg-[#050505] p-10">
//       <div className="flex items-center justify-between">
//         <Header />

//         <button
//           onClick={refreshApplications}
//           disabled={refreshing}
//           className="flex items-center gap-2 rounded-xl border border-[#262626] bg-[#111] px-4 py-2.5 text-sm font-semibold text-white transition hover:border-[#23ee09] hover:text-[#23ee09] disabled:cursor-not-allowed disabled:opacity-60"
//         >
//           <RefreshCw
//             size={16}
//             className={refreshing ? "animate-spin" : ""}
//           />
//           {refreshing ? "Refreshing..." : "Refresh"}
//         </button>
//       </div>

//       <div className="mt-10 grid grid-cols-4 gap-6">
//         <StatCard
//           title="Pending Applications"
//           value="24"
//           subtitle="+8 this week"
//           icon={ClipboardList}
//         />

//         <StatCard
//           title="Approved Gyms"
//           value="126"
//           subtitle="+12 this month"
//           icon={Building2}
//         />

//         <StatCard
//           title="Members"
//           value="12,487"
//           subtitle="+421 this week"
//           icon={Users}
//         />

//         <StatCard
//           title="Revenue"
//           value="₹18.2L"
//           subtitle="+14%"
//           icon={Wallet}
//         />
//       </div>

//       <Applications
//         key={refreshKey}
//         onRefreshComplete={() => setRefreshing(false)}
//       />
//     </div>
//   );
// }


import { useState } from "react";
import {
  Building2,
  Users,
  Wallet,
  ClipboardList,
  RefreshCw,
} from "lucide-react";

import StatCard from "../components/StatCard";
import Applications from "./Applications";

export default function Dashboard() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const refreshApplications = () => {
    setRefreshing(true);
    setRefreshKey((previous) => previous + 1);
  };

  return (
    <div className="flex-1 bg-[#050505] p-10 min-h-screen">

      {/* Dashboard Header + Refresh Button */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Dashboard
          </h1>

          <p className="mt-2 text-gray-400">
            Overview of your GymPass platform
          </p>
        </div>

        <button
          type="button"
          onClick={refreshApplications}
          disabled={refreshing}
          className="inline-flex items-center gap-2 rounded-xl
            border border-[#262626] bg-[#111111]
            px-4 py-3 text-white transition-colors
            hover:border-[#23ee09] hover:text-[#23ee09]
            disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw
            size={18}
            className={refreshing ? "animate-spin" : ""}
          />

          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Dashboard Stats */}
      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Pending Applications"
          value="24"
          subtitle="+8 this week"
          icon={ClipboardList}
        />

        <StatCard
          title="Approved Gyms"
          value="126"
          subtitle="+12 this month"
          icon={Building2}
        />

        <StatCard
          title="Members"
          value="12,487"
          subtitle="+421 this week"
          icon={Users}
        />

        <StatCard
          title="Revenue"
          value="₹18.2L"
          subtitle="+14%"
          icon={Wallet}
        />
      </div>

      {/* Applications */}
      <div className="mt-10">
        <Applications
          key={refreshKey}
          onRefreshComplete={() => setRefreshing(false)}
        />
      </div>

    </div>
  );
}
