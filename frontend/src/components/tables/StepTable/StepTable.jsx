import DashboardCard from "../../common/DashboardCard/DashboardCard";
import {
  Play,
  Clock3,
  CheckCircle2,
  PauseCircle,
  XCircle,
} from "lucide-react";

function StatusBadge({ status }) {
  switch (status) {
    case "Running":
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-400">
          <Play size={12} />
          Running
        </span>
      );

    case "Completed":
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-cyan-500/15 px-3 py-1 text-xs font-semibold text-cyan-400">
          <CheckCircle2 size={12} />
          Completed
        </span>
      );

    case "Paused":
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-orange-500/15 px-3 py-1 text-xs font-semibold text-orange-400">
          <PauseCircle size={12} />
          Paused
        </span>
      );

    case "Failed":
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-red-500/15 px-3 py-1 text-xs font-semibold text-red-400">
          <XCircle size={12} />
          Failed
        </span>
      );

    default:
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-600/20 px-3 py-1 text-xs font-semibold text-slate-300">
          <Clock3 size={12} />
          Pending
        </span>
      );
  }
}

export default function StepTable({ steps = [] }) {
  return (
    <DashboardCard
      title="Step Breakdown"
      className="border-[#2B313C] bg-[#181C24]"
    >
      <div className="overflow-hidden rounded-lg border border-[#2B313C]">
        <table className="w-full">
          <thead className="bg-[#1E2430] text-xs uppercase tracking-wider text-slate-400">
            <tr>
              <th className="px-4 py-3 text-left">Step</th>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-left">Time</th>
              <th className="px-4 py-3 text-left">Capacity</th>
              <th className="px-4 py-3 text-left">Energy</th>
              <th className="px-4 py-3 text-left">End Voltage</th>
              <th className="px-4 py-3 text-center">Status</th>
            </tr>
          </thead>

          <tbody>
            {steps.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-8 text-center text-slate-400"
                >
                  No step data available.
                </td>
              </tr>
            ) : (
              steps.map((step, index) => {
                let status = "Completed";

                if (index === steps.length - 1) {
                  status = "Running";
                }

                return (
                  <tr
                    key={index}
                    className={`border-t border-[#2B313C] transition-all duration-200 ${
                      status === "Running"
                        ? "bg-emerald-500/5"
                        : "hover:bg-[#202632]"
                    }`}
                  >
                    <td className="px-4 py-4 font-mono text-cyan-400">
                      {step["Step Index"]}
                    </td>

                    <td className="px-4 py-4 font-medium text-white">
                      {step["Step Type"]}
                    </td>

                    <td className="px-4 py-4 text-slate-300">
                      {step["Step Time"] || "-"}
                    </td>

                    <td className="px-4 py-4 text-cyan-300">
                      {step["Capacity(Ah)"] != null
                        ? `${step["Capacity(Ah)"]} Ah`
                        : "-"}
                    </td>

                    <td className="px-4 py-4 text-yellow-300">
                      {step["Energy(Wh)"] != null
                        ? `${step["Energy(Wh)"]} Wh`
                        : "-"}
                    </td>

                    <td className="px-4 py-4 text-orange-300">
                      {step["End Voltage(V)"] != null
                        ? `${step["End Voltage(V)"]} V`
                        : "-"}
                    </td>

                    <td className="px-4 py-4 text-center">
                      <StatusBadge status={status} />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </DashboardCard>
  );
}