import { useEffect, useState } from "react";

export default function useLiveChart(sessionId, totalRecords = 0) {
  const [history, setHistory] = useState([]);
  const [alerts, setAlerts] = useState([]);

  const [latest, setLatest] = useState({
    dataPoint: 0,
    timestamp: "",
    voltage: 0,
    current: 0,
    power: 0,
    capacity: 0,
    energy: 0,
  });

  useEffect(() => {
    if (!sessionId) return;

    // Reset previous session data
    setHistory([]);
    setAlerts([]);

    setLatest({
      dataPoint: 0,
      timestamp: "",
      voltage: 0,
      current: 0,
      power: 0,
      capacity: 0,
      energy: 0,
    });

    const eventSource = new EventSource(
      `http://localhost:8000/api/sessions/${sessionId}/stream`
    );

    eventSource.addEventListener("record", (event) => {
      const record = JSON.parse(event.data);

      const packet = {
        dataPoint: record.dataPoint,
        timestamp: record.dt,
        voltage: record.v,
        current: record.i,
        power: record.p,
        capacity: record.cap,
        energy: record.e,
      };

      setLatest(packet);

      setHistory((prev) => {
        const next = [...prev, packet];

        // Keep only recent points for smoother chart rendering
        if (next.length > 60) {
          next.shift();
        }

        return next;
      });
    });

    eventSource.addEventListener("alert", (event) => {
      const backendAlert = JSON.parse(event.data);

      const alert = {
        dataPoint: backendAlert.dataPoint,
        time: backendAlert.time.split,  //(" ")
        type:
          backendAlert.class === "Prompt"
            ? "PROMPT"
            : backendAlert.class === "Record"
            ? "RECORD"
            : backendAlert.class.toUpperCase(),
        message:
          backendAlert.detailedLogDescription || backendAlert.event,
      };

      setAlerts((prev) => {
        const next = [...prev, alert];

        if (next.length > 100) {
          next.shift();
        }

        return next;
      });
    });
//add this complete message before this changed the records loo[p condition
    eventSource.addEventListener("complete", (event) => {
  const data = JSON.parse(event.data);

  console.log(data.message);

  eventSource.close();
});

    eventSource.onerror = (err) => {
      console.error("SSE Error:", err);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [sessionId]);

  return {
    latest,
    history,
    alerts,
    totalRecords,
  };
}






// import { useEffect, useState } from "react";

// const SESSION_ID = "6a5cf7583db625f5c224303f";
// const TOTAL_RECORDS = 2475;

// export default function useLiveChart() {
//   const [history, setHistory] = useState([]);
//   const [alerts, setAlerts] = useState([]);

//   const [latest, setLatest] = useState({
//     dataPoint: 0,
//     timestamp: "",
//     voltage: 0,
//     current: 0,
//     power: 0,
//     capacity: 0,
//     energy: 0,
//   });

//   useEffect(() => {
//     const eventSource = new EventSource(
//       `http://localhost:8000/api/sessions/${SESSION_ID}/stream`
//     );

//     eventSource.addEventListener("record", (event) => {
//       const record = JSON.parse(event.data);

//       const packet = {
//         dataPoint: record.dataPoint,
//         timestamp: record.dt,
//         voltage: record.v,
//         current: record.i,
//         power: record.p,
//         capacity: record.cap,
//         energy: record.e,
//       };

//       setLatest(packet);

//       setHistory((prev) => {
//         const next = [...prev, packet];

//         if (next.length > 60) {
//           next.shift();
//         }

//         return next;
//       });
//     });

//     eventSource.addEventListener("alert", (event) => {
//       const backendAlert = JSON.parse(event.data);

//       const alert = {
//         dataPoint: backendAlert.dataPoint,
//         time: backendAlert.time.split(" "),//removed [1]
//         type:
//           backendAlert.class === "Prompt"
//             ? "PROMPT"
//             : backendAlert.class === "Record"
//             ? "RECORD"
//             : backendAlert.class.toUpperCase(),
//         message:
//           backendAlert.detailedLogDescription || backendAlert.event,
//       };

//       setAlerts((prev) => {
//         const next = [...prev, alert];

//         if (next.length > 100) {
//           next.shift();
//         }

//         return next;
//       });
//     });

//     eventSource.onerror = (err) => {
//       console.error("SSE Error:", err);
//       eventSource.close();
//     };

//     return () => {
//       eventSource.close();
//     };
//   }, []);

//   return {
//     latest,
//     history,
//     alerts,
//     totalRecords: TOTAL_RECORDS,
//   };
// }