import { Pause, Play, Download } from "lucide-react";

export default function ChartControls({
  paused,
  setPaused,
  visibleMetrics,
  toggleMetric,
  exportCSV,
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#2B313C] bg-[#181C24] px-5 py-3">

      <div className="flex flex-wrap gap-3">

        {Object.keys(visibleMetrics).map((metric) => (

          <label
            key={metric}
            className="flex cursor-pointer items-center gap-2 text-sm text-slate-300"
          >

            <input
              type="checkbox"
              checked={visibleMetrics[metric]}
              onChange={() => toggleMetric(metric)}
            />

            <span className="capitalize">
              {metric}
            </span>

          </label>

        ))}

      </div>

      <div className="flex items-center gap-3">

        <button
          onClick={() => setPaused(!paused)}
          className="flex items-center gap-2 rounded bg-[#2B313C] px-3 py-2 text-sm hover:bg-[#394150]"
        >

          {paused ? <Play size={16} /> : <Pause size={16} />}

          {paused ? "Resume" : "Pause"}

        </button>

        <button
          onClick={exportCSV}
          className="flex items-center gap-2 rounded bg-cyan-600 px-3 py-2 text-sm hover:bg-cyan-500"
        >

          <Download size={16} />

          Export CSV

        </button>

      </div>

    </div>
  );
}