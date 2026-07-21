import DashboardCard from "../../common/DashboardCard/DashboardCard";
import {
  BatteryCharging,
  Battery,
  PauseCircle,
  Gauge,
  Zap,
  RotateCw,
} from "lucide-react";

const cards = [
  {
    key: "cycleNo",
    label: "Cycle No",
    icon: RotateCw,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
  },
  {
    key: "chargeCap",
    label: "Charge Cap.",
    icon: BatteryCharging,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  {
    key: "dischargeCap",
    label: "Discharge Cap.",
    icon: Battery,
    color: "text-orange-400",
    bg: "bg-orange-500/10",
  },
  {
    key: "efficiency",
    label: "Efficiency",
    icon: Gauge,
    color: "text-pink-400",
    bg: "bg-pink-500/10",
  },
  {
    key: "chargeEnergy",
    label: "Charge Energy",
    icon: Zap,
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
  },
  {
    key: "dischargeEnergy",
    label: "Discharge Energy",
    icon: PauseCircle,
    color: "text-violet-400",
    bg: "bg-violet-500/10",
  },
];

export default function CycleSummary({ cycle = [] }) {
  if (!cycle.length) {
    return (
      <DashboardCard
        title="Cycle Summary"
        className="border-[#2B313C] bg-[#181C24]"
      >
        <div className="py-10 text-center text-slate-400">
          No cycle data available.
        </div>
      </DashboardCard>
    );
  }

  const latest = cycle[cycle.length - 1];

  const summary = {
    cycleNo: latest["Cycle Index"] ?? "-",

    chargeCap:
      latest["Chg. Cap.(Ah)"] != null
        ? `${latest["Chg. Cap.(Ah)"]} Ah`
        : "-",

    dischargeCap:
      latest["DChg. Cap.(Ah)"] != null
        ? `${latest["DChg. Cap.(Ah)"]} Ah`
        : "-",

    efficiency:
      latest["Chg.-DChg. Eff(%)"] != null
        ? `${latest["Chg.-DChg. Eff(%)"]} %`
        : "-",

    chargeEnergy:
      latest["Chg. Energy(Wh)"] != null
        ? `${latest["Chg. Energy(Wh)"]} Wh`
        : "-",

    dischargeEnergy:
      latest["DChg. Energy(Wh)"] != null
        ? `${latest["DChg. Energy(Wh)"]} Wh`
        : "-",
  };

  return (
    <DashboardCard
      title="Cycle Summary"
      className="border-[#2B313C] bg-[#181C24]"
    >
      <div className="mb-5 flex items-center justify-between rounded-xl border border-[#2B313C] bg-[#141821] p-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
            Test Status
          </p>

          <div className="mt-2 flex items-center gap-3">
            <span className="h-3 w-3 rounded-full bg-emerald-400" />

            <span className="text-lg font-semibold text-emerald-400">
              Completed
            </span>
          </div>
        </div>

        <div className="text-right">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
            Total Cycles
          </p>

          <p className="mt-2 text-3xl font-bold text-cyan-400">
            {cycle.length}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.key}
              className="rounded-xl border border-[#2B313C] bg-[#141821] p-4 transition-all duration-300 hover:border-cyan-500/30 hover:-translate-y-1"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                    {card.label}
                  </p>

                  <p className="mt-3 font-mono text-base font-bold text-white break-words">
                    {summary[card.key]}
                  </p>
                </div>

                <div className={`rounded-lg p-3 ${card.bg}`}>
                  <Icon
                    size={14}
                    className={card.color}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </DashboardCard>
  );
}