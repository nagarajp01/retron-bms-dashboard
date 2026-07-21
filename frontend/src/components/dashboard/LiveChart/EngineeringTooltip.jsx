const units = {
  voltage: "V",
  current: "A",
  power: "W",
  capacity: "Ah",
  energy: "Wh",
};
export default function EngineeringTooltip({
  active,
  payload,
  label,
}) {
  if (!active || !payload?.length) return null;

  const item = payload[0];

  return (
    <div className="rounded-lg border border-[#2B313C] bg-[#161A21] p-3 shadow-xl">

      <p className="mb-2 text-xs text-slate-400">
        {label}
      </p>

      <div className="flex items-center justify-between gap-5">

        <span
          style={{
            color: item.color,
          }}
          className="font-semibold capitalize"
        >
          {item.name}
        </span>

        <span className="font-bold text-white">
          {Number(item.value).toFixed(2)} {units[item.name]}
        </span>

      </div>

    </div>
  );
}