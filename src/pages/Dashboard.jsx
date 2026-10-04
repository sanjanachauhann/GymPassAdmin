import ApplicationTable from "../components/ApplicationTable";
import Header from "../components/Header";
import StatCard from "../components/StatCard";

import {
  Building2,
  Users,
  Wallet,
  ClipboardList,
} from "lucide-react";
import Applications from "./Applications";

export default function Dashboard() {
  return (
    <div className="flex-1 bg-[#050505] p-10">
      <Header />

      <div className="mt-10 grid grid-cols-4 gap-6">

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
      {/* <ApplicationTable/> */}
      <Applications />
    </div>
  );
}