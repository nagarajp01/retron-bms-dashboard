import { useEffect, useRef } from "react";
import DashboardCard from "../../common/DashboardCard/DashboardCard";
import {
  Info,
  CheckCircle2,
  AlertTriangle,
  XCircle,
} from "lucide-react";

function LogIcon({ type }) {
  switch (type) {
    case "SUCCESS":
      return <CheckCircle2 size={16} className="text-emerald-400" />;

    case "WARNING":
      return <AlertTriangle size={16} className="text-yellow-400" />;

    case "ERROR":
      return <XCircle size={16} className="text-red-400" />;

    case "PROMPT":
      return <Info size={16} className="text-indigo-400" />;

    case "RECORD":
      return <Info size={16} className="text-blue-400" />;

    default:
      return <Info size={16} className="text-cyan-400" />;
  }
}

function Badge({ type }) {
  const styles = {
    INFO: "bg-cyan-500/15 text-cyan-400",
    SUCCESS: "bg-emerald-500/15 text-emerald-400",
    WARNING: "bg-yellow-500/15 text-yellow-400",
    ERROR: "bg-red-500/15 text-red-400",
    PROMPT: "bg-indigo-500/15 text-indigo-400",
    RECORD: "bg-blue-500/15 text-blue-400",
  };

  return (
    <span
      className={`rounded-full px-2 py-1 text-[10px] font-semibold ${
        styles[type] || styles.INFO
      }`}
    >
      {type}
    </span>
  );
}

export default function IdleLog({ logs }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <DashboardCard
      title="System Event Log"
      className="border-[#2B313C] bg-[#181C24]"
    >
      <div
        ref={scrollRef}
        className="h-[220px] overflow-y-auto rounded-lg border border-[#2B313C] bg-[#131820]"
      >
        {logs.length === 0 ? (
          <div className="flex h-full items-center justify-center text-slate-500">
            Waiting for events...
          </div>
        ) : (
          logs.map((log, index) => (
            <div
              key={index}
              className="flex items-center gap-4 border-b border-[#252C37] px-4 py-3 transition hover:bg-[#202632]"
            >
              <LogIcon type={log.type} />

              {/* Data Point */}
              <span className="w-14 font-mono text-amber-400">
                DP {log.dataPoint}
              </span>

              {/* Time */}
              <span className="w-20 font-mono text-cyan-400">
                {log.time}
              </span>

              <Badge type={log.type} />

              <span className="flex-1 text-slate-300">
                {log.message}
              </span>
            </div>
          ))
        )}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-[#2B313C] pt-3 text-sm">
        <span className="text-slate-500">
          Total Events
        </span>

        <span className="font-semibold text-cyan-400">
          {logs.length}
        </span>
      </div>
    </DashboardCard>
  );
}