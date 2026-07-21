import {
  Zap,
  Gauge,
  BatteryCharging,
  Activity,
  Battery,
} from "lucide-react";

const metrics = [
  {
    key: "voltage",
    label: "Voltage",
    color: "cyan",
    icon: Gauge,
  },
  {
    key: "current",
    label: "Current",
    color: "emerald",
    icon: Activity,
  },
  {
    key: "power",
    label: "Power",
    color: "orange",
    icon: Zap,
  },
  {
    key: "capacity",
    label: "Capacity",
    color: "violet",
    icon: BatteryCharging,
  },
  {
    key: "energy",
    label: "Energy",
    color: "pink",
    icon: Battery,
  },
];

const colorClasses = {
  cyan: {
    active: "bg-cyan-500 text-black",
    inactive:
      "bg-[#202733] text-cyan-300 hover:bg-cyan-500/10 border border-cyan-500/20",
  },

  emerald: {
    active: "bg-emerald-500 text-black",
    inactive:
      "bg-[#202733] text-emerald-300 hover:bg-emerald-500/10 border border-emerald-500/20",
  },

  orange: {
    active: "bg-orange-500 text-black",
    inactive:
      "bg-[#202733] text-orange-300 hover:bg-orange-500/10 border border-orange-500/20",
  },

  violet: {
    active: "bg-violet-500 text-black",
    inactive:
      "bg-[#202733] text-violet-300 hover:bg-violet-500/10 border border-violet-500/20",
  },

  pink: {
    active: "bg-pink-500 text-black",
    inactive:
      "bg-[#202733] text-pink-300 hover:bg-pink-500/10 border border-pink-500/20",
  },
};

export default function MetricTabs({
  selectedMetric,
  setSelectedMetric,
}) {
  return (
    <div className="flex flex-wrap gap-3 border-b border-[#2A313D] bg-[#171B23] px-6 py-4">
      {metrics.map((metric) => {
        const Icon = metric.icon;

        const active = selectedMetric === metric.key;

        return (
          <button
            key={metric.key}
            onClick={() => setSelectedMetric(metric.key)}
            className={`
              flex items-center gap-2
              rounded-lg
              px-4
              py-2
              text-sm
              font-medium
              transition-all
              duration-200
              ${
                active
                  ? colorClasses[metric.color].active
                  : colorClasses[metric.color].inactive
              }
            `}
          >
            <Icon size={17} />

            {metric.label}
          </button>
        );
      })}
    </div>
  );
}