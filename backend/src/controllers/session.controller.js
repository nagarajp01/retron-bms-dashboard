import TestSession from "../models/testSession.model.js";
import { parseTestSheetFile } from "../utils/parseTestSheet.js";
import ExcelJS from "exceljs";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const MEDIA_OUTPUT_DIR = path.join(__dirname, "../../public/static");

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

// POST /api/sessions/upload  (multipart/form-data, field name: "file")
// Parses the uploaded .xlsx using the SAME generic parser used for the
// default dataset, then saves it as a new, separate session.
export const uploadSession = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded. Field name must be 'file'." });
    }

    const filePath = req.file.path;
    const sessionId = `upload-${Date.now()}`;

    const parsed = parseTestSheetFile(filePath, {
      sessionId,
      mediaOutputDir: MEDIA_OUTPUT_DIR
    });

    const name = req.body.name || req.file.originalname.replace(/\.xlsx$/i, "");

    const session = new TestSession({
      name,
      isDefault: false,
      ...parsed
    });

    await session.save();

    // Clean up the temp uploaded file now that it's parsed and stored in Mongo
    fs.unlink(filePath, (err) => {
      if (err) console.error("Failed to delete temp upload file:", err.message);
    });

    res.status(201).json({
      id: session._id,
      name: session.name,
      isDefault: session.isDefault
    });
  } catch (err) {
    console.error("uploadSession error:", err.message);
    res.status(500).json({ error: "Failed to parse and save uploaded file. Make sure it matches the expected Neware export format." });
  }
};

// GET /api/sessions/:id/export
// Rebuilds the ENTIRE original workbook (all 8 sheets) from what's stored
// in MongoDB, including re-inserting the curve chart image.
export const exportSession = async (req, res) => {
  try {
    const session = await TestSession.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    const wb = new ExcelJS.Workbook();

    // ---- unit sheet ----
    const unitSheet = wb.addWorksheet("unit");
    unitSheet.addRow([session.unit.filename]);
    unitSheet.addRow(["device", ...session.unit.device.split("-")]);
    unitSheet.addRow(["Start time", "", session.unit.startTime, "", "End time", "", session.unit.endTime]);
    unitSheet.addRow(session.unit.columns.map((c) => c.name));
    unitSheet.addRow(session.unit.columns.map((c) => c.unit));

    // ---- test sheet ----
    const testSheet = wb.addWorksheet("test");
    const t = session.test;
    testSheet.addRow(["Test information"]);
    testSheet.addRow(["Start step ID", "", t.startStepId, "Volt. upper", "", t.voltUpper ?? "-", "P/N", "", t.pn ?? "-"]);
    testSheet.addRow(["Cycle count", "", t.cycleCount, "Volt. lower", "", t.voltLower ?? "-", "Builder", "", t.builder ?? "-"]);
    testSheet.addRow(["Record settings", "", t.recordSettings, "Curr. upper", "", t.currUpper ?? "-", "Remarks", "", t.remarks ?? "-"]);
    testSheet.addRow(["Voltage range", "", t.voltageRange, "Curr. lower", "", t.currLower ?? "-", "Step Name", "", t.stepName]);
    testSheet.addRow(["Current range", "", t.currentRange, "Start time", "", t.startTime, "Barcode", "", t.barcode ?? "-"]);
    testSheet.addRow(["Active material", "", t.activeMaterial, "Nominal capacity", "", t.nominalCapacity]);
    testSheet.addRow([]);
    testSheet.addRow(["Step plan"]);
    if (t.stepPlan && t.stepPlan.length > 0) {
      const planCols = Object.keys(t.stepPlan[0]);
      testSheet.addRow(planCols);
      t.stepPlan.forEach((row) => {
        testSheet.addRow(planCols.map((c) => row[c] ?? ""));
      });
    }

    // ---- cycle sheet (array — supports 1 or many cycles) ----
    const cycleSheet = wb.addWorksheet("cycle");
    if (session.cycle && session.cycle.length > 0) {
      const cycleCols = Object.keys(session.cycle[0]);
      cycleSheet.addRow(cycleCols);
      session.cycle.forEach((row) => {
        cycleSheet.addRow(cycleCols.map((c) => row[c]));
      });
    }

    // ---- step sheet ----
    const stepSheet = wb.addWorksheet("step");
    if (session.steps && session.steps.length > 0) {
      const stepCols = Object.keys(session.steps[0].toObject ? session.steps[0].toObject() : session.steps[0]);
      stepSheet.addRow(stepCols);
      session.steps.forEach((row) => {
        const obj = row.toObject ? row.toObject() : row;
        stepSheet.addRow(stepCols.map((c) => obj[c]));
      });
    }

    // ---- record sheet (full resolution) ----
    const recordSheet = wb.addWorksheet("record");
    recordSheet.addRow(["DataPoint", "Step Type", "Time", "Total Time", "Current(A)", "Voltage(V)", "Capacity(Ah)", "Energy(Wh)", "Date", "Power(W)"]);
    session.records.forEach((r) => {
      recordSheet.addRow([r.dataPoint, r.stepType, r.t, r.totalTime, r.i, r.v, r.cap, r.e, r.dt, r.p]);
    });

    // ---- log sheet ----
    const logSheet = wb.addWorksheet("log");
    logSheet.addRow(["No.", "DataPoint", "Time", "Class", "Event", "Detailed log", "Detailed log description"]);
    session.logs.forEach((l) => {
      logSheet.addRow([l.no, l.dataPoint, l.time, l.class, l.event, l.detailedLog ?? "", l.detailedLogDescription ?? ""]);
    });

    // ---- idle sheet (headers only if empty, matching original) ----
    const idleSheet = wb.addWorksheet("idle");
    if (session.idle?.columns?.length > 0) {
      idleSheet.addRow(session.idle.columns);
      (session.idle.rows || []).forEach((row) => idleSheet.addRow(row));
    }

    // ---- curve sheet (label + re-inserted image) ----
    const curveSheet = wb.addWorksheet("curve");
    curveSheet.addRow([session.curveLabel || ""]);

    if (session.curveImageUrl) {
      const imgPath = path.join(__dirname, "../../public", session.curveImageUrl.replace(/^\/static/, "static"));
      if (fs.existsSync(imgPath)) {
        const imageId = wb.addImage({
          filename: imgPath,
          extension: "jpeg"
        });
        curveSheet.addImage(imageId, {
          tl: { col: 0, row: 2 },
          ext: { width: 648, height: 648 }
        });
      }
    }

    // ---- send the file ----
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename="${session.name}_export.xlsx"`);

    await wb.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error("exportSession error:", err.message);
    res.status(500).json({ error: "Failed to export session" });
  }
};