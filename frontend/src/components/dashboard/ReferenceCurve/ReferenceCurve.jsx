import DashboardCard from "../../common/DashboardCard/DashboardCard";

export default function ReferenceCurve({
  curveImageUrl,
  curveLabel,
  latestVoltage,
  targetVoltage = 96,
}) {
  const current =
    latestVoltage !== undefined && latestVoltage !== null
      ? Number(latestVoltage)
      : null;

  const deviation =
    current !== null
      ? (current - targetVoltage).toFixed(2)
      : null;

  const withinLimit =
    current !== null
      ? Math.abs(current - targetVoltage) <= 1
      : false;

  return (
    <DashboardCard
      title="Reference Curve"
      className="border-[#2B313C] bg-[#181C24]"
    >
      <div className="flex h-[340px] items-center justify-center rounded-xl border border-dashed border-[#2B313C] bg-[#141821]">
        {curveImageUrl ? (
          <img
            src={`https://retron-bms-dashboard.onrender.com${curveImageUrl}`}
            alt={curveLabel || "Reference Curve"}
            className="max-h-full max-w-full object-contain"
          />
        ) : (
          <div className="text-center">
            <p className="text-lg font-semibold text-slate-300">
              No Reference Curve Available
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Backend has not provided a reference curve.
            </p>
          </div>
        )}
      </div>

      <div className="mt-4 grid grid-cols-4 gap-4 border-t border-[#2B313C] pt-4">
        <div>
          <p className="text-xs uppercase tracking-wider text-slate-500">
            Target
          </p>

          <p className="mt-1 text-lg font-semibold text-cyan-400">
            {targetVoltage} V
          </p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wider text-slate-500">
            Current
          </p>

          <p className="mt-1 text-lg font-semibold text-white">
            {current !== null ? `${current.toFixed(2)} V` : "--"}
          </p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wider text-slate-500">
            Deviation
          </p>

          <p className="mt-1 text-lg font-semibold text-orange-400">
            {deviation !== null ? `${deviation} V` : "--"}
          </p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wider text-slate-500">
            Status
          </p>

          <span
            className={`mt-1 inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
              withinLimit
                ? "bg-emerald-500/15 text-emerald-400"
                : "bg-red-500/15 text-red-400"
            }`}
          >
            {current === null
              ? "No Data"
              : withinLimit
              ? "Within Limit"
              : "Out of Limit"}
          </span>
        </div>
      </div>
    </DashboardCard>
  );
}