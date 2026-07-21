export default function StatusBar({
  latest = {},
  totalRecords = 0,
  session = {},
}) {
  const status =
    totalRecords > 0
      ? "Streaming Live"
      : "Waiting";

  const device =
    session?.unit?.device || "--";

  const filename =
    session?.unit?.filename || "No Session";

  return (
    <footer className="mt-6 rounded-xl border border-[#2B313C] bg-[#181C24] px-6 py-3">
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-400">

        <span className="font-medium text-slate-200">
          {filename}
        </span>

        <span>
          Device: {device}
        </span>

        <span>
          Records: {totalRecords}
        </span>

        <span>
          Voltage: {Number(latest?.voltage ?? 0).toFixed(2)} V
        </span>

        <span>
          Current: {Number(latest?.current ?? 0).toFixed(2)} A
        </span>

        <span
          className={`font-medium ${
            totalRecords > 0
              ? "text-green-400"
              : "text-yellow-400"
          }`}
        >
          ● {status}
        </span>

      </div>
    </footer>
  );
}