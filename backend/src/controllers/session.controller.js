import TestSession from "../models/testSession.model.js";

// GET /api/sessions
export const listSessions = async (req, res) => {
  try {
    const sessions = await TestSession.find({}, "name isDefault createdAt updatedAt");
    const formatted = sessions.map((s) => ({
      id: s._id,
      name: s.name,
      isDefault: s.isDefault,
      uploadedAt: s.createdAt
    }));
    res.json(formatted);
  } catch (err) {
    console.error("listSessions error:", err.message);
    res.status(500).json({ error: "Failed to fetch sessions" });
  }
};

// GET /api/sessions/:id
// Returns everything EXCEPT the large records/logs arrays — those are
// only sent through the live /stream route, not this one.
export const getSessionById = async (req, res) => {
  try {
    const session = await TestSession.findById(req.params.id).select("-records -logs");
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }
    res.json(session);
  } catch (err) {
    console.error("getSessionById error:", err.message);
    res.status(500).json({ error: "Failed to fetch session" });
  }
};

// GET /api/sessions/:id/stream  (Server-Sent Events)
// Replays the session's records array one at a time on an interval,
// simulating a live feed. Alerts fire in sync by comparing each
// record's real timestamp against pending log entries' timestamps.
export const streamSession = async (req, res) => {
  const session = await TestSession.findById(req.params.id);
  if (!session) {
    return res.status(404).end();
  }

  res.set({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive"
  });
  res.flushHeaders();

  const records = session.records;
  const logs = session.logs;

  let idx = 0;
  let logPtr = 0;

  const interval = setInterval(() => {
    if (idx >= records.length) {
      idx = 0;
      logPtr = 0;
    }
    const r = records[idx];

    res.write(`event: record\ndata: ${JSON.stringify(r)}\n\n`);

    while (logPtr < logs.length && logs[logPtr].time <= r.dt) {
      res.write(`event: alert\ndata: ${JSON.stringify(logs[logPtr])}\n\n`);
      logPtr++;
    }

    idx++;
  }, 400);

  // Stop the interval when the client disconnects, so we don't leak timers
  req.on("close", () => {
    clearInterval(interval);
  });
};
