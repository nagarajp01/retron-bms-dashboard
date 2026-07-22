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
      `https://retron-bms-dashboard.onrender.com/api/sessions/${sessionId}/stream`
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
        time: backendAlert.time,  //(" ")
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
      // eventSource.close();
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






