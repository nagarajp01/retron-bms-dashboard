import DashboardCard from "../../common/DashboardCard/DashboardCard";
import {
  Play,
  Clock3,
  CalendarDays,
  TimerReset,
  CheckCircle2,
} from "lucide-react";

const defaultSession = {
  sessionId: "TS-20260720-001",
  startTime: "20 Jul 2026 09:30:15",
  elapsed: "02:18:42",
  estimatedRemaining: "00:45:18",
  state: "Running",
};

export default function TestSession({
  session = defaultSession,
}) {
  return (
    <DashboardCard
      title="Test Session"
      className="border-[#2B313C] bg-[#181C24]"
    >
      <div className="space-y-4">

        <div className="flex items-center justify-between rounded-xl border border-[#2B313C] bg-[#141821] p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-emerald-500/10 p-3">
              <Play
                size={22}
                className="text-emerald-400"
              />
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                Session Status
              </p>

              <p className="mt-1 text-lg font-semibold text-emerald-400">
                {session.state}
              </p>
            </div>
          </div>

          <span className="h-3 w-3 animate-pulse rounded-full bg-emerald-400" />
        </div>

        <div className="grid gap-3">

          <InfoRow
            icon={CheckCircle2}
            label="Session ID"
            value={session.sessionId}
            color="text-cyan-400"
          />

          <InfoRow
            icon={CalendarDays}
            label="Start Time"
            value={session.startTime}
            color="text-orange-400"
          />

          <InfoRow
            icon={Clock3}
            label="Elapsed Time"
            value={session.elapsed}
            color="text-emerald-400"
          />

          <InfoRow
            icon={TimerReset}
            label="Remaining"
            value={session.estimatedRemaining}
            color="text-violet-400"
          />

        </div>
      </div>
    </DashboardCard>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
  color,
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-[#2B313C] bg-[#141821] px-4 py-3 transition hover:border-cyan-500/30">
      <div className="flex items-center gap-3">
        <Icon
          size={18}
          className={color}
        />

        <span className="text-sm text-slate-400">
          {label}
        </span>
      </div>

      <span className="font-mono font-semibold text-white">
        {value}
      </span>
    </div>
  );
}