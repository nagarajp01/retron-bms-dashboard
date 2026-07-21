import {
  CheckCircle2,
  PlayCircle,
  PauseCircle,
  BatteryCharging,
  Flag,
  AlertTriangle,
} from "lucide-react";

function formatTime(value) {
  if (!value) return "--:--:--";

  try {
    return new Date(value).toLocaleTimeString([], {
      hour12: false,
    });
  } catch {
    return value;
  }
}

function buildEvents(alerts = []) {
  return alerts.map((alert) => ({
    time: formatTime(
      alert.timestamp ||
        alert.dt ||
        alert.time
    ),

    title:
      alert.title ||
      alert.stepType ||
      alert.type ||
      "Battery Event",

    subtitle:
      alert.message ||
      alert.description ||
      (alert.voltage
        ? `Voltage ${Number(alert.voltage).toFixed(2)} V`
        : "Live battery event"),

    type:
      alert.type ||
      alert.status ||
      (alert.stepType?.toLowerCase().includes("charge")
        ? "charge"
        : alert.stepType?.toLowerCase().includes("rest")
        ? "rest"
        : "process"),
  }));
}

function getIcon(type) {
  switch (type) {
    case "start":
      return (
        <PlayCircle
          className="text-green-400"
          size={20}
        />
      );

    case "charge":
      return (
        <BatteryCharging
          className="text-cyan-400"
          size={20}
        />
      );

    case "rest":
      return (
        <PauseCircle
          className="text-yellow-400"
          size={20}
        />
      );

    case "complete":
      return (
        <Flag
          className="text-violet-400"
          size={20}
        />
      );

    default:
      return (
        <CheckCircle2
          className="text-emerald-400"
          size={20}
        />
      );
  }
}

export default function AlertPanel({
  alerts = [],
}) {
  const events = buildEvents(alerts);

  return (
    <div className="rounded-xl border border-[#2B3341] bg-[#171B23] shadow-lg">

      <div className="flex items-center justify-between border-b border-[#2B3341] px-5 py-4">

        <div>

          <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
            Live Events
          </p>

          <h3 className="mt-1 text-lg font-semibold text-white">
            Test Timeline
          </h3>

        </div>

        <div className="flex items-center gap-2 rounded-full bg-red-500/10 px-3 py-1">

          <AlertTriangle
            size={15}
            className="text-red-400"
          />

          <span className="text-xs text-red-400">
            LIVE
          </span>

        </div>

      </div>

      <div className="max-h-[520px] overflow-y-auto">

        {events.length === 0 ? (

          <div className="px-5 py-8 text-center text-slate-500">
            Waiting for live battery events...
          </div>

        ) : (
                    events.map((event, index) => (

            <div
              key={index}
              className="group flex gap-4 border-b border-[#232B38] px-5 py-4 transition hover:bg-[#1C2330]"
            >

              <div className="mt-1">
                {getIcon(event.type)}
              </div>

              <div className="flex-1">

                <div className="flex items-center justify-between">

                  <h4 className="font-medium text-slate-100">
                    {event.title}
                  </h4>

                  <span className="text-xs text-slate-500">
                    {event.time}
                  </span>

                </div>

                <p className="mt-1 text-sm text-slate-400">
                  {event.subtitle}
                </p>

              </div>

            </div>

          ))

        )}

      </div>

    </div>
  );
}







// import {
//   CheckCircle2,
//   PlayCircle,
//   PauseCircle,
//   BatteryCharging,
//   Flag,
//   AlertTriangle,
// } from "lucide-react";

// const events = [
//   {
//     time: "02:45:46",
//     title: "Test Started",
//     subtitle: "Session initialized",
//     type: "start",
//   },
//   {
//     time: "02:45:48",
//     title: "CCCV Charge",
//     subtitle: "Charging step active",
//     type: "charge",
//   },
//   {
//     time: "04:31:15",
//     title: "Rest Step",
//     subtitle: "Battery stabilization",
//     type: "rest",
//   },
//   {
//     time: "04:46:32",
//     title: "Constant Current",
//     subtitle: "Discharge running",
//     type: "process",
//   },
//   {
//     time: "07:18:10",
//     title: "Cycle Completed",
//     subtitle: "Cycle #1 finished",
//     type: "complete",
//   },
// ];

// function getIcon(type) {
//   switch (type) {
//     case "start":
//       return (
//         <PlayCircle
//           className="text-green-400"
//           size={20}
//         />
//       );

//     case "charge":
//       return (
//         <BatteryCharging
//           className="text-cyan-400"
//           size={20}
//         />
//       );

//     case "rest":
//       return (
//         <PauseCircle
//           className="text-yellow-400"
//           size={20}
//         />
//       );

//     case "complete":
//       return (
//         <Flag
//           className="text-violet-400"
//           size={20}
//         />
//       );

//     default:
//       return (
//         <CheckCircle2
//           className="text-emerald-400"
//           size={20}
//         />
//       );
//   }
// }

// export default function AlertPanel() {
//   return (
//     <div className="rounded-xl border border-[#2B3341] bg-[#171B23] shadow-lg">

//       {/* Header */}

//       <div className="flex items-center justify-between border-b border-[#2B3341] px-5 py-4">

//         <div>

//           <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
//             Live Events
//           </p>

//           <h3 className="mt-1 text-lg font-semibold text-white">
//             Test Timeline
//           </h3>

//         </div>

//         <div className="flex items-center gap-2 rounded-full bg-red-500/10 px-3 py-1">

//           <AlertTriangle
//             size={15}
//             className="text-red-400"
//           />

//           <span className="text-xs text-red-400">
//             LIVE
//           </span>

//         </div>

//       </div>

//       {/* Timeline */}

//       <div className="max-h-[520px] overflow-y-auto">

//         {events.map((event, index) => (

//           <div
//             key={index}
//             className="group flex gap-4 border-b border-[#232B38] px-5 py-4 transition hover:bg-[#1C2330]"
//           >

//             <div className="mt-1">
//               {getIcon(event.type)}
//             </div>

//             <div className="flex-1">

//               <div className="flex items-center justify-between">

//                 <h4 className="font-medium text-slate-100">
//                   {event.title}
//                 </h4>

//                 <span className="text-xs text-slate-500">
//                   {event.time}
//                 </span>

//               </div>

//               <p className="mt-1 text-sm text-slate-400">
//                 {event.subtitle}
//               </p>

//             </div>

//           </div>

//         ))}

//       </div>

//     </div>
//   );
// }