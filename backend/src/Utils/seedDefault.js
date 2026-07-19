import path from "path";
import { fileURLToPath } from "url";
import TestSession from "../models/testSession.model.js";
import { parseTestSheetFile } from "./parseTestSheet.js";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the original sample datasheet, relative to this file.
const DEFAULT_FILE_PATH = path.join(__dirname, "../../sample-data/96V 50AH Neware test report.xlsx");
const MEDIA_OUTPUT_DIR = path.join(__dirname, "../../public/static");

export async function seedDefaultSession() {
 try {
     const existing = await TestSession.findOne({ isDefault: true });
  if (existing) {
    console.log("Default session already seeded, skipping.");
    return;
  }

  console.log("No default session found — parsing and seeding it now...");

  //SMALL IMPROVEMENT

  if(!fs.existsSync(DEFAULT_FILE_PATH)){
    throw new Error(`Default Excel file not found: ${DEFAULT_FILE_PATH}`);
  }

  const parsed = parseTestSheetFile(DEFAULT_FILE_PATH, {
    sessionId: "default-session",
    mediaOutputDir: MEDIA_OUTPUT_DIR
  });

  const session = new TestSession({
    name: "96V_50AH_Neware_Test",
    isDefault: true,
    ...parsed
  });

  await session.save();
  console.log(`Default session seeded successfully. _id: ${session._id}`);
 } catch (error) {
    console.error("Default session seeding failed: ", error)
    
 }
}