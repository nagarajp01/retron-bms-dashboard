import XLSX from "xlsx";
import fs from "fs";
import AdmZip from "adm-zip";
import path from "path";

// Reads an uploaded Neware-format .xlsx file and returns an object
// matching the TestSession Mongoose schema shape.
// Does NOT hardcode any sample values — everything is read from
// whatever file is passed in, so this works for future uploads too.

const num = (v) => (v === undefined || v === "" || v === null || Number.isNaN(Number(v)) ? v : Number(v));

function parseUnitSheet(workbook) {
  const sheet = workbook.Sheets["unit"];
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false });

  const columns = [];
  const headerRow = rows[5] || [];
  const unitRow = rows[6] || [];
  headerRow.forEach((name, i) => {
    if (name) columns.push({ name: String(name), unit: unitRow[i] ? String(unitRow[i]) : "" });
  });

  return {
    filename: rows[0]?.[0] || "",
    device: [rows[1]?.[1], rows[1]?.[2], rows[1]?.[3]].filter(Boolean).join("-"),
    startTime: rows[2]?.[2] || "",
    endTime: rows[2]?.[6] || "",
    ndaFilePath:rows[3]?.[2] || "",
    columns
  };
}

function parseTestSheet(workbook) {
  const sheet = workbook.Sheets["test"];
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false });

  const testConfig = {
    startStepId: rows[1]?.[2],
    cycleCount: rows[2]?.[2],
    recordSettings: rows[3]?.[2],
    voltageRange: rows[4]?.[2],
    currentRange: rows[5]?.[2],
    activeMaterial: rows[6]?.[2],
    voltUpper: rows[1]?.[5],
    voltLower: rows[2]?.[5],
    currUpper: rows[3]?.[5],
    currLower: rows[4]?.[5],
    startTime: rows[5]?.[5],
    nominalCapacity: rows[6]?.[5],
    pn: rows[1]?.[8],
    builder: rows[2]?.[7],
    remarks: rows[3]?.[7],
    stepName: rows[4]?.[8],
    barcode: rows[5]?.[7],
    stepPlan: []
  };

  // Find the "Step plan" header row dynamically instead of assuming row 10,
  // so this still works if a future file has a slightly different layout.
  let planHeaderIdx = rows.findIndex((r) => r[0] === "Step Index");
  if (planHeaderIdx === -1) planHeaderIdx = 10; // fallback to known layout

  const planCols = rows[planHeaderIdx] || [];
  for (let i = planHeaderIdx + 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.every((c) => c === undefined || c === "")) continue;
    const entry = {};
    planCols.forEach((colName, c) => {
      if (colName) entry[String(colName).trim()] = row[c] ?? null;
    });
    testConfig.stepPlan.push(entry);
  }

  return testConfig;
}

function parseCycleSheet(workbook) {
  const sheet = workbook.Sheets["cycle"];
  // header:0 (first row as column names) — cleanly returns one object per row.
  const rows = XLSX.utils.sheet_to_json(sheet, { defval: null });
  return rows; // ARRAY — supports 1 or many cycles
}

function parseStepSheet(workbook) {
  const sheet = workbook.Sheets["step"];
  const rows = XLSX.utils.sheet_to_json(sheet, { defval: null });
  return rows;
}

function parseRecordSheet(workbook) {
  const sheet = workbook.Sheets["record"];
  const rows = XLSX.utils.sheet_to_json(sheet, { defval: null });
  return rows.map((row) => ({
    dataPoint: num(row["DataPoint"]),
    stepType: row["Step Type"],
    t: row["Time"],
    totalTime: row["Total Time"],
    i: num(row["Current(A)"]),
    v: num(row["Voltage(V)"]),
    cap: num(row["Capacity(Ah)"]),
    e: num(row["Energy(Wh)"]),
    dt: row["Date"],
    p: num(row["Power(W)"])
  }));
}

function parseLogSheet(workbook) {
  const sheet = workbook.Sheets["log"];
  if (!sheet) return [];
  const rows = XLSX.utils.sheet_to_json(sheet, { defval: null });
  return rows.map((row) => ({
    no: num(row["No."]),
    dataPoint: num(row["DataPoint"]),
    time: row["Time"],
    class: row["Class"],
    event: row["Event"],
    detailedLog: row["Detailed log"],
    detailedLogDescription: row["Detailed log description"] ?? row["Detailed log description "] // trailing-space variant seen in source file
  }));
}

function parseIdleSheet(workbook) {
  const sheet = workbook.Sheets["idle"];
  if (!sheet) return { columns: [], rows: [] };
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false });
  const columns = (rows[0] || []).filter(Boolean).map(String);
  const dataRows = rows.slice(1).filter((r) => r && r.some((c) => c !== undefined && c !== ""));
  return { columns, rows: dataRows };
}

function extractCurveImage(filePath, outputDir, sessionId) {
  // The .xlsx is a zip; the embedded chart image (if present) lives at
  // xl/media/image1.jpeg. It's sometimes actually a BMP with a .jpeg
  // extension — Node's fs just writes bytes, so this works either way,
  // but for real re-encoding to a proper JPEG, use the "sharp" package.
  try {
    const zip = new AdmZip(filePath);
    const entry = zip.getEntry("xl/media/image1.jpeg");
    if (!entry) return null;

    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
    const outPath = path.join(outputDir, `${sessionId}_curve.jpg`);
    fs.writeFileSync(outPath, entry.getData());
    return outPath;
  } catch (err) {
    console.error("Curve image extraction failed:", err.message);
    return null;
  }
}

/**
 * Main entry point. Call this with the uploaded file's disk path.
 * Returns an object matching the TestSession schema (minus name/isDefault,
 * which the caller sets).
 */
export function parseTestSheetFile(filePath, { sessionId, mediaOutputDir } = {}) {
  const workbook = XLSX.readFile(filePath, { cellDates: false });

  const unit = parseUnitSheet(workbook);
  const test = parseTestSheet(workbook);
  const cycle = parseCycleSheet(workbook);
  const steps = parseStepSheet(workbook);
  const records = parseRecordSheet(workbook);
  const logs = parseLogSheet(workbook);
  const idle = parseIdleSheet(workbook);

  const curveSheet = workbook.Sheets["curve"];
  const curveLabel = curveSheet
    ? XLSX.utils.sheet_to_json(curveSheet, { header: 1 })?.[0]?.[0] || ""
    : "";

  let curveImageUrl = null;
  if (sessionId && mediaOutputDir) {
    const savedPath = extractCurveImage(filePath, mediaOutputDir, sessionId);
    if (savedPath) {
      // Store a URL path the frontend can hit directly, e.g. /static/<id>_curve.jpg
      curveImageUrl = `/static/${path.basename(savedPath)}`;
    }
  }

  return {
    unit,
    test,
    cycle,       // array
    steps,
    idle,
    curveImageUrl,
    curveLabel,
    recordCount: records.length,
    records,
    logs
  };
}
