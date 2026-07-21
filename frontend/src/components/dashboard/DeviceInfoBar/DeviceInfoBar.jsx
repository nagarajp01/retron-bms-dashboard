import {
  CalendarDays,
  Clock3,
  BatteryCharging,
  Gauge,
  Activity,
  Settings2,
  Wifi,
  Cpu,
} from "lucide-react";

const items = [
  {
    key: "startTime",
    icon: CalendarDays,
    label: "Test Started",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
  },
  {
    key: "endTime",
    icon: Clock3,
    label: "Test Ended",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  {
    key: "cycleCount",
    icon: BatteryCharging,
    label: "Cycle Count",
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
  },
  {
    key: "voltageRange",
    icon: Gauge,
    label: "Voltage Range",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
  },
  {
    key: "currentRange",
    icon: Activity,
    label: "Current Range",
    color: "text-orange-400",
    bg: "bg-orange-500/10",
  },
  {
    key: "recordSettings",
    icon: Settings2,
    label: "Record Settings",
    color: "text-sky-400",
    bg: "bg-sky-500/10",
  },
];

export default function DeviceInfoBar({
  unit,
  test,
}) {
  if (!unit || !test) return null;

  const deviceInfo = {
    startTime: unit.startTime || "-",
    endTime: unit.endTime || "-",
    cycleCount: test.cycleCount || "-",
    voltageRange: test.voltageRange || "-",
    currentRange: test.currentRange || "-",
    recordSettings: test.recordSettings || "-",

    // Backend doesn't currently provide these
    connection: "Connected",
    firmware: unit.device
      ? `Channel ${unit.device}`
      : "N/A",
  };

  return (
    <div className="mb-5 space-y-4">
      {/* Top Status Bar */}

      <div className="flex flex-col gap-3 rounded-xl border border-[#2B3341] bg-[#171B23] p-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-5">
          {/* <div className="flex items-center gap-2">
            <Wifi
              size={18}
              className="text-emerald-400"
            />

            <span className="text-sm font-semibold text-emerald-400">
              {deviceInfo.connection}
            </span>
          </div> */}

          <div className="flex items-center gap-2">
            <Cpu
              size={18}
              className="text-cyan-400"
            />

            <span className="text-sm text-slate-300">
              {deviceInfo.firmware}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-slate-500">
          {unit.filename}
        </div>
      </div>

      {/* Information Cards */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.key}
              className="rounded-xl border border-[#2B3341] bg-[#171B23] p-4 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/40"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                    {item.label}
                  </p>

                  <p className="mt-3 font-mono text-lg font-bold text-white break-all">
                    {deviceInfo[item.key]}
                  </p>
                </div>

                <div className={`rounded-lg p-3 ${item.bg}`}>
                  <Icon
                    size={20}
                    className={item.color}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}