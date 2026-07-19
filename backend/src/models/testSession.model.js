import mongoose from "mongoose";

const recordSchema = new mongoose.Schema(
  {
    dataPoint: Number,
    stepType: String,
    t: String,          // elapsed time, e.g. "00:00:10"
    totalTime: String,
    i: Number,           // Current(A)
    v: Number,           // Voltage(V)
    cap: Number,          // Capacity(Ah)
    e: Number,            // Energy(Wh)
    dt: String,           // full timestamp, e.g. "2026-07-01 02:45:56"
    p: Number             // Power(W)
  },
  { _id: false }
);

const logSchema = new mongoose.Schema(
  {
    no: Number,
    dataPoint: Number,
    time: String,
    class: String,        // Prompt / Error / Record
    event: String,
    detailedLog: String,
    detailedLogDescription: String
  },
  { _id: false }
);

const stepSchema = new mongoose.Schema(
  {
    "Cycle Index": Number,
    "Step Index": Number,
    "Step Number": Number,
    "Step Type": String,
    "Step Time": String,
    "Oneset Date": String,
    "End Date": String,
    "Capacity(Ah)": Number,
    "Energy(Wh)": Number,
    "Oneset Volt.(V)": Number,
    "End Voltage(V)": Number
  },
  { _id: false, strict: false } // strict:false in case a future upload has slightly different columns
);

const testSessionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    isDefault: { type: Boolean, default: false },

    unit: {
      filename: String,
      device: String,
      startTime: String,
      endTime: String,
      ndaFilePath:String,
      columns: [{ name: String, unit: String }]
    },

    test: {
      startStepId: mongoose.Schema.Types.Mixed,
      cycleCount: mongoose.Schema.Types.Mixed,
      recordSettings: String,
      voltageRange: String,
      currentRange: String,
      activeMaterial: String,
      voltUpper: mongoose.Schema.Types.Mixed,
      voltLower: mongoose.Schema.Types.Mixed,
      currUpper: mongoose.Schema.Types.Mixed,
      currLower: mongoose.Schema.Types.Mixed,
      startTime: String,
      nominalCapacity: mongoose.Schema.Types.Mixed,
      pn: mongoose.Schema.Types.Mixed,
      builder: String,
      remarks: String,
      stepName: String,
      barcode: mongoose.Schema.Types.Mixed,
      stepPlan: [{ type: mongoose.Schema.Types.Mixed }] // sparse/variable columns, kept flexible
    },

    cycle: [{ type: mongoose.Schema.Types.Mixed }], // small, flat object — flexible for any Neware export

    steps: [stepSchema],

    idle: {
      columns: [String],
      rows: [{ type: mongoose.Schema.Types.Mixed }]
    },

    curveImageUrl: String,
    curveLabel: String,

    recordCount: Number,
    records: [recordSchema],
    logs: [logSchema]
  },
  { timestamps: true }
);

const TestSession = mongoose.model("TestSession", testSessionSchema);

export default TestSession;