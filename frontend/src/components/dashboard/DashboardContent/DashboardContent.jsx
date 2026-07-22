import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import UploadToolbar from "../UploadToolbar/UploadToolbar";
import DeviceInfoBar from "../DeviceInfoBar/DeviceInfoBar";
import MetricCard from "../MetricCard/MetricCard";
import BatteryChart from "../../charts/LineChart/LineChart";
import AlertPanel from "../AlertPanel/AlertPanel";
import CycleSummary from "../CycleSummary/CycleSummary";
import StepTable from "../../tables/StepTable/StepTable";
import TestConfiguration from "../TestConfiguration/TestConfiguration";
import ReferenceCurve from "../ReferenceCurve/ReferenceCurve";
import IdleLog from "../IdleLog/IdleLog";
import StatusBar from "../../layout/StatusBar";

import useLiveChart from "../../../hooks/useLiveChart";
import TestDetails from "../TestConfiguration/TestDetails";
import TestStepPlan from "../TestConfiguration/TestStepPlan";

import {
  getSessions,
  getSession,
  uploadSession,
  exportSession,
} from "../../../services/sessionService";

export default function DashboardContent() {
  const [selectedSessionId, setSelectedSessionId] = useState(null);

  const [sessionInfo, setSessionInfo] = useState({
    id: null,
    unit: null,
    test: null,
    cycle: [],
    steps: [],
    records: [],
    recordCount: 0,
    curveImageUrl: "",
    curveLabel: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDefaultSession();
  }, []);

  async function loadDefaultSession() {
    try {
      setLoading(true);

      const sessions = await getSessions();

      if (!sessions.length) return;

      const defaultSession =
        sessions.find((s) => s.isDefault) || sessions[0];

      const details = await getSession(defaultSession.id);

      setSelectedSessionId(defaultSession.id);

      setSessionInfo({
        ...details,
        id: defaultSession.id,
      });
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleImport(file) {
    try {
      toast.loading("Uploading...", {
        id: "upload",
      });

      const uploaded = await uploadSession(file);

      const details = await getSession(uploaded.id);

      setSelectedSessionId(uploaded.id);

      setSessionInfo({
        ...details,
        id: uploaded.id,
      });

      toast.success("Upload successful", {
        id: "upload",
      });
    } catch (err) {
      console.error(err);

      toast.error(err.message, {
        id: "upload",
      });
    }
  }

  async function handleExport() {
    try {
      await exportSession(selectedSessionId);

      toast.success("Export completed");
    } catch (err) {
      toast.error(err.message);
    }
  }

  const {
    latest,
    history,
    alerts,
    totalRecords,
  } = useLiveChart(
    selectedSessionId,
    sessionInfo.recordCount
  );

  const metrics = [
    {
      title: "Voltage",
      value: latest.voltage,
      unit: "V",
      color: "#39E5C4",
    },
    {
      title: "Current",
      value: latest.current,
      unit: "A",
      color: "#F59E0B",
    },
    {
      title: "Power",
      value: latest.power,
      unit: "W",
      color: "#FB923C",
    },
    {
      title: "Capacity",
      value: latest.capacity,
      unit: "Ah",
      color: "#4ADE80",
    },
    {
      title: "Energy",
      value: latest.energy,
      unit: "Wh",
      color: "#38BDF8",
    },
    {
      title: "Internal Resistance",
      value: latest.energy,
      unit: "mΩ",
      color: "#38BDF8",
    },
    {
      title: "Temperature",
      value: latest.energy,
      unit: "℃",
      color: "#38BDF8",
    },
    {
      title: "Air Pressure",
      value: latest.energy,
      unit: "kPa",
      color: "#38BDF8",
    },

  ];

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center text-slate-400">
        Loading session...
      </div>
    );
  }

  return (
    <>
      <UploadToolbar
        session={{
          id: sessionInfo.id,
          name: sessionInfo.unit?.filename,
          device: sessionInfo.unit?.device,
          records: sessionInfo.recordCount,
        }}
        onImport={handleImport}
        onExport={handleExport}
      />

      <DeviceInfoBar
        unit={sessionInfo.unit}
        test={sessionInfo.test}
      />

      <div className="mb-4 rounded-lg border border-cyan-500/20 bg-[#181C24] px-4 py-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-400">
            Current Data Point
          </span>

          <span className="font-mono text-lg font-bold text-cyan-400">
            {latest.dataPoint} / {totalRecords}
          </span>
        </div>
      </div>

      <section className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {metrics.map((metric) => (
          <MetricCard
            key={metric.title}
            {...metric}
          />
        ))}
      </section>
            <section className="grid gap-5 xl:grid-cols-12">
        <div className="xl:col-span-8">
          <BatteryChart data={history} />
        </div>

        <div className="xl:col-span-4">
          <AlertPanel alerts={alerts} />
        </div>
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-12">
        <div className="xl:col-span-4">
          <CycleSummary
            cycle={sessionInfo.cycle}
          />
        </div>

        <div className="xl:col-span-8">
          <StepTable
            steps={sessionInfo.steps}
          />
        </div>
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-12">
        <div className="xl:col-span-4">
          <TestConfiguration
            test={sessionInfo.test}
            unit={sessionInfo.unit}
          />
        </div>

        <div className="xl:col-span-8">
          <ReferenceCurve
            curveImageUrl={sessionInfo.curveImageUrl}
            curveLabel={sessionInfo.curveLabel}
            latestVoltage={latest.voltage}
          />
        </div>
      </section>
      <section className="mt-5">
        <IdleLog logs={alerts} />
      </section>

      <section className="mt-5">
        <TestDetails
          test={sessionInfo.test}
       unit={sessionInfo.unit}/>
      </section>

          <section className="mt-5">
           <TestStepPlan
       stepPlan={sessionInfo.test?.stepPlan} />
      </section>





      <StatusBar
  latest={latest}
  totalRecords={totalRecords}
  session={sessionInfo}/>


    </>
  );
}
















// import UploadToolbar from "../UploadToolbar/UploadToolbar";
// import DeviceInfoBar from "../DeviceInfoBar/DeviceInfoBar";
// import MetricCard from "../MetricCard/MetricCard";
// import BatteryChart from "../../charts/LineChart/LineChart";
// import AlertPanel from "../AlertPanel/AlertPanel";
// import CycleSummary from "../CycleSummary/CycleSummary";
// import StepTable from "../../tables/StepTable/StepTable";
// import TestConfiguration from "../TestConfiguration/TestConfiguration";
// import ReferenceCurve from "../ReferenceCurve/ReferenceCurve";
// import IdleLog from "../IdleLog/IdleLog";
// import StatusBar from "../../layout/StatusBar";
// import useLiveChart from "../../../hooks/useLiveChart";

// export default function DashboardContent() {
//   const { latest, history, alerts, totalRecords } = useLiveChart();

//   const metrics = [
//     {
//       title: "Voltage",
//       value: latest.voltage,
//       unit: "V",
//       color: "#39E5C4",
//     },
//     {
//       title: "Current",
//       value: latest.current,
//       unit: "A",
//       color: "#F59E0B",
//     },
//     {
//       title: "Power",
//       value: (latest.power / 1000).toFixed(2),
//       unit: "kW",
//       color: "#FB923C",
//     },
//     {
//       title: "Capacity",
//       value: latest.capacity,
//       unit: "Ah",
//       color: "#4ADE80",
//     },
//     {
//       title: "Energy",
//       value: latest.energy,
//       unit: "Wh",
//       color: "#38BDF8",
//     },
//   ];

//   return (
//     <>
//       <UploadToolbar />

//       <DeviceInfoBar />

//       {/* Current Data Point */}
//       <div className="mb-4 rounded-lg border border-cyan-500/20 bg-[#181C24] px-4 py-3">
//         <div className="flex items-center justify-between">
//           <span className="text-sm font-medium text-slate-400">
//             Current Data Point
//           </span>

//           <span className="font-mono text-lg font-bold text-cyan-400">
//             {latest.dataPoint} / {totalRecords}
//           </span>
//         </div>
//       </div>

//       <section className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
//         {metrics.map((metric) => (
//           <MetricCard key={metric.title} {...metric} />
//         ))}
//       </section>

//       <section className="grid gap-5 xl:grid-cols-12">
//         <div className="xl:col-span-8">
//           <BatteryChart data={history} />
//         </div>

//         <div className="xl:col-span-4">
//           <AlertPanel />
//         </div>
//       </section>

//       <section className="mt-5 grid gap-5 xl:grid-cols-12">
//         <div className="xl:col-span-4">
//           <CycleSummary />
//         </div>

//         <div className="xl:col-span-8">
//           <StepTable />
//         </div>
//       </section>

//       <section className="mt-5 grid gap-5 xl:grid-cols-12">
//         <div className="xl:col-span-4">
//           <TestConfiguration />
//         </div>

//         <div className="xl:col-span-8">
//           <ReferenceCurve />
//         </div>
//       </section>

//       <section className="mt-5">
//         <IdleLog logs={alerts} />
//       </section>

//       <StatusBar />
//     </>
//   );
// }