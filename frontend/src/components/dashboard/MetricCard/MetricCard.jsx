import { TrendingUp, TrendingDown, Activity } from "lucide-react";

const colorMap = {
  voltage: {
    value: "text-cyan-400",
    icon: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/30",
  },

  current: {
    value: "text-emerald-400",
    icon: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
  },

  power: {
    value: "text-orange-400",
    icon: "text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/30",
  },

  capacity: {
    value: "text-violet-400",
    icon: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/30",
  },

  energy: {
    value: "text-pink-400",
    icon: "text-pink-400",
    bg: "bg-pink-500/10",
    border: "border-pink-500/30",
  },
};

export default function MetricCard({
  title,
  value,
  unit,
  type = "voltage",
  trend = 0,
}) {
  const theme = colorMap[type] || colorMap.voltage;

  const positive = trend >= 0;

  return (
    <div
      className={`
        h-[130px]
        rounded-xl
        border
        ${theme.border}
        bg-[#171B23]
        shadow-lg
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-cyan-500/10
      `}
    >
      <div className="flex h-full flex-col justify-between p-5">
        {/* TOP */}

        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
              {title}
            </p>

            <div className="mt-4 flex items-end gap-2">
              <span
                className={`text-4xl font-bold leading-none ${theme.value}`}
              >
                {value}
              </span>

              <span className="pb-1 text-lg text-slate-400">{unit}</span>
            </div>
          </div>

          <div
            className={`
              ${theme.bg}
              rounded-xl
              p-3
            `}
          >
            <Activity className={theme.icon} size={22} />
          </div>
        </div>

        {/* Divider */}

        <div className="my-2 h-px bg-[#2D3645]" />

        {/* Bottom */}

        <div className="flex items-center justify-between">
          <div
            className={`
              flex
              items-center
              gap-2
              rounded-full
              bg-green-500/10
              px-3
              py-1
            `}
          >
            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-green-400" />

            <span className="text-xs font-medium text-green-400">
              LIVE
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}