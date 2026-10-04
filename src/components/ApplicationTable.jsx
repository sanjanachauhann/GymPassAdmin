import { ChevronRight } from "lucide-react";

const applications = [
  {
    id: 1,
    gym: "Powerhouse Gym",
    owner: "Raj Patel",
    status: "Pending",
    date: "Today",
  },
  {
    id: 2,
    gym: "Rise Combat Sports",
    owner: "John Smith",
    status: "Approved",
    date: "Yesterday",
  },
  {
    id: 3,
    gym: "Gold's Gym",
    owner: "Mike Brown",
    status: "Rejected",
    date: "Jul 3",
  },
];

const statusColor = {
  Pending: "bg-yellow-500/20 text-yellow-400",
  Approved: "bg-emerald-500/20 text-emerald-400",
  Rejected: "bg-red-500/20 text-red-400",
};

export default function ApplicationTable() {
  return (
    <div className="mt-10 rounded-3xl border border-zinc-800 bg-[#111] p-6">

      <div className="mb-6 flex items-center justify-between">

        <div>

          <h2 className="text-2xl font-bold">
            Recent Applications
          </h2>

          <p className="mt-1 text-sm text-zinc-500">
            New gyms waiting for approval
          </p>

        </div>

        <button className="rounded-xl bg-[#00F5D4] px-5 py-2 font-semibold text-black transition hover:scale-95">
          View All
        </button>

      </div>

      <table className="w-full">

        <thead>

          <tr className="border-b border-zinc-800 text-left text-zinc-500">

            <th className="pb-4">Gym</th>
            <th className="pb-4">Owner</th>
            <th className="pb-4">Status</th>
            <th className="pb-4">Date</th>
            <th className="pb-4"></th>

          </tr>

        </thead>

        <tbody>

          {applications.map((item) => (

            <tr
              key={item.id}
              className="border-b border-zinc-900 transition hover:bg-white/5"
            >

              <td className="py-5 font-semibold">
                {item.gym}
              </td>

              <td className="text-zinc-400">
                {item.owner}
              </td>

              <td>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColor[item.status]}`}
                >
                  {item.status}
                </span>

              </td>

              <td className="text-zinc-500">
                {item.date}
              </td>

              <td>

                <button className="rounded-lg p-2 transition hover:bg-[#00F5D4]/10">

                  <ChevronRight
                    className="text-[#00F5D4]"
                    size={20}
                  />

                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}