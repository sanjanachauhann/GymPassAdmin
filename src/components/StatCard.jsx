import { ArrowUpRight } from "lucide-react";

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
}) {
  return (
    <div className="group rounded-3xl border border-zinc-800 bg-[#111111] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#00F5D4]/40">
      <div className="flex items-center justify-between">
        <div className="rounded-2xl bg-[#00F5D4]/10 p-3">
          <Icon className="h-6 w-6 text-[#00F5D4]" />
        </div>

        <ArrowUpRight className="h-5 w-5 text-zinc-600 transition group-hover:text-[#00F5D4]" />
      </div>

      <p className="mt-8 text-sm text-zinc-500">
        {title}
      </p>

      <h2 className="mt-2 text-4xl font-bold text-white">
        {value}
      </h2>

      <p className="mt-3 text-sm text-emerald-400">
        {subtitle}
      </p>
    </div>
  );
}