import {
  Activity,
  Clock3,
  RadioTower,
} from "lucide-react";

import useElapsedTimer from "../../../hooks/useElapsedTimer";

export default function ChartHeader() {
  const elapsed = useElapsedTimer();

  return (
    <div className="border-b border-[#2A313D] bg-[#171B23] px-6 py-4">

      <div className="flex flex-wrap items-center justify-between gap-4">

        {/* LEFT */}

        <div className="flex items-center gap-4">

          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10">

            <Activity
              size={24}
              className="text-cyan-400"
            />

          </div>

          <div>

            <h2 className="text-lg font-semibold tracking-wide text-white">
              Live Battery Monitoring
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Real-Time Engineering Measurements
            </p>

          </div>

        </div>

        {/* RIGHT */}

        <div className="flex flex-wrap items-center gap-5">

          {/* Recording */}

          <div className="flex items-center gap-2 rounded-lg border border-green-500/20 bg-green-500/10 px-4 py-2">

            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-green-400" />

            {/* <span className="text-sm font-semibold text-green-400">
              RECORDING
            </span> */}

          </div>

          {/* Live */}

          <div className="flex items-center gap-2 rounded-lg border border-cyan-500/20 bg-cyan-500/10 px-4 py-2">

            <RadioTower
              size={16}
              className="text-cyan-400"
            />

            <span className="text-sm text-cyan-300">
              LIVE STREAM
            </span>

          </div>

          {/* Timer */}

          <div className="flex items-center gap-3 rounded-lg border border-[#313846] bg-[#202733] px-4 py-2">

            <Clock3
              size={17}
              className="text-orange-400"
            />

            <div>

              <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
                Elapsed Time
              </p>

              <p className="font-semibold text-white">
                {elapsed}
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}