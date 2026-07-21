// One-off test script — NOT part of the app itself.
// Running this manually to verify the parser works before using it in a route.
// Usage: node src/utils/testParser.js "path/to/96V_50AH_Neware_test_report.xlsx"

import { parseTestSheetFile } from "./parseTestSheet.js";

const filePath = process.argv[2];

if (!filePath) {
  console.error("Usage: node src/utils/testParser.js <path-to-xlsx>");
  process.exit(1);
}

try {
  const result = parseTestSheetFile(filePath, {
    sessionId: "test-run",
    mediaOutputDir: "./temp_media"
  });

  console.log("\n===== unit =====");
  console.log(result.unit);

  console.log("\n===== test (config fields only) =====");
  const { stepPlan, ...testConfigOnly } = result.test;
  console.log(testConfigOnly);
  console.log(`stepPlan rows: ${stepPlan.length}`);
  console.log("stepPlan[0]:", stepPlan[0]);

  console.log("\n===== cycle (array) =====");
  console.log(`cycle entries: ${result.cycle.length}`);
  console.log(result.cycle[0]);

  console.log("\n===== steps =====");
  console.log(`step entries: ${result.steps.length}`);
  console.log(result.steps[0]);

  console.log("\n===== idle =====");
  console.log(result.idle);

  console.log("\n===== curve =====");
  console.log("curveLabel:", result.curveLabel);
  console.log("curveImageUrl:", result.curveImageUrl);

  console.log("\n===== record =====");
  console.log(`record count: ${result.recordCount}`);
  console.log("records[0]:", result.records[0]);
  console.log("records[last]:", result.records[result.records.length - 1]);

  console.log("\n===== log =====");
  console.log(`log entries: ${result.logs.length}`);
  console.log("logs[2]:", result.logs[2]);

  console.log("\n✅ Parser ran successfully with no errors.");
} catch (err) {
  console.error("\n❌ Parser FAILED:");
  console.error(err);
}