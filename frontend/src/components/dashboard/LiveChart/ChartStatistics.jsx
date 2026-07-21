import {
  Activity,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Database,
} from "lucide-react";

export default function ChartStatistics({
  data,
  selectedMetric,
}) {
  if (!data || data.length === 0) return null;

  const values = data
    .map((d) => Number(d[selectedMetric]))
    .filter((v) => !isNaN(v));

  if (!values.length) return null;

  const current = values[values.length - 1];
  const maximum = Math.max(...values);
  const minimum = Math.min(...values);
  const average =
    values.reduce((a, b) => a + b, 0) / values.length;

  const units = {
    voltage: "V",
    current: "A",
    power: "W",
    capacity: "Ah",
    energy: "Wh",
  };

  const unit = units[selectedMetric] || "";

  const stats = [
    {
      title: "Current",
      value: current.toFixed(2),
      icon: Activity,
      color: "text-cyan-400",
      bg: "bg-cyan-500/10",
    },
    {
      title: "Maximum",
      value: maximum.toFixed(2),
      icon: TrendingUp,
      color: "text-green-400",
      bg: "bg-green-500/10",
    },
    {
      title: "Minimum",
      value: minimum.toFixed(2),
      icon: TrendingDown,
      color: "text-red-400",
      bg: "bg-red-500/10",
    },
    {
      title: "Average",
      value: average.toFixed(2),
      icon: BarChart3,
      color: "text-orange-400",
      bg: "bg-orange-500/10",
    },
    {
      title: "Samples",
      value: values.length,
      icon: Database,
      color: "text-violet-400",
      bg: "bg-violet-500/10",
      unit: "",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 border-b border-[#2A313D] bg-[#171B23] p-4 lg:grid-cols-5">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.title}
            className="rounded-lg border border-[#2B313C] bg-[#1E2430] p-4 transition hover:border-cyan-500/30"
          >
            <div className="mb-3 flex items-center justify-between">
              <div
                className={`rounded-lg p-2 ${stat.bg}`}
              >
                <Icon
                  size={18}
                  className={stat.color}
                />
              </div>

              <span className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
                {stat.title}
              </span>
            </div>

            <div className="flex items-end gap-1">
              <span className="text-2xl font-bold text-white">
                {stat.value}
              </span>

              {stat.title !== "Samples" && (
                <span className="pb-1 text-sm text-slate-400">
                  {unit}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}